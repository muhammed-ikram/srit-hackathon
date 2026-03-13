import { useState, useEffect, useContext } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, MessageSquare, Clock, CheckCircle, XCircle, Search, Filter, User, Info, Globe } from "lucide-react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardNavbar from "../components/DashboardNavbar";
import ResourceHub from "../components/ResourceHub";

export default function HostelDashboard() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("resolution");
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [resolutionNote, setResolutionNote] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/");
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        fetchAllComplaints();
    }, []);

    const fetchAllComplaints = async () => {
        try {
            const res = await api.get("/api/complaints/hostel/all");
            if (res.data.success) setComplaints(res.data.complaints);
        } catch (err) {
            toast.error("Failed to load complaints list");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        if (!resolutionNote.trim()) {
            toast.error("Please provide a resolution note or explanation");
            return;
        }
        setIsUpdating(true);
        try {
            const res = await api.patch(`/api/complaints/update-status/${id}`, {
                status: newStatus,
                note: resolutionNote
            });
            if (res.data.success) {
                toast.success(`Complaint marked as ${newStatus}`);
                setSelectedComplaint(null);
                setResolutionNote("");
                fetchAllComplaints();
            }
        } catch (err) {
            toast.error("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    if (authLoading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="font-black text-slate-700 tracking-[0.5em] animate-pulse uppercase">Linking Channels...</div>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'in-progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'resolved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             c.sender?.username.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "all" || c.status === filter;
        return matchesSearch && matchesFilter;
    });

    const tabs = [
        { id: "resolution", label: "Resolution Desk", icon: <ShieldCheck size={18} /> },
        { id: "resources", label: "Resource Hub", icon: <Globe size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

            <main className="max-w-7xl mx-auto py-10">
                <AnimatePresence mode="wait">
                    {activeTab === "resolution" && (
                        <motion.div
                            key="resolution"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight flex items-center gap-4">
                                        <ShieldCheck className="text-emerald-500" size={48} /> Hostel Management
                                    </h1>
                                    <p className="text-slate-400 text-lg font-medium">Resolution center for student and faculty queries.</p>
                                </div>
                            </header>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                                <div className="lg:col-span-3 space-y-8">
                                    <div className="flex flex-col md:flex-row gap-6 bg-white/[0.03] border border-white/10 p-6 rounded-3xl">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Search complaints by title..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                                            <Filter size={20} className="text-slate-500" />
                                            <select
                                                className="bg-transparent text-white focus:outline-none font-bold"
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                            >
                                                <option value="all" className="bg-slate-900">All Status</option>
                                                <option value="pending" className="bg-slate-900">Pending</option>
                                                <option value="resolved" className="bg-slate-900">Resolved</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {loading ? (
                                            <div className="text-center py-20 font-black text-slate-500 tracking-widest animate-pulse">SYNCING DATABASES...</div>
                                        ) : filteredComplaints.length === 0 ? (
                                            <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                                                <p className="text-slate-400 text-xl font-medium">No complaints found.</p>
                                            </div>
                                        ) : (
                                            filteredComplaints.map(complaint => (
                                                <motion.div
                                                    key={complaint._id}
                                                    onClick={() => setSelectedComplaint(complaint)}
                                                    className={`p-8 bg-white/[0.03] border rounded-[2.5rem] cursor-pointer transition-all hover:bg-white/[0.06] ${selectedComplaint?._id === complaint._id ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/5' : 'border-white/10'}`}
                                                >
                                                    <div className="flex justify-between items-start gap-4 mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400">
                                                                <User size={24} />
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-white">{complaint.sender?.username}</div>
                                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{complaint.sender?.role}</div>
                                                            </div>
                                                        </div>
                                                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${getStatusStyle(complaint.status)}`}>
                                                            {complaint.status}
                                                        </div>
                                                    </div>
                                                    <h3 className="text-2xl font-black mb-4">{complaint.title}</h3>
                                                    <p className="text-slate-400 font-medium line-clamp-2">{complaint.description}</p>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-1">
                                    <div className="sticky top-28 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 min-h-[500px] flex flex-col">
                                        <h2 className="text-xl font-black mb-8 flex items-center gap-3 border-b border-white/5 pb-4">
                                            <Info className="text-emerald-500" /> Resolution Desk
                                        </h2>

                                        {selectedComplaint ? (
                                            <div className="flex flex-col flex-1">
                                                <div className="mb-8">
                                                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Selected Ticket</div>
                                                    <div className="font-bold text-emerald-400">{selectedComplaint.title}</div>
                                                </div>

                                                <div className="space-y-4 flex-1">
                                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Final Resolution Note</label>
                                                    <textarea
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none h-40"
                                                        placeholder="Enter the actions taken..."
                                                        value={resolutionNote}
                                                        onChange={(e) => setResolutionNote(e.target.value)}
                                                        required
                                                    />

                                                    <div className="grid grid-cols-1 gap-4 pt-6">
                                                        <button
                                                            disabled={isUpdating}
                                                            onClick={() => updateStatus(selectedComplaint._id, 'resolved')}
                                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                                                        >
                                                            <CheckCircle size={20} /> Mark Resolved
                                                        </button>
                                                        <button
                                                            disabled={isUpdating}
                                                            onClick={() => updateStatus(selectedComplaint._id, 'rejected')}
                                                            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                                        >
                                                            <XCircle size={20} /> Reject Ticket
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 select-none">
                                                <MessageSquare size={64} className="mb-6" />
                                                <p className="font-black uppercase tracking-widest text-sm">Select a ticket to begin resolution</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "resources" && (
                        <motion.div key="resources" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <ResourceHub />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
