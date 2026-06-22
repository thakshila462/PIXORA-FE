import { useEffect, useState } from "react";
import api from "../service/api";
import { useAuth } from "../context/AuthContext";
import { PlusCircle, Edit3, Trash2, Camera, Clock, DollarSign, Layers, Sparkles, Image, CheckCircle, ShieldCheck } from "lucide-react";

interface Package {
  _id?: string;
  category: string;
  title: string;
  price: string;
  duration: string;
  photosCount: string;
  features: string[];
  isPopular: boolean;
}

const ManagePackages = () => {
  const { token } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState<Package>({
    category: "wedding",
    title: "",
    price: "",
    duration: "",
    photosCount: "",
    features: [],
    isPopular: false,
  });

  // GET ALL
  const fetchPackages = async () => {
    try {
      const res = await api.get("/packages");
      setPackages(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  // ✅ FIXED TO SAFE NUMBER LOGIC (Ensures numbers are cleanly parsed without any string interference)
  const toSafeNumber = (val: any) => {
    if (val === null || val === undefined) return null;
    
    // Convert to string and completely strip out everything except actual digits and decimals
    const cleaned = String(val)
      .replace(/[^0-9.]/g, "")
      .trim();

    if (cleaned === "") return null;

    const num = Number(cleaned);
    return isNaN(num) ? null : num;
  };

  const buildPackagePayload = () => {
    const cleanedFeatures = (form.features || [])
      .map((f) => String(f).trim())
      .filter(Boolean);

    return {
      title: String(form.title ?? "").trim(),
      category: form.category,
      price: toSafeNumber(form.price),
      duration: toSafeNumber(form.duration),
      photosCount: toSafeNumber(form.photosCount),
      features: cleanedFeatures,
      isPopular: Boolean(form.isPopular),
    };
  };

  const validatePackageForm = () => {
    const payload = buildPackagePayload();

    if (!payload.title) {
      alert("Title required");
      return null;
    }
    if (payload.price === null || payload.price <= 0) {
      alert("Valid price required");
      return null;
    }
    if (payload.duration === null || payload.duration <= 0) {
      alert("Valid duration required");
      return null;
    }
    if (payload.photosCount === null || payload.photosCount <= 0) {
      alert("Valid photo count required");
      return null;
    }

    return payload;
  };

  useEffect(() => {
    if (token) {
      fetchPackages();
    }
  }, [token]);

  // INPUT CHANGE
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  // CREATE OR UPDATE
  const handleSubmit = async () => {
    if (!token) {
      alert("Your admin session has expired. Please login again.");
      return;
    }

    const payload = validatePackageForm();
    if (!payload) {
      return;
    }

    try {
      console.log("📦 Submitting package payload:", payload);
      
      if (editId) {
        console.log(`Updating package ${editId}...`);
        await api.put(`/packages/${editId}`, payload);
      } else {
        console.log("Creating new package...");
        await api.post("/packages", payload);
      }

      console.log("✅ Package saved successfully!");
      
      setForm({
        category: "wedding",
        title: "",
        price: "",
        duration: "",
        photosCount: "",
        features: [],
        isPopular: false,
      });

      setEditId(null);
      fetchPackages();
      
      alert("Package saved successfully!");
    } catch (err: any) {
      const responseData = err.response?.data;
      const errorMsg = responseData?.message || responseData?.error || err.message || "Unknown error";
      console.error("❌ Error saving package:", {
        status: err.response?.status,
        message: errorMsg,
        responseData,
        payload,
      });
      alert(`Error saving package: ${errorMsg}\n${JSON.stringify(responseData || {})}`);
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (!token) {
      alert("Your admin session has expired. Please login again.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this PIXORA package?")) {
      try {
        await api.delete(`/packages/${id}`);
        fetchPackages();
      } catch (err) {
        console.error("Error deleting package:", err);
      }
    }
  };

  // EDIT LOAD
  const handleEdit = (pkg: Package) => {
    setForm({
      ...pkg,
      price: String(pkg.price ?? ""),
      duration: String(pkg.duration ?? ""),
      photosCount: String(pkg.photosCount ?? "")
    });
    setEditId(pkg._id || null);
  };

  return (
    <div className="min-h-screen bg-[#030508] text-slate-100 font-sans pb-20 selection:bg-pink-500 selection:text-white relative overflow-hidden">
      
      {/* ─── PIXORA NEON GLOW VIBES ─── */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[250px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full blur-[130px] pointer-events-none"></div>

      {/* ─── HERO HEADER ─── */}
      <header className="relative text-center py-12 px-4 border-b border-neutral-900/60 bg-neutral-950/20">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-full text-xs font-black uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" /> Core Studio Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
            Manage Service Packages
          </h1>
          <p className="text-neutral-500 max-w-xl mx-auto text-xs font-medium">
            Create, update, and fine-tune your photography tiers to display on the live PIXORA portal.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        
        {/* ─── LEFT COLUMN: GLASS FORM ─── */}
        <section className="lg:col-span-1">
          <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-3xl shadow-2xl space-y-5 sticky top-6">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <h2 className="text-sm font-black uppercase tracking-widest text-white">
                {editId ? "Modify Package" : "Create New Package"}
              </h2>
            </div>

            <div className="space-y-4">
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Package Title</label>
                <div className="relative">
                  <Camera className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Gold Royal Wedding"
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none focus:border-pink-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Price & Duration Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Price Rate</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                    <input
                      type="number"
                      min="1"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="185000"
                      className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none focus:border-pink-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Duration</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                    <input
                      type="number"
                      min="1"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      placeholder="6"
                      className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none focus:border-pink-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Photos Count & Category Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Photos Count</label>
                  <div className="relative">
                    <Image className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                    <input
                      type="number"
                      min="1"
                      name="photosCount"
                      value={form.photosCount}
                      onChange={handleChange}
                      placeholder="500"
                      className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none focus:border-pink-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Category Scope</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-pink-500/50 transition-all appearance-none"
                    >
                      <option value="wedding" className="bg-black">Wedding</option>
                      <option value="birthday" className="bg-black">Birthday</option>
                      <option value="graduation" className="bg-black">Graduation</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Features Separated Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Included Features</label>
                <textarea
                  placeholder="2 Photographers, Drone Shot, Premium Album (Separate by commas)"
                  value={Array.isArray(form.features) ? form.features.join(",") : ""}
                  onChange={(e) => setForm({ ...form, features: e.target.value.split(",") })}
                  rows={3}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-pink-500/50 transition-all resize-none"
                />
              </div>

              {/* Popular Checkbox */}
              <div className="flex items-center gap-3 py-1 bg-neutral-900/30 p-3 rounded-xl border border-neutral-900">
                <input
                  type="checkbox"
                  name="isPopular"
                  id="isPopular"
                  checked={form.isPopular}
                  onChange={handleChange}
                  className="w-4 h-4 accent-pink-500 cursor-pointer rounded"
                />
                <label htmlFor="isPopular" className="text-xs font-bold text-neutral-300 cursor-pointer select-none">
                  Promote as "Most Popular" Tier
                </label>
              </div>

              {/* Submit Button Trigger */}
              <button
                onClick={handleSubmit}
                className="w-full py-3 mt-2 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:opacity-95 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> {editId ? "Update System Tier" : "Deploy Studio Package"}
              </button>
            </div>
          </div>
        </section>

        {/* ─── RIGHT COLUMN: DEPLOYED PACKAGES LIST ─── */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-500">
              Live Directories ({packages.length})
            </h2>
          </div>

          {packages.length === 0 ? (
            <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-16 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">
              No packages deployed to database yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className={`bg-neutral-950 border rounded-2xl p-5 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden ${
                    pkg.isPopular 
                      ? "border-pink-500/30 shadow-xl shadow-pink-500/5" 
                      : "border-neutral-900 hover:border-neutral-800"
                  }`}
                >
                  {/* Category Stamp Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-[9px] uppercase tracking-widest rounded-md">
                      {pkg.category}
                    </span>
                    {pkg.isPopular && (
                      <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" title="Popular Tier" />
                    )}
                  </div>

                  {/* Info Metadata Block */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-black text-white group-hover:text-pink-400 transition-colors tracking-tight">
                        {pkg.title}
                      </h3>
                      <p className="text-xl font-black text-slate-200 mt-1">{pkg.price}</p>
                    </div>

                    <div className="flex gap-4 text-[11px] text-neutral-500 border-t border-b border-neutral-900 py-2">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {pkg.duration}</span>
                      <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5" /> {pkg.photosCount}</span>
                    </div>

                    {/* Features Snippet Box */}
                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="space-y-1 pt-1">
                        {pkg.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-[11px] text-neutral-400 flex items-center gap-1.5 truncate">
                            <CheckCircle className="w-3 h-3 text-pink-500 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions Layer Control */}
                  <div className="flex gap-2 border-t border-neutral-900 pt-4 mt-4">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-yellow-500" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id!)}
                      className="px-4 py-2 bg-neutral-900/50 hover:bg-red-950/30 border border-neutral-900 hover:border-red-900/50 text-neutral-500 hover:text-red-400 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default ManagePackages;