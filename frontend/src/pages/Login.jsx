import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Chrome, LogIn, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRoleRedirection = (role, isComplete) => {
    if (!isComplete) {
      toast.error("Please complete your profile details first.");
      navigate("/register"); // Should ideally pass some state to trigger step 2 directly
      return;
    }
    
    const dashboardMap = {
      'student': '/dashboard/student',
      'faculty': '/dashboard/faculty',
      'counselor': '/dashboard/counselor',
      'hod': '/dashboard/hod',
      'librarian': '/dashboard/librarian',
      'lab_technician': '/dashboard/lab-technician',
      'hostel_management': '/dashboard/hostel',
      'admin': '/dashboard/admin'
    };
    navigate(dashboardMap[role] || '/home');
  };

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("auth/login", { email, password });
      if (res.data.success) {
        toast.success("Authentication successful!");
        handleRoleRedirection(res.data.role, res.data.isRegistrationComplete);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-12 bg-[radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.1),transparent)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl p-20 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[4rem] shadow-2xl relative overflow-hidden mx-4"
      >
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

        <header className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[2.5rem] mx-auto mb-10 flex items-center justify-center shadow-2xl"
          >
            <LogIn size={48} className="text-white" />
          </motion.div>
          <h2 className="text-5xl font-black text-white mb-4 tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 font-medium text-xl">Portal Access for Guardians</p>
        </header>

        <form onSubmit={submit} className="flex flex-col gap-10 relative z-10">
          <div className="relative group">
            <Mail size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-16 py-6 text-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Lock size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-16 py-6 text-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgb(79, 70, 229)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-10 bg-indigo-600 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-4 transition-colors shadow-2xl shadow-indigo-500/40 text-3xl"
          >
            Sign In <ArrowRight size={32} />
          </motion.button>
        </form>

        <div className="flex items-center gap-8 my-16 relative z-10">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-sm font-bold text-slate-500 uppercase tracking-[0.4em]">Neural Link</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
          className="w-full py-6 border border-white/10 rounded-2xl text-white font-bold flex items-center justify-center gap-6 bg-white/5 transition-all relative z-10 text-2xl mb-12"
          onClick={() => window.location.href = "http://localhost:3000/auth/google"}
        >
          <Chrome size={32} /> Continue with Google
        </motion.button>

        <p className="text-center mt-16 text-slate-400 font-medium text-2xl relative z-10">
          New to the ecosystem? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-black transition-colors ml-2">Register Guardian</Link>
        </p>
      </motion.div>
    </div>
  );
}
