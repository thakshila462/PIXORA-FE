import { useState, useEffect } from "react";
import api from "../service/api";
import {
  Users, UserCheck, Award, Search,
  ArrowLeft, ShieldCheck, Loader2,
  Mail, Sparkles, UserX, ShieldAlert, ChevronDown
} from "lucide-react";

export const UserRole = {
  ADMIN: "ADMIN",
  CREATOR: "CREATOR",
  USER: "USER",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

interface IUser {
  _id: string;
  name: string;
  email: string;
  roles: UserRole[];
  approved: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // GET USERS
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // UPDATE USER (approval)
  const handleToggleApproval = async (id: string, status: boolean) => {
    setActionLoadingId(id);
    try {
      await api.put(`/users/${id}`, {
        approved: !status,
      });

      setUsers(prev =>
        prev.map(u =>
          u._id === id ? { ...u, approved: !status } : u
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // UPDATE ROLE
  const handleRoleChange = async (id: string, role: UserRole) => {
    try {
      await api.put(`/users/${id}`, {
        roles: [role],
      });

      setUsers(prev =>
        prev.map(u =>
          u._id === id ? { ...u, roles: [role] } : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAdmins = users.filter(u => u.roles.includes("ADMIN")).length;
  const pending = users.filter(u => !u.approved).length;

  return (
    <div className="min-h-screen bg-[#030508] text-slate-100 font-sans pb-12 selection:bg-pink-500 selection:text-white relative overflow-hidden">
      
      {/* ─── BACKGROUND NEON GLOWS ─── */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[250px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* ─── PIXORA ADMIN HEADER ─── */}
      <header className="relative z-10 bg-neutral-950/40 backdrop-blur-md px-6 py-5 flex justify-between items-center shadow-2xl border-b border-neutral-900/60">
        <div className="flex items-center gap-3 text-xl font-black tracking-tight">
          <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-pink-500 animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            PIXORA <span className="text-pink-500 font-medium text-base ml-1">Identity & Access Control</span>
          </span>
        </div>
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 mt-10 space-y-8">
        
        {/* ─── ADMIN ANALYTICS CARDS ─── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Total Users */}
          <div className="bg-neutral-950/60 backdrop-blur-xl p-6 rounded-2xl border border-neutral-900 shadow-xl flex items-center justify-between group hover:border-pink-500/30 transition-all duration-300">
            <div className="space-y-1">
              <h3 className="text-3xl font-black tracking-tight text-white">{users.length}</h3>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total Registered</p>
            </div>
            <Users className="w-9 h-9 text-pink-500/80 bg-pink-500/5 p-1.5 rounded-xl border border-pink-500/10 group-hover:scale-110 transition-transform" />
          </div>

          {/* Card 2: Total Admins */}
          <div className="bg-neutral-950/60 backdrop-blur-xl p-6 rounded-2xl border border-neutral-900 shadow-xl flex items-center justify-between group hover:border-fuchsia-500/30 transition-all duration-300">
            <div className="space-y-1">
              <h3 className="text-3xl font-black tracking-tight text-white">{totalAdmins}</h3>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">System Administrators</p>
            </div>
            <UserCheck className="w-9 h-9 text-fuchsia-500/80 bg-fuchsia-500/5 p-1.5 rounded-xl border border-fuchsia-500/10 group-hover:scale-110 transition-transform" />
          </div>

          {/* Card 3: Pending Approvals */}
          <div className="bg-neutral-950/60 backdrop-blur-xl p-6 rounded-2xl border border-neutral-900 shadow-xl flex items-center justify-between group hover:border-amber-500/30 transition-all duration-300">
            <div className="space-y-1">
              <h3 className="text-3xl font-black tracking-tight text-white">{pending}</h3>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Pending Gates Approval</p>
            </div>
            <ShieldAlert className={`w-9 h-9 p-1.5 rounded-xl border ${pending > 0 ? 'text-amber-500 bg-amber-500/10 border-amber-500/20 animate-pulse' : 'text-neutral-600 bg-neutral-900 border-neutral-800'}`} />
          </div>
        </section>

        {/* ─── IDENTITY USER DIRECTORY ─── */}
        <section className="bg-neutral-950 border border-neutral-900 p-6 rounded-3xl shadow-2xl">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-pink-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Account Directory
              </h2>
              <p className="text-[10px] text-neutral-500 mt-0.5">Modify access layers, toggle approval gates and handle roles</p>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none focus:border-pink-500/50 transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-pink-500">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Connecting Database Hub...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-neutral-900 bg-neutral-950/40">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-900/50 border-b border-neutral-900 text-[10px] font-black uppercase tracking-widest text-pink-400">
                    <th className="p-4">User ID (MongoDB)</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Security Role Switcher</th>
                    <th className="p-4">Approval Status</th>
                    <th className="p-4 text-center">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-xs md:text-sm">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-neutral-600 py-12 text-xs font-bold uppercase tracking-wider">
                        No identity blueprints discovered matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-white/[0.01] transition-colors duration-150">
                        {/* ID */}
                        <td className="p-4 text-neutral-600 font-mono text-xs select-all">
                          {user._id}
                        </td>
                        
                        {/* Name */}
                        <td className="p-4 font-bold text-slate-200">
                          {user.name}
                        </td>
                        
                        {/* Email */}
                        <td className="p-4 text-neutral-400">
                          <span className="flex items-center gap-1.5 text-xs">
                            <Mail className="w-3.5 h-3.5 text-neutral-600" /> {user.email}
                          </span>
                        </td>
                        
                        {/* Role Dropdown */}
                        <td className="p-4">
                          <div className="relative inline-block w-36">
                            <select
                              value={user.roles[0]}
                              onChange={(e) =>
                                handleRoleChange(user._id, e.target.value as UserRole)
                              }
                              className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-bold rounded-xl px-3 py-1.5 outline-none appearance-none cursor-pointer focus:border-pink-500/50 transition-all"
                            >
                              <option value="USER">👤 USER</option>
                              <option value="CREATOR">🎨 CREATOR</option>
                              <option value="ADMIN">⚡ ADMIN</option>
                            </select>
                            <ChevronDown className="w-3 h-3 text-neutral-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </td>
                        
                        {/* Approval Status Badge */}
                        <td className="p-4">
                          {user.approved ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-wider">
                              Approved Access
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-wider animate-pulse">
                              Pending Gate
                            </span>
                          )}
                        </td>
                        
                        {/* Toggle Approval Actions */}
                        <td className="p-4 text-center">
                          <button 
                            disabled={actionLoadingId === user._id}
                            onClick={() =>
                              handleToggleApproval(user._id, user.approved)
                            }
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 border w-28 justify-center ${
                              user.approved 
                                ? "bg-neutral-900 hover:bg-red-950/20 border-neutral-800 hover:border-red-900/50 text-neutral-400 hover:text-red-400" 
                                : "bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:opacity-95 text-white border-transparent shadow-lg shadow-pink-500/5"
                            }`}
                          >
                            {actionLoadingId === user._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : user.approved ? (
                              <>
                                <UserX className="w-3.5 h-3.5" /> Revoke
                              </>
                            ) : (
                              <>
                                <Award className="w-3.5 h-3.5" /> Approve
                              </>
                            )}
                          </button>
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

export default UserManagement;