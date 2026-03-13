import { useState } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Brain, AlertTriangle, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AIReportModal({ student, onClose, onSchedule }) {
  const [data, setData] = useState({
    attendance: "",
    performance: "",
    additional: ""
  });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const generateReport = async () => {
    if (!data.attendance || !data.performance) {
      toast.error("Please provide attendance and performance data");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/ai/generate-student-report", {
        studentName: student.username,
        attendance: data.attendance,
        performanceData: data.performance,
        additionalInfo: data.additional
      });
      if (res.data.success) {
        setReport(res.data.report);
      }
    } catch (err) {
      toast.error("Failed to generate AI report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
              <Brain size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">AI Intel: {student.username}</h3>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Predictive Performance Analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {!report ? (
            <div className="space-y-8 max-w-2xl mx-auto py-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">Attendance %</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 75"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    onChange={(e) => setData({...data, attendance: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">Raw Grades/Performance</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Maths: B+, Science: C"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    onChange={(e) => setData({...data, performance: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">Additional Observations</label>
                <textarea 
                  placeholder="Behavioral patterns, late submissions, etc."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  onChange={(e) => setData({...data, additional: e.target.value})}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgb(79, 70, 229)" }}
                whileTap={{ scale: 0.98 }}
                onClick={generateReport}
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-indigo-500/20 text-xl disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={28} /> : <><Sparkles size={28} /> Generate AI Report</>}
              </motion.button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="prose prose-invert max-w-none"
            >
              <div className="flex items-center gap-2 mb-8 text-indigo-400 font-bold uppercase tracking-widest text-sm">
                <FileText size={18} /> Detailed Report Output
              </div>
              <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] whitespace-pre-wrap text-slate-200 leading-relaxed text-lg mb-10">
                {report}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setReport(null)}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all flex-1"
                >
                  Regenerate Analysis
                </button>
                <button 
                  onClick={() => {
                    onClose();
                    onSchedule();
                  }}
                  className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 transition-all flex-1"
                >
                  Schedule Intervention Now
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
