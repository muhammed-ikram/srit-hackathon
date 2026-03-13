import { useState, useEffect, useContext } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Calendar, Clock, CheckCircle, Info, MessageSquare, Activity, Globe } from "lucide-react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ComplaintSection from "../components/ComplaintSection";
import DashboardNavbar from "../components/DashboardNavbar";
import ResourceHub from "../components/ResourceHub";

export default function StudentDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activity");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

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
    } catch (err) {
      toast.error("Error updating status");
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
    { id: "activity", label: "Activity", icon: <Activity size={18} /> },
    { id: "resources", label: "Resource Hub", icon: <Globe size={18} /> },
    { id: "complaints", label: "Queries", icon: <MessageSquare size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      <main className="max-w-7xl mx-auto py-10">
        <AnimatePresence mode="wait">
          {activeTab === "activity" && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                  <Bell size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 italic">Student Hub</h1>
                  <p className="text-slate-400 font-medium text-lg">Your academic heartbeat and alerts.</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-24 font-black text-slate-600 tracking-widest animate-pulse uppercase">Syncing Neural Link...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-32 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                  <p className="text-slate-500 text-xl font-medium">Clear skies! No new notifications.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {notifications.map((n) => (
                    <motion.div
                      key={n._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] group ${
                        n.isRead ? 'bg-white/[0.02] border-white/5 opacity-60' : 'bg-white/[0.05] border-indigo-500/30'
                      }`}
                    >
                      {!n.isRead && <div className="absolute top-8 right-8 w-3 h-3 bg-indigo-500 rounded-full animate-ping" />}
                      <div className="flex items-start gap-6">
                        <div className={`p-4 rounded-2xl ${n.type === 'intervention' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                          {n.type === 'intervention' ? <Calendar size={28} /> : <Info size={28} />}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="text-2xl font-black mb-1 leading-tight">{n.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">{n.message}</p>
                          </div>

                          {n.details && (
                            <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                              <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest leading-none">
                                <Clock size={14} /> Schedule Details
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <span className="text-sm font-bold text-white leading-none">{n.details.scheduledDate}</span>
                                <span className="text-sm font-bold text-slate-400 leading-none">{n.details.scheduledTime}</span>
                              </div>
                            </div>
                          )}

                          {!n.isRead && (
                            <button
                              onClick={() => markAsRead(n._id)}
                              className="flex items-center gap-2 text-indigo-400 hover:text-white transition-colors text-sm font-black uppercase tracking-widest pl-1"
                            >
                              <CheckCircle size={16} /> Acknowledge
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
