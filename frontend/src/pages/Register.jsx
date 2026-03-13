import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Chrome, ArrowRight } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      await api.post("auth/register", { email, username, password });
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass"
        style={{ width: "100%", maxWidth: "450px", padding: "40px", position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", background: "var(--primary-glow)", filter: "blur(60px)", borderRadius: "50%" }} />

        <header style={{ textAlign: "center", marginBottom: "32px" }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, var(--primary), var(--secondary))", borderRadius: "16px", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(99, 102, 241, 0.4)" }}
          >
            <User size={32} color="white" />
          </motion.div>
          <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>Join the Future</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Start your hackathon journey today</p>
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
            <User size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              placeholder="Username"
              style={{ width: "100%", paddingLeft: "48px" }}
              onChange={e => setUserName(e.target.value)}
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
            Create Account <ArrowRight size={18} />
          </motion.button>
        </form>

        <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Or continue with</span>
          <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        <motion.button
          whileHover={{ background: "rgba(255,255,255,0.08)" }}
          style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.2s" }}
          onClick={() => {
            window.location.href = "http://localhost:3000/auth/google";
          }}
        >
          <Chrome size={20} /> Google
        </motion.button>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
