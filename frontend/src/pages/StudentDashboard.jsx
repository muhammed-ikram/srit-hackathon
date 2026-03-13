import { useState, useEffect, useContext } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Calendar, Clock, CheckCircle, Info, MessageSquare, Activity, Globe, Brain, FileText, TrendingUp } from "lucide-react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ComplaintSection from "../components/ComplaintSection";
import DashboardNavbar from "../components/DashboardNavbar";
import ResourceHub from "../components/ResourceHub";
import StressAssessment from "../components/StressAssessment";
import StressReport from "../components/StressReport";
import StressChart from "../components/StressChart";

const TIER_COLORS = {
  'Minimal Stress': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Low Stress': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'Moderate Stress': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'High Stress': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Severe Stress': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

export default function StudentDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activity");

  // Stress assessment state
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (activeTab === "reports") fetchReportHistory();
  }, [activeTab]);

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

  const fetchReportHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await api.get("/api/stress-reports/my");
      if (res.data.success) setReportHistory(res.data.reports);
    } catch (err) {
      toast.error("Failed to load report history");
    } finally {
      setHistoryLoading(false);
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

  const handleAssessmentComplete = (avg, answers) => {
    setAssessmentResult({ avg, answers });
    setActiveTab("reports");
  };

  const handleRetake = () => {
    setAssessmentResult(null);
    setActiveTab("assessment");
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
    { id: "complaints", label: "Queries", icon: <MessageSquare size={18} /> },
    { id: "assessment", label: "Assessment", icon: <Brain size={18} /> },
    { id: "reports", label: "Reports", icon: <FileText size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      <main className="max-w-7xl mx-auto py-10">
        <AnimatePresence mode="wait">

          {/* ── Activity ── */}
          {activeTab === "activity" && (
            <motion.div key="activity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
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
                    <motion.div key={n._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className={`relative p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] ${n.isRead ? 'bg-white/[0.02] border-white/5 opacity-60' : 'bg-white/[0.05] border-indigo-500/30'}`}>
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
                          {n.details?.scheduledDate && (
                            <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                              <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest"><Clock size={14} /> Schedule Details</div>
                              <div className="grid grid-cols-2 gap-4">
                                <span className="text-sm font-bold text-white">{n.details.scheduledDate}</span>
                                <span className="text-sm font-bold text-slate-400">{n.details.scheduledTime}</span>
                              </div>
                            </div>
                          )}
                          {!n.isRead && (
                            <button onClick={() => markAsRead(n._id)} className="flex items-center gap-2 text-indigo-400 hover:text-white transition-colors text-sm font-black uppercase tracking-widest pl-1">
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

          {activeTab === "assessment" && (
            <motion.div key="assessment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <StressAssessment onComplete={handleAssessmentComplete} />
            </motion.div>
          )}

          {/* ── Reports ── */}
          {activeTab === "reports" && (
            <motion.div key="reports" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">

              {/* Latest result (just submitted) */}
              {assessmentResult && (
                <>
                  {reportHistory.length > 0 && (
                    <StressChart reports={reportHistory} />
                  )}
                  <StressReport avg={assessmentResult.avg} answers={assessmentResult.answers} onRetake={handleRetake} />
                </>
              )}

              {/* History section */}
              {!assessmentResult && (
                <>
                  <div className="flex items-center gap-5 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[1.5rem] flex items-center justify-center">
                      <TrendingUp size={28} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-black tracking-tight">Your Stress History</h1>
                      <p className="text-slate-400 mt-1">Track how your well-being has changed over time.</p>
                    </div>
                  </div>

                  {historyLoading ? (
                    <div className="text-center py-24 font-black text-slate-600 tracking-widest animate-pulse uppercase">Loading history...</div>
                  ) : reportHistory.length > 1 ? (
                    <>
                      <StressChart reports={reportHistory} />
                      <div className="space-y-4">
                        {reportHistory.map((r, idx) => (
                          <motion.div key={r._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            className="flex items-center justify-between p-7 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-5">
                              <div className="text-4xl">{r.score >= 4 ? '⛈️' : r.score >= 3 ? '🌧️' : r.score >= 2 ? '🌤️' : '🌿'}</div>
                              <div>
                                <div className="font-black text-white text-xl">{r.score.toFixed(1)} / 5.0</div>
                                <div className="text-slate-500 text-sm mt-0.5">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                              </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${TIER_COLORS[r.tier] || 'text-slate-400'}`}>
                              {r.tier}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                      <button onClick={() => setActiveTab("assessment")} className="flex items-center gap-3 px-8 py-4 mt-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-white transition-all w-fit">
                        <Brain size={18} /> Take New Assessment
                      </button>
                    </>
                  ) : reportHistory.length === 0 ? (
                    <div className="text-center py-40 space-y-6">
                      <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] mx-auto flex items-center justify-center">
                        <FileText size={36} className="text-slate-600" />
                      </div>
                      <h2 className="text-3xl font-black text-slate-500">No Reports Yet</h2>
                      <p className="text-slate-600 font-medium">Complete the stress assessment to see your report here.</p>
                      <button onClick={() => setActiveTab("assessment")} className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-white transition-all shadow-xl shadow-indigo-500/20">
                        <Brain size={20} /> Take Assessment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reportHistory.map((r, idx) => (
                        <motion.div key={r._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                          className="flex items-center justify-between p-7 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:border-indigo-500/30 transition-all">
                          <div className="flex items-center gap-5">
                            <div className="text-4xl">{r.score >= 4 ? '⛈️' : r.score >= 3 ? '🌧️' : r.score >= 2 ? '🌤️' : '🌿'}</div>
                            <div>
                              <div className="font-black text-white text-xl">{r.score.toFixed(1)} / 5.0</div>
                              <div className="text-slate-500 text-sm mt-0.5">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            </div>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${TIER_COLORS[r.tier] || 'text-slate-400'}`}>
                            {r.tier}
                          </span>
                        </motion.div>
                      ))}
                      <button onClick={() => setActiveTab("assessment")} className="flex items-center gap-3 px-8 py-4 mt-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-white transition-all w-fit">
                        <Brain size={18} /> Take New Assessment
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
