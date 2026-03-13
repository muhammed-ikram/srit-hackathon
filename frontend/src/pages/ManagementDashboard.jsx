import { useState, useEffect, useContext } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Plus, LogOut, Layout, Shield, FlaskConical, BookOpen, Send, Trash2, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import ResourceHub from "../components/ResourceHub";
import ComplaintSection from "../components/ComplaintSection";
import toast from "react-hot-toast";

export default function ManagementDashboard({ role }) {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("my-posts");
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        type: role === 'librarian' ? 'library' : 'lab',
        title: "",
        content: "",
        slotsAvailable: "",
        category: "Update"
    });

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/");
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const fetchMyPosts = async () => {
        try {
            const res = await api.get("/api/resources/all");
            if (res.data.success) {
                setMyPosts(res.data.posts);
            }
        } catch (err) {
            toast.error("Failed to load your posts");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/resources/create", formData);
            if (res.data.success) {
                toast.success("Post published successfully");
                setShowForm(false);
                setFormData({ ...formData, title: "", content: "", slotsAvailable: "" });
                fetchMyPosts();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error creating post");
        }
    };

    const deletePost = async (id) => {
        if (!confirm("Are you sure you want to delete this update?")) return;
        try {
            await api.delete(`/api/resources/${id}`);
            toast.success("Post deleted");
            fetchMyPosts();
        } catch (err) {
            toast.error("Failed to delete post");
        }
    };

    if (authLoading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="font-black text-slate-700 tracking-[0.5em] animate-pulse uppercase">Linking Channels...</div>
            </div>
        );
    }

    const tabs = [
        { id: "my-posts", label: "Manage Posts", icon: <Layout size={18} /> },
        { id: "global-hub", label: "Campus Hub", icon: <Globe size={18} /> },
        { id: "queries", label: "My Queries", icon: <MessageSquare size={18} /> }
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

            <main className="max-w-7xl mx-auto py-10">
                <AnimatePresence mode="wait">
                    {activeTab === "my-posts" && (
                        <motion.div
                            key="manage"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h1 className="text-4xl font-black mb-2 flex items-center gap-4">
                                        {role === 'librarian' ? <BookOpen size={40} className="text-emerald-500" /> : <FlaskConical size={40} className="text-cyan-500" />}
                                        Management Portal
                                    </h1>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Direct update channel for resources</p>
                                </div>
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20"
                                >
                                    <Plus size={20} /> Create New Update
                                </button>
                            </div>

                            {showForm && (
                                <motion.form
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onSubmit={handleSubmit}
                                    className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 mb-16 space-y-8"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Post Type</label>
                                            <select
                                                className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option value="lab">Laboratory Availability</option>
                                                <option value="library">Library Slots</option>
                                                <option value="general">General Announcement</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Available Slots (Optional)</label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 25"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500/50"
                                                value={formData.slotsAvailable}
                                                onChange={(e) => setFormData({ ...formData, slotsAvailable: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Header / Title</label>
                                        <input
                                            type="text"
                                            placeholder="Catchy title for the update"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500/50"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Update Message</label>
                                        <textarea
                                            rows={5}
                                            placeholder="Explain the update in detail..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10">Cancel</button>
                                        <button type="submit" className="px-8 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-500/20"><Send size={18} /> Publish Post</button>
                                    </div>
                                </motion.form>
                            )}

                            <div className="space-y-6">
                                {loading ? (
                                    <div className="text-center py-20 animate-pulse font-black text-slate-600 tracking-widest">LOADING CONTENT...</div>
                                ) : myPosts.length === 0 ? (
                                    <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                                        <p className="text-slate-500 text-lg">You haven't posted any updates yet.</p>
                                    </div>
                                ) : (
                                    myPosts.map(post => (
                                        <div key={post._id} className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-center gap-8 group">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${post.type === 'lab' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : post.type === 'library' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                                                        {post.type}
                                                    </span>
                                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                                        <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-black mb-2">{post.title}</h3>
                                                <p className="text-slate-400 line-clamp-2 max-w-2xl">{post.content}</p>
                                            </div>
                                            <button
                                                onClick={() => deletePost(post._id)}
                                                className="p-4 bg-rose-500/10 text-rose-400 border border-rose-500/10 rounded-2xl hover:bg-rose-500/20 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "global-hub" && <ResourceHub />}
                    {activeTab === "queries" && <ComplaintSection />}
                </AnimatePresence>
            </main>
        </div>
    );
}
