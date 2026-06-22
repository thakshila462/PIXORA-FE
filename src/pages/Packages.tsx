// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Camera, Calendar, Clock, CheckCircle2, Award, Heart, Cake, Sparkles, Settings } from "lucide-react";

// // TypeScript Interface (Backend එකෙන් එන Data structure එක)
// interface Package {
//   id: string;
//   category: "wedding" | "birthday" | "graduation";
//   title: string;
//   price: string;
//   duration: string;
//   photosCount: string;
//   features: string[];
//   isPopular?: boolean;
// }

// const PackagesPage = () => {
//   const navigate = useNavigate();
//   const [activeCategory, setActiveCategory] = useState<"wedding" | "birthday" | "graduation">("wedding");
//   const [packages, setPackages] = useState<Package[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // 1. Backend එකෙන් ඩේටා ටික ඇදගන්න Engine එක
//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         // 💡 ඔයාගේ Backend API එක හැදුවම මෙන්න මෙතනට URL එක දාන්න:
//         // const response = await fetch("http://localhost:5000/api/packages");
//         // const data = await response.json();
        
//         // දැනට ටෙස්ට් කරලා බලන්න Dummy Data ටිකක් පල්ලෙහායින් දාලා තියෙන්නෙ:
//         const dummyData: Package[] = [
//           {
//             id: "w1",
//             category: "wedding",
//             title: "Silver Wedding Story",
//             price: "Rs. 95,000",
//             duration: "6 Hours Shoot",
//             photosCount: "250+ Edited Photos",
//             features: ["1 Photographer", "Pre-Shoot Included", "Digital Gallery Access", "Soft copies on Flash Drive"],
//           },
//           {
//             id: "w2",
//             category: "wedding",
//             title: "Gold Royal Wedding",
//             price: "Rs. 185,000",
//             duration: "Full Day Coverage",
//             photosCount: "500+ High-End Photos",
//             features: ["2 Senior Photographers", "Cinematic Wedding Video", "Premium Leather Album", "Drone Footage Included", "Pre & Post Shoot"],
//             isPopular: true,
//           },
//           {
//             id: "b1",
//             category: "birthday",
//             title: "Kids Sweet Birthday",
//             price: "Rs. 35,000",
//             duration: "3 Hours Shoot",
//             photosCount: "100+ Edited Photos",
//             features: ["1 Photographer", "Family Portrait Session", "Custom Birthday Theme Backdrop", "All Soft Copies Provided"],
//           },
//           {
//             id: "b2",
//             category: "birthday",
//             title: "Grand Celebration Pro",
//             price: "Rs. 65,000",
//             duration: "5 Hours Shoot",
//             photosCount: "200+ Premium Photos",
//             features: ["Photographer + Assistant", "Live Photo Booth for Guests", "Slow-Mo Video Highlights", "12x18 Framed Photo"],
//             isPopular: true,
//           },
//           {
//             id: "g1",
//             category: "graduation",
//             title: "Classic Portrait Shoot",
//             price: "Rs. 25,000",
//             duration: "1 Hour Studio Session",
//             photosCount: "25 Fine-Art Photos",
//             features: ["Professional Studio Lighting", "Family Portrait (Up to 5 members)", "High-End Retouching", "1 Large Print Included"],
//           },
//           {
//             id: "g2",
//             category: "graduation",
//             title: "Ultimate Graduation Outdoor",
//             price: "Rs. 48,000",
//             duration: "3 Hours Outdoor Shoot",
//             photosCount: "120+ Cinematic Photos",
//             features: ["University Campus Location", "Individual + Friends Group Shoot", "Instagram Reels Video Clip", "All Raw + Edited Files"],
//             isPopular: true,
//           }
//         ];

//         setPackages(dummyData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching packages:", error);
//         setLoading(false);
//       }
//     };

//     fetchPackages();
//   }, []);

//   // දැනට සිලෙක්ට් කරලා තියෙන කැටගරි එකට අදාළ පැකේජස් විතරක් පෙරලා ගන්නවා
//   const filteredPackages = packages.filter(pkg => pkg.category === activeCategory);

//   return (
//     <div className="min-h-screen bg-[#030508] text-slate-100 font-sans pb-20 selection:bg-pink-500 selection:text-white">
      
//       {/* ─── HERO SECTION ─── */}
//       <header className="relative text-center py-20 px-4 overflow-hidden border-b border-neutral-900/60 bg-neutral-950/20">
//         {/* වටපිටාව ලස්සන කරන්න දාපු Neon Glows */}
//         <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[250px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>
//         <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none"></div>

//         <button
//           onClick={() => navigate("/manage-packages")}
//           className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-neutral-900/60 border border-neutral-800 hover:border-pink-500 text-neutral-400 hover:text-pink-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300"
//         >
//           <Settings className="w-4 h-4" /> Manage Pricing
//         </button>

//         <div className="relative z-10 space-y-4">
//           <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-full text-xs font-black uppercase tracking-widest">
//             <Sparkles className="w-3.5 h-3.5" /> Capture Your Best Moments
//           </div>
//           <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
//             Our Exclusive Photography Packages
//           </h1>
//           <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base font-medium">
//             Explore pricing and details crafted perfectly for your life's greatest milestones. Backed by real-time booking.
//           </p>
//         </div>
//       </header>

//       {/* ─── DYNAMIC CATEGORY TABS ─── */}
//       <section className="max-w-xl mx-auto mt-12 px-4">
//         <div className="bg-neutral-950 border border-neutral-900 p-1.5 rounded-2xl flex justify-between gap-1 shadow-xl">
//           <button
//             onClick={() => setActiveCategory("wedding")}
//             className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
//               activeCategory === "wedding" 
//                 ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/20" 
//                 : "text-neutral-400 hover:text-slate-200"
//             }`}
//           >
//             <Heart className="w-4 h-4" /> Weddings
//           </button>

//           <button
//             onClick={() => setActiveCategory("birthday")}
//             className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
//               activeCategory === "birthday" 
//                 ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/20" 
//                 : "text-neutral-400 hover:text-slate-200"
//             }`}
//           >
//             <Cake className="w-4 h-4" /> Birthdays
//           </button>

//           <button
//             onClick={() => setActiveCategory("graduation")}
//             className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
//               activeCategory === "graduation" 
//                 ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/20" 
//                 : "text-neutral-400 hover:text-slate-200"
//             }`}
//           >
//             <Award className="w-4 h-4" /> Graduation
//           </button>
//         </div>
//       </section>

//       {/* ─── PRICING CARDS GRID ─── */}
//       <main className="max-w-6xl mx-auto px-4 mt-16">
//         {loading ? (
//           // Loading ස්ක්‍රීන් එක
//           <div className="flex flex-col items-center justify-center py-20 gap-4">
//             <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
//             <p className="text-xs font-bold tracking-widest text-neutral-500 uppercase">Fetching Studio Tiers...</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
//             {filteredPackages.map((pkg) => (
//               <div
//                 key={pkg.id}
//                 className={`relative bg-neutral-950 rounded-3xl border transition-all duration-500 p-8 flex flex-col justify-between group overflow-hidden ${
//                   pkg.isPopular 
//                     ? "border-pink-500/40 shadow-2xl shadow-pink-500/5 ring-1 ring-pink-500/30 scale-[1.01]" 
//                     : "border-neutral-900 hover:border-neutral-800"
//                 }`}
//               >
//                 {/* Popular එකක් නම් දාන නියම බැජ් එක */}
//                 {pkg.isPopular && (
//                   <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
//                     Most Popular
//                   </div>
//                 )}

//                 <div>
//                   {/* Card Header */}
//                   <h3 className="text-xl font-extrabold text-white group-hover:text-pink-400 transition-colors">
//                     {pkg.title}
//                   </h3>
                  
//                   {/* Price Engine */}
//                   <div className="mt-4 flex items-baseline text-slate-100">
//                     <span className="text-3xl md:text-4xl font-black tracking-tight">{pkg.price}</span>
//                   </div>

//                   <hr className="my-6 border-neutral-900" />

//                   {/* Quick Specs */}
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-3 text-xs md:text-sm text-neutral-400">
//                       <Clock className="w-4 h-4 text-neutral-500" />
//                       <span>{pkg.duration}</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-xs md:text-sm text-neutral-400">
//                       <Camera className="w-4 h-4 text-neutral-500" />
//                       <span>{pkg.photosCount}</span>
//                     </div>
//                   </div>

//                   <hr className="my-6 border-neutral-900" />

//                   {/* Included Features List */}
//                   <ul className="space-y-3.5">
//                     {pkg.features.map((feature, i) => (
//                       <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-neutral-300">
//                         <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
//                         <span>{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Booking Button Actions */}
//                 <div className="mt-8">
//                   <button
//                     onClick={() => alert(`Proceeding to book: ${pkg.title}`)}
//                     className={`w-full py-3.5 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
//                       pkg.isPopular
//                         ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:opacity-95 text-white shadow-lg shadow-pink-500/10"
//                         : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
//                     }`}
//                   >
//                     <Calendar className="w-4 h-4" /> Book This Session
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default PackagesPage;