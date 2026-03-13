import { useState, useEffect } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Calendar, MapPin, Clock, User, CheckCircle, Info } from "lucide-react";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/notifications/my-notifications");
      if (res.data.success) setNotifications(res.data.notifications);
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/read/${id}`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-12">
      <header className="max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">Student Portal</h1>
        <p className="text-slate-400 text-lg font-medium">View your academic alerts and scheduled counseling.</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Bell className="text-purple-500" /> Notifications & Intervention
          </h2>
          <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-slate-500">
            {notifications.filter(n => !n.isRead).length} New
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold tracking-widest">CONNECTING TO GUARDIAN...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-slate-500 text-xl font-medium">No system alerts at this time.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {notifications.map((note) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-8 rounded-[2.5rem] border transition-all relative overflow-hidden group ${
                  note.isRead ? 'bg-white/[0.02] border-white/5 opacity-60' : 'bg-white/[0.04] border-purple-500/30 shadow-xl shadow-purple-500/5'
                }`}
              >
                {!note.isRead && (
                  <div className="absolute top-0 left-0 w-2 h-full bg-purple-500" />
                )}
                
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${note.type === 'intervention' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {note.type === 'intervention' ? <Calendar size={20} /> : <Info size={20} />}
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                        {note.type} • From {note.sender?.username || "Faculty"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black mb-4">{note.title}</h3>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                      {note.message}
                    </p>

                    {note.details && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                          <Calendar size={16} className="text-purple-400" /> {note.details.scheduledDate}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                          <Clock size={16} className="text-purple-400" /> {note.details.scheduledTime}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400 font-medium col-span-full">
                          <MapPin size={16} className="text-purple-400" /> {note.details.location}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col justify-end gap-3">
                    {!note.isRead && (
                      <button 
                        onClick={() => markAsRead(note._id)}
                        className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all text-sm flex items-center gap-2"
                      >
                        <CheckCircle size={18} /> Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
