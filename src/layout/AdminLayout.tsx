import { useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Camera, LayoutDashboard, Sliders, Tags, ImageIcon, UserCheck, LogOut, Menu } from "lucide-react";

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex font-sans antialiased">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-[#0f1524]/90 backdrop-blur-xl border-r border-white/[0.04] flex flex-col transition-transform duration-300 w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-6 border-b flex items-center gap-3">
          <div className="bg-gradient-to-tr from-pink-500 to-fuchsia-600 p-2 rounded-xl shadow-md shadow-pink-500/20">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-[2px] text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-400">PIXORA</h2>
            <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest block">{user?.role} PANEL</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <Link to="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${isActive("/admin/dashboard") ? "bg-pink-500/10 text-pink-400 border border-pink-500/20" : "text-slate-400 hover:text-white hover:bg-white/[0.03]"}`}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/shoot-request" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${isActive("/admin/bookings") ? "bg-pink-500/10 text-pink-400 border border-pink-500/20" : "text-slate-400 hover:text-white hover:bg-white/[0.03]"}`}>
            <Sliders className="w-4 h-4" /> Shoot Requests
          </Link>
          
          {user?.role === "ADMIN" && (
            <>
              <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Management</div>
              <Link to="/manage-packages" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${isActive("/manage-packages") ? "text-pink-400 bg-white/[0.02]" : "text-slate-400 hover:text-white hover:bg-white/[0.02]"}`}>
                <Tags className="w-4 h-4 text-pink-500/80" /> Package Pricing
              </Link>
              <Link to="/admin/gallery" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${isActive("/admin/gallery") ? "text-pink-400 bg-white/[0.02]" : "text-slate-400 hover:text-white hover:bg-white/[0.02]"}`}>
                <ImageIcon className="w-4 h-4 text-sky-500/80" /> Portfolio Gallery
              </Link>
              <Link to="/users" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${isActive("/admin/crew") ? "text-pink-400 bg-white/[0.02]" : "text-slate-400 hover:text-white hover:bg-white/[0.02]"}`}>
                <UserCheck className="w-4 h-4 text-indigo-500/80" /> Crew Control
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t">
          <button onClick={() => { logout(); navigate("/login"); }} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition-all">
            <LogOut className="w-3.5 h-3.5" /> Logout System
          </button>
        </div>
      </aside>

      {/* Content Framework */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/[0.03] bg-[#090d16]/60 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-xs text-slate-400 font-medium ml-auto">
            Operational Personnel: <span className="text-pink-400 font-bold">{user?.name}</span>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1 relative overflow-y-auto">
          <Outlet /> {/* 👈 ඔයාගේ පේජස් රෙන්ඩර් වෙන්නේ මෙතනට */}
        </main>
      </div>
    </div>
  );
};