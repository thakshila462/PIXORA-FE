// import { useState, useEffect } from "react";
// import { 
//   Plus, 
//   Edit2, 
//   Trash2, 
//   Sparkles, 
//   Layers, 
//   Clock, 
//   Camera, 
//   CheckCircle, 
//   X, 
//   Save, 
//   DollarSign 
// } from "lucide-react";

// // Package Interface එක ඔයාගේ Mongoose Schema එකටම ගැළපෙන්න හදලා තියෙන්නේ
// interface IPackage {
//   _id?: string;
//   category: "wedding" | "birthday" | "graduation";
//   title: string;
//   price: string;
//   duration: string;
//   photosCount: string;
//   features: string[];
//   isPopular: boolean;
// }

// const PackageManagement = () => {
//   const [packages, setPackages] = useState<IPackage[]>([]);
//   const [loading, setLoading] = useState(false);
  
//   // Modal සහ Form State පාලනය
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
  
//   // Features තාවකාලිකව Input එකේ ටයිප් කරන එක Handle කරන්න
//   const [featureInput, setFeatureInput] = useState("");

//   // Form එකේ Initial State එක
//   const [formData, setFormData] = useState<IPackage>({
//     category: "wedding",
//     title: "",
//     price: "",
//     duration: "",
//     photosCount: "",
//     features: [],
//     isPopular: false,
//   });

//   const API_URL = "http://localhost:5173/api/packages"; // 👈 ඔයාගේ Backend Package Route එක මෙතනට දාන්න

//   // 1. සියලුම Packages Backend එකෙන් ලෝඩ් කිරීම
//   const fetchPackages = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(API_URL);
//       const body = await res.json();
//       if (body.data) {
//         setPackages(body.data);
//       }
//     } catch (err) {
//       console.error("Error fetching packages:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPackages();
//   }, []);

//   // 2. Form එක Submit කිරීම (Create හෝ Update දෙකම මේකෙන් වෙනවා)
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const method = editingId ? "PUT" : "POST";
//     const url = editingId ? `${API_URL}/${editingId}` : API_URL;

//     try {
//       const res = await fetch(url, {
//         method: method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         fetchPackages(); // UI එක Refresh කරනවා
//         closeModal();
//       }
//     } catch (err) {
//       console.error("Error saving package:", err);
//     }
//   };

//   // 3. Edit බටන් එක ක්ලික් කරපුම Form එකට ඩේටා පිරවීම
//   const handleEditClick = (pkg: IPackage) => {
//     if (!pkg._id) return;
//     setEditingId(pkg._id);
//     setFormData({
//       category: pkg.category,
//       title: pkg.title,
//       price: pkg.price,
//       duration: pkg.duration,
//       photosCount: pkg.photosCount,
//       features: [...pkg.features],
//       isPopular: pkg.isPopular,
//     });
//     setIsModalOpen(true);
//   };

//   // 4. Package එකක් Delete කිරීම (Optional, නමුත් Marker කැමති නිසා UI එක හැදුවා)
//   const handleDeleteClick = async (id: string) => {
//     if (window.confirm("Are you sure you want to delete this package?")) {
//       try {
//         await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//         fetchPackages();
//       } catch (err) {
//         console.error("Error deleting package:", err);
//       }
//     }
//   };

//   // 5. Features එකින් එක Array එකට එකතු කිරීම (Enter එක ගැහුවම හෝ Add ක්ලික් කලාම)
//   const addFeature = () => {
//     if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
//       setFormData({
//         ...formData,
//         features: [...formData.features, featureInput.trim()],
//       });
//       setFeatureInput("");
//     }
//   };

//   // 6. එකතු කරපු Feature එකක් අයින් කිරීම
//   const removeFeature = (indexToRemove: number) => {
//     setFormData({
//       ...formData,
//       features: formData.features.filter((_, idx) => idx !== indexToRemove),
//     });
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditingId(null);
//     setFormData({
//       category: "wedding",
//       title: "",
//       price: "",
//       duration: "",
//       photosCount: "",
//       features: [],
//       isPopular: false,
//     });
//     setFeatureInput("");
//   };

//   return (
//     <div className="space-y-8 animate-fadeIn pb-12 relative">
//       <div className="absolute top-[-10%] left-1/4 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[160px] pointer-events-none"></div>

//       {/* Header Panel */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl flex items-center gap-2">
//             Pricing Packages <Sparkles className="w-5 h-5 text-pink-400" />
//           </h1>
//           <p className="text-xs text-slate-400 mt-1">Configure your photography packages, rates, features and visibility status.</p>
//         </div>
//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-xs font-bold text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-pink-600/20 active:scale-95 self-start sm:self-auto"
//         >
//           <Plus className="w-4 h-4" /> Add New Package
//         </button>
//       </div>

//       {/* Loading Status */}
//       {loading && <p className="text-xs font-mono text-pink-400 animate-pulse">Synchronizing with Pixora Cloud Engine...</p>}

//       {/* 🚀 Packages Grid Display */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//         {packages.map((pkg) => (
//           <div 
//             key={pkg._id} 
//             className={`bg-[#0f1524]/40 border ${pkg.isPopular ? "border-pink-500/30 shadow-pink-500/[0.02]" : "border-white/[0.04]"} rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xl relative group transition-all duration-300 hover:border-white/[0.1]`}
//           >
//             {pkg.isPopular && (
//               <span className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full text-white shadow-md">
//                 Popular Choice 💎
//               </span>
//             )}

//             <div>
//               {/* Category & Title */}
//               <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block bg-pink-500/5 px-2.5 py-1 rounded-md w-max border border-pink-500/10 mb-3">
//                 {pkg.category}
//               </span>
//               <h3 className="text-lg font-black text-white group-hover:text-pink-400 transition-colors">{pkg.title}</h3>
              
//               {/* Price Tag */}
//               <div className="mt-3 flex items-baseline gap-1">
//                 <span className="text-xs font-bold text-slate-400">Rs.</span>
//                 <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
//                   {Number(pkg.price).toLocaleString("en-US")}
//                 </span>
//               </div>

//               {/* Basic Meta Details */}
//               <div className="mt-4 grid grid-cols-2 gap-2 border-t border-b border-white/[0.03] py-3 my-4">
//                 <div className="flex items-center gap-2 text-[11px] text-slate-400">
//                   <Clock className="w-3.5 h-3.5 text-slate-500" /> {pkg.duration}
//                 </div>
//                 <div className="flex items-center gap-2 text-[11px] text-slate-400">
//                   <Camera className="w-3.5 h-3.5 text-slate-500" /> {pkg.photosCount} Photos
//                 </div>
//               </div>

//               {/* Features Loop */}
//               <div className="space-y-2 mt-2">
//                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Included Perks:</span>
//                 {pkg.features.map((feature, i) => (
//                   <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
//                     <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
//                     <span>{feature}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Admin Controls Box */}
//             <div className="mt-6 pt-4 border-t border-white/[0.03] flex justify-end gap-2">
//               <button 
//                 onClick={() => handleEditClick(pkg)}
//                 className="p-2 bg-white/[0.02] border border-white/[0.05] hover:border-pink-500/30 text-slate-400 hover:text-pink-400 rounded-xl transition-all"
//                 title="Edit Package Configuration"
//               >
//                 <Edit2 className="w-3.5 h-3.5" />
//               </button>
//               <button 
//                 onClick={() => pkg._id && handleDeleteClick(pkg._id)}
//                 className="p-2 bg-white/[0.02] border border-white/[0.05] hover:border-rose-500/30 text-slate-400 hover:text-rose-400 rounded-xl transition-all"
//                 title="Purge Package"
//               >
//                 <Trash2 className="w-3.5 h-3.5" />
//               </button>
//             </div>

//           </div>
//         ))}
//       </div>


//       {/* ================= 🛠️ MODAL COMPONENT: ADD / EDIT DIALOG ================= */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4 animate-fadeIn">
//           <form 
//             onSubmit={handleSubmit}
//             className="bg-[#0f1524] border border-white/[0.08] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
//           >
//             {/* Modal Title Bar */}
//             <div className="p-5 border-b border-white/[0.04] flex justify-between items-center bg-[#131b2e]">
//               <div className="flex items-center gap-2">
//                 <Layers className="w-5 h-5 text-pink-500" />
//                 <div>
//                   <h3 className="text-sm font-black text-white tracking-wider uppercase">
//                     {editingId ? "Update Configuration" : "Generate Custom Package"}
//                   </h3>
//                   <p className="text-[10px] text-slate-400">Define financial tiers and shoot privileges</p>
//                 </div>
//               </div>
//               <button 
//                 type="button"
//                 onClick={closeModal}
//                 className="p-1.5 bg-white/[0.03] hover:bg-white/[0.1] text-slate-400 hover:text-white rounded-lg transition-all"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Modal Scrollable Input Body */}
//             <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar">
              
//               {/* Category Select (Strict Enum Setup) */}
//               <div>
//                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Package Track</label>
//                 <select 
//                   value={formData.category}
//                   onChange={(e) => setFormData({...formData, category: e.target.value as any})}
//                   className="w-full bg-[#090d16] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50"
//                 >
//                   <option value="wedding">Wedding Track</option>
//                   <option value="birthday">Birthday Celebration</option>
//                   <option value="graduation">Academic Graduation</option>
//                 </select>
//               </div>

//               {/* Title Input */}
//               <div>
//                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Package Title</label>
//                 <input 
//                   type="text" 
//                   required
//                   placeholder="e.g., Luxury Gold Cinematic"
//                   value={formData.title}
//                   onChange={(e) => setFormData({...formData, title: e.target.value})}
//                   className="w-full bg-[#090d16] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50 placeholder:text-slate-600"
//                 />
//               </div>

//               {/* Row: Price, Duration, Photos */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 <div>
//                   <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Net Price (LKR)</label>
//                   <input 
//                     type="number" 
//                     required
//                     placeholder="150000"
//                     value={formData.price}
//                     onChange={(e) => setFormData({...formData, price: e.target.value})}
//                     className="w-full bg-[#090d16] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50 placeholder:text-slate-600"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Duration</label>
//                   <input 
//                     type="text" 
//                     required
//                     placeholder="e.g., Full Day (8h)"
//                     value={formData.duration}
//                     onChange={(e) => setFormData({...formData, duration: e.target.value})}
//                     className="w-full bg-[#090d16] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50 placeholder:text-slate-600"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Photos Count</label>
//                   <input 
//                     type="text" 
//                     required
//                     placeholder="e.g., 300+ Softcopies"
//                     value={formData.photosCount}
//                     onChange={(e) => setFormData({...formData, photosCount: e.target.value})}
//                     className="w-full bg-[#090d16] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50 placeholder:text-slate-600"
//                   />
//                 </div>
//               </div>

//               {/* Popular Checkbox Toggle */}
//               <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl flex items-center justify-between">
//                 <div>
//                   <span className="text-xs font-bold text-white block">Promote as Popular Choice</span>
//                   <p className="text-[10px] text-slate-400">Injects custom neon highlights on the system display</p>
//                 </div>
//                 <input 
//                   type="checkbox" 
//                   checked={formData.isPopular}
//                   onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
//                   className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
//                 />
//               </div>

//               {/* Features Array Handler */}
//               <div>
//                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Add Perks & Features</label>
//                 <div className="flex gap-2">
//                   <input 
//                     type="text" 
//                     placeholder="e.g., 1 Main Album + Pre-shoot free"
//                     value={featureInput}
//                     onChange={(e) => setFeatureInput(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
//                     className="flex-1 bg-[#090d16] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50 placeholder:text-slate-600"
//                   />
//                   <button 
//                     type="button"
//                     onClick={addFeature}
//                     className="px-3 bg-white/[0.04] hover:bg-pink-500/20 hover:text-pink-400 border border-white/[0.06] text-xs font-bold rounded-xl text-slate-300 transition-colors"
//                   >
//                     Add
//                   </button>
//                 </div>

//                 {/* Features Badges Container */}
//                 <div className="flex flex-wrap gap-2 mt-3">
//                   {formData.features.map((feature, idx) => (
//                     <span key={idx} className="bg-[#090d16] border border-white/[0.08] text-[11px] text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 animate-fadeIn">
//                       {feature}
//                       <button 
//                         type="button" 
//                         onClick={() => removeFeature(idx)}
//                         className="text-slate-500 hover:text-rose-400 transition-colors"
//                       >
//                         <X className="w-3 Calendar" />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>

//             </div>

//             {/* Modal Action Controls */}
//             <div className="p-4 bg-white/[0.01] border-t border-white/[0.04] flex justify-end gap-2">
//               <button 
//                 type="button"
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.08] text-xs font-bold rounded-xl text-slate-400 hover:text-slate-200 transition-all"
//               >
//                 Cancel
//               </button>
//               <button 
//                 type="submit"
//                 className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-xs font-bold text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-pink-600/10 active:scale-95"
//               >
//                 <Save className="w-3.5 h-3.5" /> {editingId ? "Save Changes" : "Deploy Package"}
//               </button>
//             </div>

//           </form>
//         </div>
//       )}

//     </div>
//   );
// };

// export default PackageManagement;