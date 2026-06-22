import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useAuth } from "../context/AuthContext";
import api from "../service/api";

import {
  Users,
  Hourglass,
  CheckCircle2,
  Coins,
  BarChart3,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  X,
  Crown,
  Layers,
  FileText,
  AlertTriangle,
  Loader2
} from "lucide-react";

interface IDashboardCounts {
  users: number;
  totalBookings: number;
  pending: number;
  completed: number;
  cancelled: number;
  revenue: number;
  paid: number;
  mostPopularPackage: string;
  monthlyRevenue: number[];
}

const AdminDashboard = () => {
  const { token } = useAuth();

  const pieChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartInstance = useRef<Chart | null>(null);
  const barChartInstance = useRef<Chart | null>(null);

  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const [counts, setCounts] = useState<IDashboardCounts>({
    users: 0,
    totalBookings: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
    paid: 0,
    mostPopularPackage: "",
    monthlyRevenue: [0, 0, 0, 0, 0, 0],
  });

  // ===============================
  // 📊 LOAD DASHBOARD DATA (CLEAN)
  // ===============================
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const res = await api.get("/admin/dashboard");

        const data = res.data?.data;

        if (!data) throw new Error("Invalid dashboard response");

        setCounts({
          users: data.users,
          totalBookings: data.totalBookings,
          pending: data.pending,
          completed: data.completed,
          cancelled: data.cancelled,
          revenue: data.revenue,
          paid: data.paid,
          mostPopularPackage: data.mostPopularPackage,
          monthlyRevenue: data.monthlyRevenue || [],
        });

      } catch (err: any) {
        console.error(err);
        setDashboardError(
          err?.response?.data?.message || "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) loadDashboard();
  }, [token]);

  // ===============================
  // 📊 CHARTS
  // ===============================
  useEffect(() => {
    if (loading) return;

    if (pieChartInstance.current) pieChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();

    if (pieChartRef.current) {
      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Pending", "Completed", "Cancelled"],
          datasets: [
            {
              data: [
                counts.pending,
                counts.completed,
                counts.cancelled,
              ],
              // 💡 Premium Cyberpunk Neon Colors
              backgroundColor: ["#f59e0b", "#10b981", "#f43f5e"],
              borderColor: "#090d16",
              borderWidth: 3,
            },
          ],
        },
        options: {
          cutout: "75%",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { 
                color: "#94a3b8",
                font: { family: "sans-serif", size: 11, weight: "bold" },
                padding: 16,
                usePointStyle: true,
                pointStyle: "circle"
              },
            },
          },
        },
      });
    }

    if (barChartRef.current) {
      barChartInstance.current = new Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Revenue",
              data: counts.monthlyRevenue,
              // 💡 Matching PIXORA Pink Gradient Tone
              backgroundColor: "#ec4899",
              borderRadius: 6,
              hoverBackgroundColor: "#db2777"
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: { 
              grid: { display: false },
              ticks: { color: "#64748b", font: { size: 10, weight: "bold" } } 
            },
            y: { 
              grid: { color: "rgba(30, 41, 59, 0.5)" },
              ticks: { color: "#64748b", font: { size: 10 } } 
            },
          },
        },
      });
    }
  }, [counts, loading]);

  // ===============================
  // LOADING UI
  // ===============================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#030508] gap-4 text-pink-500 font-sans">
        <div className="relative flex items-center justify-center">
          <Loader2 className="animate-spin w-10 h-10 text-pink-500 absolute" />
          <div className="w-16 h-16 rounded-full border border-pink-500/10 animate-ping"></div>
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mt-2">Syncing HQ Analytics Hub...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030508] text-slate-100 font-sans pb-16 selection:bg-pink-500 selection:text-white relative overflow-hidden">
      
      {/* BACKGROUND NEON GLOW EFFECTS */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[300px] bg-pink-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[-10%] w-[350px] h-[350px] bg-cyan-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

      {/* ERROR STATUS HUB */}
      {dashboardError && (
        <div className="max-w-7xl mx-auto px-6 mt-6 animate-fadeIn">
          <div className="bg-red-500/5 border border-red-500/20 px-5 py-3.5 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold shadow-lg backdrop-blur-md">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 animate-pulse" />
            <span className="font-mono tracking-wide">SYSTEM FAILURE: {dashboardError}</span>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT WRAPPER */}
      <main className="max-w-7xl mx-auto px-6 mt-10 space-y-8 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 bg-neutral-950/30 border border-neutral-900/60 backdrop-blur-xl p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-pink-500 to-fuchsia-600"></div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_#ec4899]"></div>
              <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent uppercase font-mono tracking-wider">
                PIXORA CORE DASHBOARD
              </span>
            </h1>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Real-time enterprise metrics & scheduling operations</p>
          </div>

          <button
            onClick={() => setShowCalendar(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/10 active:scale-[0.98] self-start md:self-auto"
          >
            <Calendar className="w-4 h-4" /> Upcoming Shoots
          </button>
        </div>

        {/* 📊 CORE METRICS STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Active Accounts" value={counts.users} icon={<Users className="w-5 h-5" />} trend="System Profiles" />
          <Card title="Total Booking Slates" value={counts.totalBookings} icon={<FileText className="w-5 h-5" />} trend="Gross Orders" />
          <Card title="Accrued Gross Revenue" value={counts.revenue} icon={<Coins className="w-5 h-5" />} trend="LKR Gross" isCurrency={true} />
          <Card title="Dominant Matrix Package" value={counts.mostPopularPackage || "N/A"} icon={<Layers className="w-5 h-5" />} trend="Popular Tier" />
        </div>

        {/* 📊 INFOGRAPHICS CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart Container */}
          <div className="bg-neutral-950/40 border border-neutral-900/80 p-6 rounded-3xl shadow-2xl space-y-6 backdrop-blur-md hover:border-neutral-800/80 transition-colors">
            <div className="flex justify-between items-start border-b border-neutral-900 pb-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-pink-500 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-pink-500" /> Revenue Velocity
                </h3>
                <p className="text-[10px] text-neutral-500 mt-1">Bi-quartile financial turnover chart matrix</p>
              </div>
              <span className="text-[9px] font-mono font-bold bg-pink-500/10 border border-pink-500/20 text-pink-400 px-2 py-0.5 rounded-md uppercase tracking-wider">
                LKR / Monthly
              </span>
            </div>
            <div className="h-[300px] w-full relative px-2">
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>

          {/* Doughnut Chart Container */}
          <div className="bg-neutral-950/40 border border-neutral-900/80 p-6 rounded-3xl shadow-2xl space-y-6 backdrop-blur-md hover:border-neutral-800/80 transition-colors">
            <div className="flex justify-between items-start border-b border-neutral-900 pb-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-fuchsia-500 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-fuchsia-500" /> Allocation Split
                </h3>
                <p className="text-[10px] text-neutral-500 mt-1">Current operational status ratio breakdown</p>
              </div>
              <span className="text-[9px] font-mono font-bold bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Live Status
              </span>
            </div>
            <div className="h-[300px] w-full relative px-2 flex items-center justify-center">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
        </div>
      </main>

      {/* ─── CALENDAR MODAL ─── */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#05070a] border border-neutral-900/80 p-6 rounded-3xl w-full max-w-md shadow-2xl shadow-pink-500/[0.02] space-y-6 relative overflow-hidden animate-scaleUp">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-fuchsia-600"></div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-pink-500" /> Upcoming Production Shoots
                </h2>
                <p className="text-[10px] text-neutral-500">Scheduled calendar milestones</p>
              </div>
              <button 
                onClick={() => setShowCalendar(false)}
                className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white rounded-xl transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-pink-500/5 border border-pink-500/10 text-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Layers className="w-5 h-5 text-pink-400" />
              </div>
              <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-xs mx-auto">
                Connect your backend calendar event stream endpoint to load real-time active shoots.
              </p>
            </div>
            
            <button
              onClick={() => setShowCalendar(false)}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-black uppercase tracking-wider rounded-xl text-neutral-300 hover:text-white transition-all"
            >
              Close Overlay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ===============================
// 📊 PREMIUM ADAPTIVE CARD COMPONENT
// ===============================
const Card = ({ title, value, icon, trend, isCurrency }: any) => (
  <div className="bg-neutral-950/40 border border-neutral-900 p-5 rounded-3xl shadow-xl flex items-center justify-between group hover:border-pink-500/20 backdrop-blur-sm transition-all duration-300 relative overflow-hidden">
    {/* Subtle gradient hover effect inside the card */}
    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    
    <div className="space-y-2.5 max-w-[75%] relative z-10">
      <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">{title}</p>
      <h2 className="text-lg sm:text-xl font-mono font-black tracking-tight text-white truncate select-all">
        {isCurrency ? `Rs ${value.toLocaleString()}` : value}
      </h2>
      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 bg-neutral-900/50 w-max px-2 py-0.5 rounded-md border border-neutral-900/60">
        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full inline-block animate-pulse shadow-[0_0_4px_#ec4899]"></span> {trend}
      </p>
    </div>
    
    <div className="text-pink-400 bg-pink-500/[0.03] p-3.5 rounded-2xl border border-pink-500/10 group-hover:scale-105 group-hover:border-pink-500/20 group-hover:text-pink-300 transition-all duration-300 shrink-0 relative z-10 shadow-inner">
      {icon}
    </div>
  </div>
);

export default AdminDashboard;