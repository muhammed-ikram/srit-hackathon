import { useState, useEffect, useContext } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, UserPlus, Search, AlertCircle, CheckCircle2, MessageSquare,
  Globe, Brain, X, Phone, Hash, TrendingUp, Calendar, ChevronRight, Bell
} from "lucide-react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import StudentCard from "../components/StudentCard";
import AIReportModal from "../components/AIReportModal";
import ScheduleIntervention from "../components/ScheduleIntervention";
import ComplaintSection from "../components/ComplaintSection";
import DashboardNavbar from "../components/DashboardNavbar";
import ResourceHub from "../components/ResourceHub";

const TIER_COLORS = {
  'Minimal Stress': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Low Stress': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'Moderate Stress': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'High Stress': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Severe Stress': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

const TIER_EMOJI = {
  'Minimal Stress': '🌿', 'Low Stress': '🌤️', 'Moderate Stress': '🌧️',
  'High Stress': '⛈️', 'Severe Stress': '🌪️'
};

/* ── Student Detail Popup Modal ── */
function StudentDetailModal({ student, onClose }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/api/stress-reports/student/${student._id}`);
        if (res.data.success) setReports(res.data.reports);
      } catch {
        toast.error("Failed to load student reports");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [student._id]);

  const rollNumber = student.details?.rollNumber || student.details?.roll || 'N/A';
  const mobile = student.details?.mobile || student.details?.phone || 'N/A';
  const department = student.details?.department || student.details?.branch || 'N/A';
  const attendance = student.details?.attendance;
  const backlogs = student.details?.backlogs;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-black text-white">{student.username?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{student.username}</h2>
              <p className="text-slate-400 text-sm">{student.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Details */}
        <div className="p-8 overflow-y-auto flex-1 space-y-8">
          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                <Hash size={12} /> Roll Number
              </div>
              <div className="font-black text-white text-lg">{rollNumber}</div>
            </div>
            <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                <Phone size={12} /> Mobile
              </div>
              <a href={`tel:${mobile}`} className="font-black text-indigo-400 text-lg hover:text-indigo-300 transition-colors">
                {mobile}
              </a>
            </div>
            <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                <Users size={12} /> Department
              </div>
              <div className="font-black text-white text-lg">{department}</div>
            </div>
          </div>

          {/* Academic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${attendance < 75 ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  <Globe size={18} />
                </div>
                <div>
                  <div className="font-bold text-white">Attendance</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">University Sync</div>
                </div>
              </div>
              <div className={`font-black text-2xl ${attendance < 75 ? 'text-rose-400' : 'text-white'}`}>
                {attendance !== undefined ? `${attendance}%` : 'N/A'}
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${backlogs > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  <AlertCircle size={18} />
                </div>
                <div>
                  <div className="font-bold text-white">Active Backlogs</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Failed Subjects</div>
                </div>
              </div>
              <div className={`font-black text-2xl ${backlogs > 0 ? 'text-rose-400' : 'text-white'}`}>
                {backlogs !== undefined ? backlogs : 'N/A'}
              </div>
            </div>
          </div>

          {/* Stress reports */}
          <div>
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Brain size={18} className="text-indigo-400" /> Stress Report History
            </h3>
            {loading ? (
              <div className="text-center py-10 text-slate-500 font-bold animate-pulse">Loading reports...</div>
            ) : reports.length === 0 ? (
              <div className="text-center py-10 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                <p className="text-slate-500 font-medium">No stress assessments taken yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((r, idx) => (
                  <div key={r._id} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{TIER_EMOJI[r.tier] || '📊'}</span>
                      <div>
                        <div className="font-black text-white">{r.score.toFixed(1)} / 5.0</div>
                        <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${TIER_COLORS[r.tier] || ''}`}>
                      {r.tier}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Faculty Dashboard ── */
export default function FacultyDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("counseling");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [activeNotificationCategory, setActiveNotificationCategory] = useState("all");

  // Stress summary
  const [stressSummary, setStressSummary] = useState([]);
  const [stressLoading, setStressLoading] = useState(false);
  const [detailStudent, setDetailStudent] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchMyStudents();
    fetchAllStudents();
  }, []);

  useEffect(() => {
    if (activeTab === "stress") fetchStressSummary();
    if (activeTab === "notifications") fetchNotifications();
  }, [activeTab]);

  const fetchMyStudents = async () => {
    try {
      const res = await api.get("/api/faculty/my-students");
      if (res.data.success) setStudents(res.data.students);
    } catch (err) {
      toast.error("Failed to load your students");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const res = await api.get("/api/faculty/students");
      if (res.data.success) setAllStudents(res.data.students);
    } catch (err) {}
  };

  const fetchStressSummary = async () => {
    setStressLoading(true);
    try {
      const res = await api.get("/api/stress-reports/faculty/summary");
      if (res.data.success) setStressSummary(res.data.summary);
    } catch (err) {
      toast.error("Failed to load stress summary");
    } finally {
      setStressLoading(false);
    }
  };

  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const res = await api.get("/api/notifications/my-notifications");
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setNotificationsLoading(false);
    }
  };

  const addStudent = async (studentId) => {
    try {
      const res = await api.post("/api/faculty/add-student", { studentId });
      if (res.data.success) {
        toast.success("Student added successfully");
        setShowAddModal(false);
        fetchMyStudents();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add student");
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="font-black text-slate-700 tracking-[0.5em] animate-pulse uppercase">Linking Channels...</div>
      </div>
    );
  }

  const filteredDiscovery = allStudents.filter(s =>
    s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "counseling", label: "Counseling", icon: <Users size={18} /> },
    { id: "stress", label: "Stress Reports", icon: <Brain size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "resources", label: "Resource Hub", icon: <Globe size={18} /> },
    { id: "complaints", label: "Queries", icon: <MessageSquare size={18} /> },
  ];

  // Notification categorizer
  const getCategorizedNotifications = () => {
    const categories = {
      stress: [],
      attendance: [],
      backlogs: [],
      general: []
    };

    notifications.forEach(notif => {
      // It's a risk alert from our AI system or Stress report system
      if (notif.type === 'alert' || notif.type === 'intervention') {
         const score = notif.details?.score || notif.details?.stressScore || 0;
         const attendance = notif.details?.attendance;
         const backlogs = notif.details?.backlogs;

         let categorized = false;
         
         if (score >= 4) {
           categories.stress.push(notif);
           categorized = true;
         }
         if (attendance !== undefined && attendance < 75) {
           categories.attendance.push(notif);
           categorized = true;
         }
         if (backlogs !== undefined && backlogs > 0) {
           categories.backlogs.push(notif);
           categorized = true;
         }

         if (!categorized) {
            categories.general.push(notif);
         }
      } else {
        categories.general.push(notif);
      }
    });

    // Remove duplicates if a notification falls into multiple categories (we just show it in the selected tab)
    return categories;
  };

  const categorizedNotifs = getCategorizedNotifications();
  // Depending on which sub-tab is selected, show those notifs
  const displayNotifs = activeNotificationCategory === "all" ? notifications : categorizedNotifs[activeNotificationCategory];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      <main className="max-w-7xl mx-auto py-10">
        <AnimatePresence mode="wait">

          {/* ── Counseling Tab ── */}
          {activeTab === "counseling" && (
            <motion.div key="counseling" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">Faculty Dashboard</h1>
                  <p className="text-slate-400 text-lg font-medium">Manage students and monitor academic health.</p>
                </div>
                <button onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20">
                  <UserPlus size={24} /> Add Student
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                  { icon: <Users size={32} />, value: students.length, label: 'Active Students', color: 'indigo' },
                  { icon: <AlertCircle size={32} />, value: stressSummary.filter(s => s.latestReport?.score >= 4).length, label: 'High Stress', color: 'orange' },
                  { icon: <CheckCircle2 size={32} />, value: stressSummary.filter(s => s.latestReport).length, label: 'Reports Submitted', color: 'cyan' },
                ].map((stat, i) => (
                  <div key={i} className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center gap-6">
                    <div className={`p-4 bg-${stat.color}-500/10 rounded-2xl text-${stat.color}-400`}>{stat.icon}</div>
                    <div>
                      <div className="text-3xl font-black">{stat.value}</div>
                      <div className={`text-${stat.color === 'orange' ? 'orange' : 'slate'}-400 font-bold uppercase text-xs tracking-widest`}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-20 text-slate-500 font-bold">Initializing System...</div>
              ) : students.length === 0 ? (
                <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                  <p className="text-slate-400 text-xl font-medium mb-8">No students added to your counseling list.</p>
                  <button onClick={() => setShowAddModal(true)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 font-bold">Add One Now</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {students.map(student => (
                    <StudentCard key={student._id} student={student}
                      onAnalyze={() => { setSelectedStudent(student); setShowAIModal(true); }}
                      onSchedule={() => { setSelectedStudent(student); setShowScheduleModal(true); }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Stress Reports Tab ── */}
          {activeTab === "stress" && (
            <motion.div key="stress" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex items-center gap-5 mb-12">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[2rem] flex items-center justify-center">
                  <Brain size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight">Student Stress Reports</h1>
                  <p className="text-slate-400 mt-1 text-lg">Click a student to view full details and stress history.</p>
                </div>
              </div>

              {stressLoading ? (
                <div className="text-center py-24 font-black text-slate-600 animate-pulse tracking-widest uppercase">Loading Reports...</div>
              ) : students.length === 0 ? (
                <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                  <p className="text-slate-400 text-xl font-medium">Add students to your counseling list first.</p>
                </div>
              ) : stressSummary.length === 0 ? (
                /* Fallback: show basic student list if summary hasn't loaded yet */
                <div className="space-y-4">
                  {students.map((student, i) => (
                    <motion.button key={student._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setDetailStudent(student)}
                      className="w-full flex items-center justify-between p-7 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center font-black text-white">
                          {student.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-white text-lg">{student.username}</div>
                          <div className="text-slate-500 text-sm">Roll: {student.details?.rollNumber || 'N/A'}</div>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {stressSummary.map(({ student, latestReport }, i) => (
                    <motion.button key={student._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setDetailStudent(student)}
                      className={`w-full flex items-center justify-between p-7 bg-white/[0.03] border rounded-[2rem] hover:bg-white/[0.05] transition-all text-left group ${
                        latestReport?.score >= 4 ? 'border-orange-500/30 hover:border-orange-500/50' : 'border-white/10 hover:border-indigo-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        {/* Alert badge for high/severe */}
                        {latestReport?.score >= 4 && (
                          <div className="absolute -mt-2 -ml-2">
                            <span className="w-3 h-3 bg-orange-500 rounded-full animate-ping inline-block" />
                          </div>
                        )}
                        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center font-black text-white text-lg flex-shrink-0">
                          {student.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-white text-lg">{student.username}</div>
                          <div className="text-slate-500 text-sm">Roll No: {student.details?.rollNumber || 'N/A'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        {latestReport ? (
                          <>
                            <div className="text-right hidden sm:block">
                              <div className="font-black text-white">{latestReport.score.toFixed(1)} / 5.0</div>
                              <div className="text-slate-500 text-xs">
                                {new Date(latestReport.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </div>
                            </div>
                            <span className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${TIER_COLORS[latestReport.tier] || ''}`}>
                              {TIER_EMOJI[latestReport.tier]} {latestReport.tier}
                            </span>
                          </>
                        ) : (
                          <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            No Assessment
                          </span>
                        )}
                        <ChevronRight size={20} className="text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Notifications Tab ── */}
          {activeTab === "notifications" && (
            <motion.div key="notifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex items-center gap-5 mb-12">
                <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-orange-500 rounded-[2rem] flex items-center justify-center">
                  <Bell size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight">Alerts & Notifications</h1>
                  <p className="text-slate-400 mt-1 text-lg">AI-powered proactive risk identification.</p>
                </div>
              </div>

              {/* Sub-tabs for categorization */}
              <div className="flex flex-wrap gap-3 mb-8">
                 {[
                   { id: "all", label: "All Alerts", border: "border-slate-500/20" },
                   { id: "stress", label: "High Stress", border: "border-orange-500/30 text-orange-400", count: categorizedNotifs.stress.length },
                   { id: "attendance", label: "Low Attendance", border: "border-rose-500/30 text-rose-400", count: categorizedNotifs.attendance.length },
                   { id: "backlogs", label: "Active Backlogs", border: "border-indigo-500/30 text-indigo-400", count: categorizedNotifs.backlogs.length },
                 ].map(cat => (
                   <button 
                     key={cat.id} 
                     onClick={() => setActiveNotificationCategory(cat.id)}
                     className={`px-5 py-2.5 rounded-full border text-sm font-bold flex items-center gap-2 transition-all ${
                       activeNotificationCategory === cat.id 
                         ? 'bg-white text-black border-white shadow-xl' 
                         : `bg-white/5 hover:bg-white/10 ${cat.border || 'text-slate-300'}`
                     }`}
                   >
                     {cat.label}
                     {cat.count !== undefined && cat.count > 0 && (
                       <span className={`px-2 py-0.5 rounded-full text-xs bg-black/20 ${activeNotificationCategory === cat.id ? 'text-black' : ''}`}>
                         {cat.count}
                       </span>
                     )}
                   </button>
                 ))}
              </div>

              {notificationsLoading ? (
                 <div className="text-center py-24 font-black text-slate-600 animate-pulse tracking-widest uppercase">Fetching Alerts...</div>
              ) : displayNotifs.length === 0 ? (
                 <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                   <p className="text-slate-400 text-xl font-medium">No alerts found in this category.</p>
                 </div>
              ) : (
                 <div className="space-y-4">
                   {displayNotifs.map((notif, i) => (
                      <motion.div key={notif._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className={`p-6 bg-white/[0.02] border rounded-[2rem] relative overflow-hidden ${
                          notif.type === 'alert' ? 'border-orange-500/30' : 'border-white/10'
                        }`}
                      >
                         {/* Urgent indicator strip */}
                         {notif.type === 'alert' && (
                           <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-orange-500" />
                         )}
                         <div className="flex items-start justify-between mb-4">
                           <div className="flex flex-col">
                             <h3 className="text-xl font-black text-white">{notif.title}</h3>
                             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                               {new Date(notif.createdAt).toLocaleString()}
                             </p>
                           </div>
                           {!notif.isRead && <span className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />}
                         </div>
                         
                         <p className="text-slate-300 font-medium whitespace-pre-wrap leading-relaxed">{notif.message}</p>
                         
                         {/* Data Pills (if details exist) */}
                         {notif.details && (
                           <div className="mt-6 flex flex-wrap gap-2">
                             {notif.details.rollNumber && (
                               <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg text-xs font-bold text-slate-300">
                                 Roll: {notif.details.rollNumber}
                               </span>
                             )}
                             {(notif.details.score || notif.details.stressScore) && (
                               <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-xs font-bold text-orange-400">
                                 Stress: {Number(notif.details.score || notif.details.stressScore).toFixed(1)}/5.0
                               </span>
                             )}
                             {notif.details.attendance !== undefined && (
                               <span className={`px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs font-bold ${notif.details.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                 Attendance: {notif.details.attendance}%
                               </span>
                             )}
                             {notif.details.backlogs !== undefined && (
                               <span className={`px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-bold ${notif.details.backlogs > 0 ? 'text-indigo-400' : 'text-slate-300'}`}>
                                 Backlogs: {notif.details.backlogs}
                               </span>
                             )}
                           </div>
                         )}
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

      {/* ── Student Detail Popup ── */}
      <AnimatePresence>
        {detailStudent && <StudentDetailModal student={detailStudent} onClose={() => setDetailStudent(null)} />}
      </AnimatePresence>

      {/* ── Add Student Modal ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl">
              <h3 className="text-3xl font-black mb-8">Add to Counseling</h3>
              <div className="relative mb-8">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder="Search by name or email..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white focus:outline-none"
                  onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                {filteredDiscovery.map(s => (
                  <div key={s._id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <div className="font-bold text-lg">{s.username}</div>
                      <div className="text-slate-500 text-sm">{s.email}</div>
                    </div>
                    <button onClick={() => addStudent(s._id)} className="p-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors">
                      <UserPlus size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAIModal && <AIReportModal student={selectedStudent} onClose={() => setShowAIModal(false)} onSchedule={() => { setShowAIModal(false); setShowScheduleModal(true); }} />}
      </AnimatePresence>
      <AnimatePresence>
        {showScheduleModal && <ScheduleIntervention student={selectedStudent} onClose={() => setShowScheduleModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
