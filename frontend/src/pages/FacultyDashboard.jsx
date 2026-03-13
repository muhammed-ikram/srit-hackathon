import { useState, useEffect } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Search, FileText, Calendar, AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import StudentCard from "../components/StudentCard";
import AIReportModal from "../components/AIReportModal";
import ScheduleIntervention from "../components/ScheduleIntervention";
import ComplaintSection from "../components/ComplaintSection";

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // For search/add meta
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    fetchMyStudents();
    fetchAllStudents();
  }, []);

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

  const filteredDiscovery = allStudents.filter(s => 
    s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-12">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">Faculty Dashboard</h1>
          <p className="text-slate-400 text-lg font-medium">Manage students and monitor academic health.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20"
        >
          <UserPlus size={24} /> Add Student
        </button>
      </header>

      {/* Stats/Overview (Optional eye candy) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center gap-6">
          <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400"><Users size={32} /></div>
          <div>
            <div className="text-3xl font-black">{students.length}</div>
            <div className="text-slate-500 font-bold uppercase text-xs tracking-widest">Active Students</div>
          </div>
        </div>
        <div className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center gap-6">
          <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400"><AlertCircle size={32} /></div>
          <div>
            <div className="text-3xl font-black text-orange-400">2</div>
            <div className="text-slate-500 font-bold uppercase text-xs tracking-widest">High risk flagging</div>
          </div>
        </div>
        <div className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center gap-6">
          <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400"><CheckCircle2 size={32} /></div>
          <div>
            <div className="text-3xl font-black">12</div>
            <div className="text-slate-500 font-bold uppercase text-xs tracking-widest">Sessions Completed</div>
          </div>
        </div>
      </div>

      {/* Student List */}
      <section className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black flex items-center gap-3">
                <Users className="text-indigo-500" /> Your Counseling List
            </h2>
        </div>
        
        {loading ? (
            <div className="text-center py-20 text-slate-500 font-bold">Initializing System...</div>
        ) : students.length === 0 ? (
            <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                <p className="text-slate-400 text-xl font-medium mb-8 text-center px-4">You haven't added any students to your list yet.</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold"
                >
                    Get Started
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {students.map(student => (
                    <StudentCard 
                        key={student._id} 
                        student={student} 
                        onAnalyze={() => {
                            setSelectedStudent(student);
                            setShowAIModal(true);
                        }}
                        onSchedule={() => {
                            setSelectedStudent(student);
                            setShowScheduleModal(true);
                        }}
                    />
                ))}
            </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto mt-32 mb-24 border-t border-white/5 pt-32">
          <ComplaintSection />
      </section>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl"
            >
              <h3 className="text-3xl font-black mb-8">Add to Counseling</h3>
              <div className="relative mb-8">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search by name or email..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="max-h-80 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {filteredDiscovery.length > 0 ? filteredDiscovery.map(s => (
                  <div key={s._id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                    <div>
                      <div className="font-bold text-lg">{s.username}</div>
                      <div className="text-slate-500 text-sm">{s.email}</div>
                    </div>
                    <button 
                      onClick={() => addStudent(s._id)}
                      className="p-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      <UserPlus size={20} />
                    </button>
                  </div>
                )) : (
                  <div className="text-center py-10 text-slate-500 font-medium">No students found matching your search.</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Report Modal */}
      <AnimatePresence>
        {showAIModal && (
          <AIReportModal 
            student={selectedStudent} 
            onClose={() => setShowAIModal(false)} 
            onSchedule={() => {
                setShowAIModal(false);
                setShowScheduleModal(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Schedule Intervention Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <ScheduleIntervention 
            student={selectedStudent} 
            onClose={() => setShowScheduleModal(false)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
