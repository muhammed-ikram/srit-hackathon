import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import { LogOut, User, Layout, Bell, MessageSquare, Globe, Shield } from "lucide-react";

export default function DashboardNavbar({ activeTab, setActiveTab, tabs }) {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await api.post("auth/logout");
        setUser(null);
        navigate("/");
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass sticky top-4 z-50 flex items-center justify-between px-8 py-4 mb-12 max-w-7xl mx-auto"
        >
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Shield size={22} className="text-white" />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight hidden md:block">GUARDIAN<span className="text-indigo-400">AI</span></h3>
                </div>

                <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                activeTab === tab.id 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <User size={16} className="text-indigo-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-white leading-none">{user?.username}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user?.role?.replace('_', ' ')}</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/10 transition-all group"
                    title="Logout"
                >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </motion.nav>
    );
}
