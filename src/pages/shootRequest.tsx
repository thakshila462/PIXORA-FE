import { useState, useEffect } from "react";
import api from "../service/api"; 
import {
  Camera,
  // MapPin,
  CheckCircle2,
  XCircle,
  Clock4,
  Search,
  User,
  Mail,
  Coins,
  FileText,
  // Star,
  Loader2,
  Phone,
  CreditCard // ⚡ අලුත් Icon එකක්
} from "lucide-react";

interface IShootRequest {
  _id: string;
  serviceId: string;
  name: string;
  email: string;
  phone?: string;
  packageId: string; 
  duration: number;
  serviceType: string;
  totalCost: number;
  note?: string;
  rating?: number;
  userLat?: number;
  userLng?: number;
  status: "pending" | "confirmed" | "cancelled"; 
  isPaid: boolean; // ⚡ UI Interface එකට එකතු කලා
  createdAt: string;
}

const ShootRequests = () => {
  const [requests, setRequests] = useState<IShootRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null); // ⚡ Payment Loading State
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/service-request"); 
      setRequests(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load real shoot requests from server:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: "confirmed" | "cancelled") => {
    setActionLoadingId(id);
    try {
      await api.patch(`/service-request/${id}/status`, { status: newStatus });
      setRequests(prev =>
        prev.map(req => (req._id === id ? { ...req, status: newStatus } : req))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ==========================================
  // ⚡ TOGGLE REALTIME PAYMENT STATUS ON CLICK
  // ==========================================
  const handlePaymentToggle = async (id: string, currentPaidStatus: boolean) => {
    setPaymentLoadingId(id);
    const nextStatus = !currentPaidStatus; // true නම් false කරයි, false නම් true කරයි
    try {
      await api.patch(`/service-request/${id}/payment`, { isPaid: nextStatus });
      setRequests(prev =>
        prev.map(req => (req._id === id ? { ...req, isPaid: nextStatus } : req))
      );
    } catch (err) {
      console.error("Payment status error:", err);
      alert("Failed to update payment status.");
    } finally {
      setPaymentLoadingId(null);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch =
      req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.serviceId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeFilter === "all" || req.status === activeFilter;
    return matchesSearch && matchesTab;
  });

  const countPending = requests.filter(r => r.status === "pending").length;
  const countConfirmed = requests.filter(r => r.status === "confirmed").length;
  // ⚡ දැන් Real Revenue එක හැදෙන්නේ ඇත්තටම Paid කරපු ඒවගෙන් විතරයි:
  const totalPaidRevenue = requests.filter(r => r.isPaid === true).reduce((acc, curr) => acc + curr.totalCost, 0);

  return (
    <div className="min-h-screen bg-[#030508] text-slate-100 font-sans pb-12 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[250px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="relative z-10 bg-neutral-950/40 backdrop-blur-md px-6 py-5 flex justify-between items-center shadow-2xl border-b border-neutral-900/60">
        <div className="flex items-center gap-3 text-xl font-black tracking-tight">
          <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-xl">
            <Camera className="w-5 h-5 text-pink-500" />
          </div>
          <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            PIXORA <span className="text-pink-500 font-medium text-base ml-1">Admin Dashboard</span>
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 mt-10 space-y-8">
        
        {/* COUNTER CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-neutral-950/60 backdrop-blur-xl p-5 rounded-2xl border border-neutral-900 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">{countPending}</h3>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Pending Review</p>
            </div>
            <Clock4 className="w-8 h-8 text-amber-500 bg-amber-500/5 p-1.5 rounded-xl" />
          </div>

          <div className="bg-neutral-950/60 backdrop-blur-xl p-5 rounded-2xl border border-neutral-900 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">{countConfirmed}</h3>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Confirmed Shoots</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 bg-emerald-500/5 p-1.5 rounded-xl" />
          </div>

          <div className="bg-neutral-950/60 backdrop-blur-xl p-5 rounded-2xl border border-neutral-900 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-emerald-400">Rs. {totalPaidRevenue.toLocaleString()}</h3>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total Revenue Received (Paid)</p>
            </div>
            <Coins className="w-8 h-8 text-emerald-400 bg-emerald-500/5 p-1.5 rounded-xl" />
          </div>
        </section>

        {/* SEARCH AND FILTERS */}
        <section className="bg-neutral-950 border border-neutral-900 p-6 rounded-3xl shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "confirmed", "cancelled"].map(statusTab => (
                <button
                  key={statusTab}
                  onClick={() => setActiveFilter(statusTab)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                    activeFilter === statusTab
                      ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white border-transparent"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400"
                  }`}
                >
                  {statusTab}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Filter by ID, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none"
              />
            </div>
          </div>

          {/* DATA TABLE */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-pink-500">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Loading Datastream...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-neutral-900 bg-neutral-950/40">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-900/50 border-b border-neutral-900 text-[10px] font-black uppercase tracking-widest text-pink-400">
                    <th className="p-4">Service ID</th>
                    <th className="p-4">Client Profiling</th>
                    <th className="p-4">Configuration</th>
                    <th className="p-4">Cost & Payment Status</th> {/* ⚡ Header වෙනස් කලා */}
                    <th className="p-4">Shoot Status</th>
                    <th className="p-4 text-center">Administrative Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-xs">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-neutral-600 py-12 font-bold uppercase tracking-wider">
                        No shoot blueprints found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map(req => (
                      <tr key={req._id} className="hover:bg-white/[0.01] transition-colors duration-150 align-top">
                        
                        {/* ID */}
                        <td className="p-4 space-y-1 font-mono">
                          <div className="text-white font-bold tracking-tight select-all flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-neutral-500" /> {req.serviceId}
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        {/* CLIENT USER */}
                        <td className="p-4 space-y-1">
                          <div className="font-bold text-slate-200 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-pink-500/60" /> {req.name}
                          </div>
                          <div className="text-neutral-400 flex items-center gap-1.5 text-[11px] font-mono">
                            <Mail className="w-3.5 h-3.5 text-neutral-600" /> {req.email}
                          </div>
                          {req.phone && (
                            <div className="text-neutral-500 flex items-center gap-1.5 text-[11px]">
                              <Phone className="w-3 h-3 text-neutral-600" /> {req.phone}
                            </div>
                          )}
                        </td>

                        {/* SPECS */}
                        <td className="p-4 space-y-2 max-w-xs">
                          <div>
                            <span className="text-[9px] bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                              ID: {req.packageId}
                            </span>
                            <div className="mt-1 text-slate-300 font-medium">
                              Mode: <span className="text-white uppercase font-bold text-[11px]">{req.serviceType}</span> | Duration: <span className="text-white font-bold">{req.duration} Days</span>
                            </div>
                          </div>
                          {req.note && <p className="text-[11px] text-neutral-500 italic">"{req.note}"</p>}
                        </td>

                        {/* COST & REALTIME PAYMENT INTERACTION */}
                        <td className="p-4 space-y-2">
                          <div className="font-mono font-bold text-white text-sm">
                            Rs. {req.totalCost?.toLocaleString()}
                          </div>
                          
                          {/* ⚡ PAYMENT TOGGLE BADGE BUTTON */}
                          <button
                            disabled={paymentLoadingId === req._id}
                            onClick={() => handlePaymentToggle(req._id, req.isPaid)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                              req.isPaid 
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20" 
                                : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                            }`}
                            title="Click to switch Payment Status"
                          >
                            <CreditCard className="w-3 h-3" />
                            {paymentLoadingId === req._id ? "Processing..." : req.isPaid ? "● Paid" : "○ Unpaid"}
                          </button>
                        </td>

                        {/* SHOOT STATUS BADGE */}
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                            req.status === "pending" ? "bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-pulse" :
                            req.status === "confirmed" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                            "bg-red-500/10 border border-red-500/20 text-red-400"
                          }`}>
                            {req.status}
                          </span>
                        </td>

                        {/* MANAGEMENT BUTTONS */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {req.status === "pending" ? (
                              <>
                                <button
                                  disabled={actionLoadingId !== null}
                                  onClick={() => handleStatusUpdate(req._id, "confirmed")}
                                  className="p-2 bg-neutral-900 hover:bg-emerald-950/20 border border-neutral-800 text-neutral-400 hover:text-emerald-400 rounded-xl transition-all"
                                  title="Confirm Shoot"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  disabled={actionLoadingId !== null}
                                  onClick={() => handleStatusUpdate(req._id, "cancelled")}
                                  className="p-2 bg-neutral-900 hover:bg-red-950/20 border border-neutral-800 text-neutral-400 hover:text-red-400 rounded-xl transition-all"
                                  title="Cancel Shoot"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">
                                Processed
                              </span>
                            )}

                            {actionLoadingId === req._id && (
                              <Loader2 className="w-4 h-4 animate-spin text-pink-500 absolute" />
                            )}
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ShootRequests;