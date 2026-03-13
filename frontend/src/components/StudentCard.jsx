import { motion } from "framer-motion";
import { User, Mail, GraduationCap, TrendingUp, Calendar, FileText } from "lucide-react";

export default function StudentCard({ student, onAnalyze, onSchedule }) {
  // Simplified detail extraction
  const roll = student.details?.rollNumber || "N/A";
  const dept = student.details?.department || "N/A";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all flex flex-col h-full group"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
          <User size={32} />
        </div>
        <div className="text-right">
          <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Roll Number</div>
          <div className="text-lg font-bold text-white">{roll}</div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-black text-white mb-2 truncate">{student.username}</h3>
        <p className="text-slate-500 flex items-center gap-2 font-medium">
          <Mail size={16} /> {student.email}
        </p>
      </div>

      <div className="flex items-center gap-4 mb-10 pt-6 border-t border-white/5">
        <div className="px-4 py-2 bg-indigo-500/10 rounded-lg text-indigo-400 text-sm font-bold flex items-center gap-2">
          <GraduationCap size={16} /> {dept}
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-4">
        <button 
          onClick={onAnalyze}
          className="flex items-center justify-center gap-2 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-indigo-600 hover:border-indigo-600 transition-all text-sm font-black group/btn"
        >
          <TrendingUp size={18} className="text-indigo-400 group-hover/btn:text-white" /> AI REPORT
        </button>
        <button 
          onClick={onSchedule}
          className="flex items-center justify-center gap-2 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-purple-600 hover:border-purple-600 transition-all text-sm font-black group/btn"
        >
          <Calendar size={18} className="text-purple-400 group-hover/btn:text-white" /> SCHEDULE
        </button>
      </div>
    </motion.div>
  );
}
