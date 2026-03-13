import { useState, useEffect } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, Plus, Info } from "lucide-react";
import toast from "react-hot-toast";

export default function ComplaintSection() {
    const [complaints, setComplaints] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Hostel"
    });

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get("/api/complaints/my-complaints");
            if (res.data.success) setComplaints(res.data.complaints);
        } catch (err) {
            toast.error("Failed to load your complaints");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/complaints/submit", formData);
            if (res.data.success) {
                toast.success("Complaint submitted successfully");
                setShowForm(false);
                setFormData({ title: "", description: "", category: "Hostel" });
                fetchComplaints();
            }
        } catch (err) {
            toast.error("Error submitting complaint");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'in-progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'resolved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-white flex items-center gap-4">
                    <MessageSquare size={32} className="text-purple-500" /> Queries & Complaints
                </h2>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-500/20"
                >
                    <Plus size={20} /> New Query
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-10"
                >
                    <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Subject / Title</label>
                                <input 
                                    type="text" 
                                    placeholder="Brief summary of the issue"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Category</label>
                                <select 
                                    className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="Hostel">Hostel</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Facilities">Facilities</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Full Description</label>
                            <textarea 
                                rows={4}
                                placeholder="Explain your query or complaint in detail..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button 
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-8 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition-all font-bold flex items-center gap-2"
                            >
                                <Send size={20} /> Submit
                            </button>
                        </div>
                    </form>
                </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">Loading History...</div>
            ) : complaints.length === 0 ? (
                <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                    <p className="text-slate-500 text-xl font-medium">No previous queries found.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {complaints.map((c) => (
                        <motion.div
                            key={c._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.05] transition-all group"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${getStatusStyle(c.status)}`}>
                                            {c.status}
                                        </div>
                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{c.category} • {new Date(c.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white">{c.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-lg max-w-3xl">{c.description}</p>
                                    
                                    {c.hostelManagementNote && (
                                        <div className="mt-6 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-4">
                                            <Info className="text-emerald-400 shrink-0" size={20} />
                                            <div>
                                                <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Response from Management</div>
                                                <div className="text-slate-300 italic">"{c.hostelManagementNote}"</div>
                                            </div>
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
