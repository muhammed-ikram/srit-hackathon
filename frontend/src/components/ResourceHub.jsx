import { useState, useEffect } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Clock, User, Bookmark, Info, FlaskConical, BookOpen, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function ResourceHub() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get("/api/resources/all");
            if (res.data.success) setPosts(res.data.posts);
        } catch (err) {
            toast.error("Failed to load campus updates");
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'lab': return <FlaskConical className="text-cyan-400" size={20} />;
            case 'library': return <BookOpen className="text-emerald-400" size={20} />;
            default: return <MessageSquare className="text-indigo-400" size={20} />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                    <Globe size={28} className="text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white leading-none">Resource Hub</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Campus-wide Availability & Announcements</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 font-black text-slate-600 tracking-widest animate-pulse uppercase">Syncing Campus Data...</div>
            ) : posts.length === 0 ? (
                <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                    <p className="text-slate-500 text-xl font-medium">No updates available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.map((post) => (
                        <motion.div
                            key={post._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.05] transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                {getTypeIcon(post.type)}
                            </div>

                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                                        {getTypeIcon(post.type)}
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{post.type} update</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                                <p className="text-slate-400 leading-relaxed font-medium mb-8 flex-1">{post.content}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-black">
                                            {post.sender?.username?.[0].toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-white">{post.sender?.username}</span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{post.sender?.role?.replace('_', ' ')}</span>
                                        </div>
                                    </div>

                                    {post.slotsAvailable !== null && (
                                        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                            <span className="text-xs font-black text-emerald-400">{post.slotsAvailable} Slots Left</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
