import { Link } from "react-router-dom";
import {
  Calendar,
  ArrowRight,
  Image as ImageIcon,
  Camera,
  Sparkles,
  Sliders,
  Flame,
  Award,
  Layers,
  Zap
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#030508] text-slate-100 font-sans pb-24 selection:bg-pink-500 selection:text-white relative overflow-hidden animate-fadeIn">
      
      {/* ─── BACKGROUND NEON GLOW EFFECTS ─── */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-500/[0.03] rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[30%] left-[-20%] w-[500px] h-[500px] bg-purple-500/[0.02] rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[700px] h-[400px] bg-fuchsia-500/[0.03] rounded-full blur-[160px] pointer-events-none"></div>

      {/* ─── HERO SECTION (STEALTH PRO) ─── */}
      <section
        id="home"
        className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 pt-20 lg:pt-32 gap-16 relative z-10"
      >
        <div className="max-w-2xl text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-pink-400 bg-pink-500/5 px-4 py-2 rounded-full border border-pink-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.05)]">
            <Zap className="w-3 h-3 text-pink-500 animate-pulse" /> Pixora Next-Gen Photography
          </div>
          
         <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-white font-serif">
  CAPTURE EVERY <br />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.2)]">
    DIVINE MOMENT
  </span>
</h1>

          <p className="text-sm md:text-base text-neutral-400 max-w-lg font-medium leading-relaxed font-sans">
            Premium Photography Booking & Advanced AI Photo Editing Platform. Crafting visual masterpieces for your timeless memories.
          </p>

          {/* 🔘 PREMIUM DUAL BUTTON ROW */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            {/* Primary Button: Booking */}
            <Link 
              to="/booking" 
              className="group bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-pink-500/10 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" /> Booking Session
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary Button: AI Editor */}
            <Link 
              to="/editor"
              className="group border border-neutral-900 hover:border-pink-500/20 bg-neutral-950/40 hover:bg-pink-500/5 text-neutral-300 hover:text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3 backdrop-blur-md active:scale-[0.98]"
            >
              <ImageIcon className="w-4 h-4 text-neutral-500 group-hover:text-pink-500 transition-colors" /> Explore Editor
            </Link>
          </div>
        </div>

        {/* 📸 THE PREMIUM BLACK CAMERA CANVAS */}
        <div className="relative group lg:w-1/2 flex justify-center">
          <div className="absolute top-4 -left-4 w-full h-full border border-pink-500/10 rounded-3xl pointer-events-none group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform duration-500 max-w-[460px]"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl blur-[20px] opacity-10 group-hover:opacity-25 transition duration-700 max-w-[460px]"></div>
          
          <div className="relative rounded-3xl overflow-hidden border border-neutral-900/80 bg-neutral-950 p-2 max-w-[460px] shadow-2xl shadow-pink-500/[0.02]">
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop"
              alt="Stealth Black DSLR Camera"
              className="w-full rounded-2xl object-cover brightness-[0.75] contrast-[1.15] transition duration-700 group-hover:scale-[1.02] group-hover:brightness-[0.85]"
            />
          </div>
        </div>
      </section>

      {/* ─── SERVICES SECTION ─── */}
      <section id="services" className="bg-neutral-950/20 border-y border-neutral-900/50 px-6 md:px-16 py-28 relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-pink-500 bg-pink-500/5 px-3 py-1 rounded-md border border-pink-500/10">What We Do</span>
            <h2 className="text-3xl md:text-5xl font-black text-white font-mono uppercase tracking-tight pt-2">Our Premium Services</h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto uppercase tracking-wider">High-end production tiers tailored for absolute perfection</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-neutral-950/40 border border-neutral-900 p-8 rounded-3xl hover:border-pink-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/[0.02] group relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-pink-500/[0.03] border border-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 mb-8 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-fuchsia-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-inner">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black font-mono uppercase tracking-wide mb-3 text-white">Wedding Photography</h3>
              <p className="text-neutral-400 text-xs font-medium leading-relaxed">Capturing your eternal love story in ultra-high-definition cinematic frames.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-neutral-950/40 border border-neutral-900 p-8 rounded-3xl hover:border-pink-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/[0.02] group relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-fuchsia-500/[0.03] border border-fuchsia-500/10 rounded-2xl flex items-center justify-center text-fuchsia-400 mb-8 group-hover:bg-gradient-to-br group-hover:from-fuchsia-500 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-inner">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black font-mono uppercase tracking-wide mb-3 text-white">Birthday Shoots</h3>
              <p className="text-neutral-400 text-xs font-medium leading-relaxed">Preserving the high-energy joy and emotions of your milestone celebrations.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-neutral-950/40 border border-neutral-900 p-8 rounded-3xl hover:border-pink-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/[0.02] group relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-purple-500/[0.03] border border-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-8 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-inner">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black font-mono uppercase tracking-wide mb-3 text-white">Graduation Shoots</h3>
              <p className="text-neutral-400 text-xs font-medium leading-relaxed">Honoring your academic success with elegant, professional portraits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GALLERY SECTION ─── */}
      <section id="gallery" className="max-w-7xl mx-auto px-6 md:px-16 py-28 relative z-10">
        <div className="text-center mb-20 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-pink-500 bg-pink-500/5 px-3 py-1 rounded-md border border-pink-500/10">Our Portfolio</span>
          <h2 className="text-3xl md:text-5xl font-black text-white font-mono uppercase tracking-tight pt-2">Visual Gallery</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto uppercase tracking-wider">Unfiltered look into our latest production assets</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Image 1 */}
          <div className="overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-900 p-2 group aspect-[4/3] relative shadow-xl transition-all duration-500 hover:border-pink-500/20">
            <div className="absolute inset-2 rounded-2xl bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none flex items-end p-5">
              <span className="text-[10px] font-black uppercase font-mono tracking-widest text-pink-400 bg-pink-500/10 px-2 py-1 rounded border border-pink-500/20">Cinematic Cinematic</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"
              alt="Gallery 1"
              className="w-full h-full rounded-2xl object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-[1.03] transition duration-700 cursor-pointer brightness-[0.85]"
            />
          </div>

          {/* Image 2 */}
          <div className="overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-900 p-2 group aspect-[4/3] relative shadow-xl transition-all duration-500 hover:border-fuchsia-500/20">
            <div className="absolute inset-2 rounded-2xl bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none flex items-end p-5">
              <span className="text-[10px] font-black uppercase font-mono tracking-widest text-fuchsia-400 bg-fuchsia-500/10 px-2 py-1 rounded border border-fuchsia-500/20">Vibrant Canvas</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop"
              alt="Gallery 2"
              className="w-full h-full rounded-2xl object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-[1.03] transition duration-700 cursor-pointer brightness-[0.85]"
            />
          </div>

          {/* Image 3 */}
          <div className="overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-900 p-2 group aspect-[4/3] relative shadow-xl transition-all duration-500 hover:border-purple-500/20">
            <div className="absolute inset-2 rounded-2xl bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none flex items-end p-5">
              <span className="text-[10px] font-black uppercase font-mono tracking-widest text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">Elite Portraits</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop"
              alt="Gallery 3"
              className="w-full h-full rounded-2xl object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-[1.03] transition duration-700 cursor-pointer brightness-[0.85]"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;