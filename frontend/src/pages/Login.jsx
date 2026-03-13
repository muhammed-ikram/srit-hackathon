import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Chrome, LogIn, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      await api.post("auth/login", { email, password });
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass"
        style={{ width: "100%", maxWidth: "450px", padding: "40px", position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", bottom: "-50px", left: "-50px", width: "150px", height: "150px", background: "var(--secondary)", filter: "blur(70px)", opacity: 0.2, borderRadius: "50%" }} />

        <header style={{ textAlign: "center", marginBottom: "32px" }}>
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, var(--accent), var(--primary))", borderRadius: "16px", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(34, 211, 238, 0.3)" }}
          >
            <LogIn size={32} color="white" />
          </motion.div>
          <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>Welcome Back</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Ready for the next challenge?</p>
        </header>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ position: "relative" }}>
            <Mail size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="email"
              placeholder="Email Address"
              style={{ width: "100%", paddingLeft: "48px" }}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ position: "relative" }}>
            <Lock size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="password"
              placeholder="Password"
              style={{ width: "100%", paddingLeft: "48px" }}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
            style={{ width: "100%", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            Login <ArrowRight size={18} />
          </motion.button>
        </form>

        <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Secure access</span>
          <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        <motion.button
          whileHover={{ background: "rgba(255,255,255,0.08)" }}
          style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.2s" }}
          onClick={() => {
            window.location.href = "http://localhost:3000/auth/google";
          }}
        >
          <Chrome size={20} /> Continue with Google
        </motion.button>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
