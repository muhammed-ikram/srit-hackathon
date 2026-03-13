import { useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { X, Calendar, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function ScheduleIntervention({ student, onClose }) {
  const [data, setData] = useState({
    title: "Counseling Session Scheduled",
    message: "",
    date: "",
    time: "",
    location: "Counseling Center, Block A"
  });
  const [loading, setLoading] = useState(false);

  const schedule = async (e) => {
    e.preventDefault();
    if (!data.message || !data.date || !data.time) {
      toast.error("Please fill in all scheduling details");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/faculty/schedule-intervention", {
        studentId: student._id,
        title: data.title,
        message: data.message,
        details: {
          scheduledDate: data.date,
          scheduledTime: data.time,
          location: data.location
        }
      });
      if (res.data.success) {
        toast.success("Intervention scheduled!");
        onClose();
      }
    } catch (err) {
      toast.error("Failed to schedule intervention");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-xl bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl"
      >
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-3xl font-black text-white">Schedule Intervention</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={schedule} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Intervention Reason</label>
            <div className="relative">
              <MessageSquare size={18} className="absolute left-4 top-4 text-slate-500" />
              <textarea 
                placeholder="Describe why this intervention is needed..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                onChange={(e) => setData({...data, message: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Date</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="date"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  onChange={(e) => setData({...data, date: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Time</label>
              <div className="relative">
                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="time"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  onChange={(e) => setData({...data, time: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Location / Venue</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text"
                placeholder="Meeting point"
                value={data.location}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                onChange={(e) => setData({...data, location: e.target.value})}
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgb(147, 51, 234)" }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full mt-10 bg-purple-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-purple-500/20 text-lg uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? "Sending..." : <><Send size={24} /> Dispatch Notification</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
