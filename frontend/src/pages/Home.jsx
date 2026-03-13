import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, MessageSquare, Globe, Activity, ShieldCheck, Users, Bell } from "lucide-react";
import toast from "react-hot-toast";
import DashboardNavbar from "../components/DashboardNavbar";
import ResourceHub from "../components/ResourceHub";
import ComplaintSection from "../components/ComplaintSection";

export default function Home({ role }) {
    const { user, loading } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { id: "overview", label: "Overview", icon: <Layout size={18} /> },
        { id: "resources", label: "Resource Hub", icon: <Globe size={18} /> },
        { id: "complaints", label: "Queries", icon: <MessageSquare size={18} /> }
    ];

    if (loading) return <div className="h-screen flex items-center justify-center font-black text-slate-700">LINKING CHANNELS...</div>;

    const stats = [
        { label: "Stability", value: "99.9%", icon: <ShieldCheck className="text-emerald-400" /> },
        { label: "Active Nodes", value: "142", icon: <Activity className="text-indigo-400" /> },
        { label: "Requests", value: "1.2k", icon: <Bell className="text-purple-400" /> }
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

            <main className="max-w-7xl mx-auto py-10">
                <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="space-y-12"
                        >
                            <header className="mb-16">
                                <h1 className="text-5xl font-black mb-4 tracking-tighter">
                                    Welcome, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent capitalize">{user?.username}</span>
                                </h1>
                                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Administrative Terminal • Role: {role || user?.role}</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {stats.map((stat, i) => (
                                    <div key={i} className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] flex items-center gap-8 group hover:bg-white/[0.05] transition-all">
                                        <div className="p-5 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                                            <div className="text-slate-500 font-black uppercase tracking-widest text-[10px]">{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-12 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-white/10 rounded-[3rem] relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black mb-6">System Integrity</h2>
                                    <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed mb-10">
                                        All campus modules are reporting nominal status. The Guardian AI is monitoring academic trends and security bottlenecks in real-time. Use the tabs above to manage resources or resolve pending queries.
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="px-6 py-2 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-black uppercase tracking-widest">Nominal Core</div>
                                        <div className="px-6 py-2 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/20 text-xs font-black uppercase tracking-widest">Heuristic Sync Active</div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full -mr-20 -mt-20" />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "resources" && (
                        <motion.div key="resources" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <ResourceHub />
                        </motion.div>
                    )}

                    {activeTab === "complaints" && (
                        <motion.div key="complaints" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <ComplaintSection />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
