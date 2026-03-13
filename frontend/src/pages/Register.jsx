import { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Chrome, ArrowRight, Building, Book, Briefcase, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const { user, loading } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "student",
    details: {}
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.isRegistrationComplete) {
      setStep(2);
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        username: user.username || ""
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetailsChange = (e) => {
    setFormData({
      ...formData,
      details: { ...formData.details, [e.target.name]: e.target.value }
    });
  };

  const submitStep1 = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (res.data.success) {
        toast.success("Account created! Now complete your profile.");
        setStep(2);
      } else if (res.data.message === "User already exists") {
        toast.error("User already exists. Please login.");
        // Optional: navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const submitStep2 = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("auth/complete-profile", {
        role: formData.role,
        details: formData.details
      });
      if (res.data.success) {
        toast.success("Profile completed successfully!");
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
        navigate(dashboardMap[formData.role] || "/home");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete profile");
    }
  };

  const renderRoleFields = () => {
    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500";
    
    switch (formData.role) {
      case "student":
        return (
          <>
            <input name="rollNumber" placeholder="Roll Number" className={inputClass} onChange={handleDetailsChange} required />
            <input name="department" placeholder="Department" className={inputClass} onChange={handleDetailsChange} required />
            <input name="year" placeholder="Year (e.g., 3rd Year)" className={inputClass} onChange={handleDetailsChange} required />
          </>
        );
      case "faculty":
      case "counselor":
        return (
          <>
            <input name="employeeId" placeholder="Employee ID" className={inputClass} onChange={handleDetailsChange} required />
            <input name="department" placeholder="Department" className={inputClass} onChange={handleDetailsChange} required />
            <input name="expertise" placeholder="Specialization / Expertise" className={inputClass} onChange={handleDetailsChange} required />
          </>
        );
      case "hod":
        return (
          <>
            <input name="department" placeholder="Department" className={inputClass} onChange={handleDetailsChange} required />
            <input name="officeNumber" placeholder="Office Number" className={inputClass} onChange={handleDetailsChange} required />
          </>
        );
      case "librarian":
        return (
          <>
            <input name="employeeId" placeholder="Employee ID" className={inputClass} onChange={handleDetailsChange} required />
            <input name="section" placeholder="Library Section" className={inputClass} onChange={handleDetailsChange} required />
          </>
        );
      case "lab_technician":
        return (
          <>
            <input name="employeeId" placeholder="Employee ID" className={inputClass} onChange={handleDetailsChange} required />
            <input name="labName" placeholder="Lab Name" className={inputClass} onChange={handleDetailsChange} required />
          </>
        );
      case "hostel_management":
        return (
          <>
            <input name="hostelName" placeholder="Hostel Name" className={inputClass} onChange={handleDetailsChange} required />
            <input name="block" placeholder="Block/Wing" className={inputClass} onChange={handleDetailsChange} required />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-12 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent)]">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="w-full max-w-2xl p-20 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[4rem] shadow-2xl overflow-hidden relative mx-4"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <header className="text-center mb-12 relative z-10">
                <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                    <UserPlus size={40} className="text-white" />
                </div>
                <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Create Account</h2>
                <p className="text-slate-400 font-medium text-lg">Step 1: Basic Information</p>
            </header>

            <form onSubmit={submitStep1} className="flex flex-col gap-6 relative z-10">
              <div className="relative group">
                <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="relative group">
                <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  name="username"
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="relative group">
                <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgb(79, 70, 229)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-indigo-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-xl shadow-indigo-500/30 text-xl tracking-tight"
              >
                Continue to Profile <ArrowRight size={24} />
              </motion.button>
            </form>

            <div className="flex items-center gap-6 my-10">
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">Or</span>
              <div className="flex-1 h-[1px] bg-white/10" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
              className="w-full py-4 border border-white/10 rounded-2xl text-white font-bold flex items-center justify-center gap-4 bg-white/5 transition-all text-lg"
              onClick={() => window.location.href = "http://localhost:3000/auth/google"}
            >
              <Chrome size={24} /> Join with Google
            </motion.button>

            <p className="text-center mt-12 text-slate-400 font-medium text-lg">
              Already a guardian? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-black transition-colors ml-1">Login here</Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className="w-full max-w-2xl p-20 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[4rem] shadow-2xl relative mx-4"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <header className="text-center mb-12 relative z-10">
              <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Complete Profile</h2>
              <p className="text-slate-400 font-medium text-xl">Step 2: Define your role</p>
            </header>

            <form onSubmit={submitStep2} className="flex flex-col gap-8 relative z-10">
              <div className="relative group">
                <Briefcase size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-5 text-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer font-bold tracking-tight transition-all hover:bg-white/10"
                >
                  <option value="student" className="bg-slate-900 text-white">Student</option>
                  <option value="faculty" className="bg-slate-900 text-white">Faculty / Counselor</option>
                  <option value="hod" className="bg-slate-900 text-white">HOD</option>
                  <option value="librarian" className="bg-slate-900 text-white">Librarian</option>
                  <option value="lab_technician" className="bg-slate-900 text-white">Lab Technician</option>
                  <option value="hostel_management" className="bg-slate-900 text-white">Hostel Management</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-purple-400 transition-colors">
                    <ArrowRight className="rotate-90" size={20} />
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {renderRoleFields()}
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgb(147, 51, 234)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-8 bg-purple-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-xl shadow-purple-500/20 text-xl uppercase tracking-widest"
              >
                Finalize Signup <UserPlus size={24} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
