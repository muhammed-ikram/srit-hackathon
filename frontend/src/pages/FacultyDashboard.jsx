import { useState, useEffect, useContext } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, UserPlus, Search, AlertCircle, CheckCircle2, MessageSquare,
  Globe, Brain, X, Phone, Hash, TrendingUp, Calendar, ChevronRight
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
    { id: "resources", label: "Resource Hub", icon: <Globe size={18} /> },
    { id: "complaints", label: "Queries", icon: <MessageSquare size={18} /> },
  ];

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
