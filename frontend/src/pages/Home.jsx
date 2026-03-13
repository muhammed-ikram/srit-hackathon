import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import { LogOut, User, Zap, Activity, Shield, Layout } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const { user, loading, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            // Entrance animation for header (staggered)
            gsap.from(".main-header > *", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });

            // Staggered entrance for cards
            gsap.from(".stat-card", {
                scrollTrigger: {
                    trigger: ".cards-container",
                    start: "top 80%",
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)"
            });

            // Parallax effect for the bottom section
            gsap.to(".parallax-bg", {
                scrollTrigger: {
                    trigger: ".bottom-section",
                    scrub: true
                },
                y: -100,
                ease: "none"
            });
        }
    }, [loading, user]);

    const handleLogout = async () => {
        await api.post("auth/logout");
        setUser(null);
        navigate("/");
    };

    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: "40px", height: "40px", border: "4px solid var(--primary-glow)", borderTopColor: "var(--primary)", borderRadius: "50%" }}
                />
            </div>
        );
    }

    if (!user) {
        navigate("/");
        return null;
    }

    const cards = [
        { icon: <Activity color="var(--accent)" />, title: "Real-time Stats", desc: "Monitor your hackathon progress live." },
        { icon: <Zap color="#fbbf24" />, title: "Turbo Mode", desc: "Optimization engine is currently active." },
        { icon: <Shield color="#10b981" />, title: "Security", desc: "Your data is protected by AES-256." }
    ];

    return (
        <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

                <motion.nav
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", marginBottom: "40px" }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, var(--primary), var(--secondary))", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Layout size={24} color="white" />
                        </div>
                        <h3 style={{ margin: 0, fontSize: "20px" }}>PROJECT_X</h3>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", pointerEvents: "none" }}>
                            <User size={18} color="var(--text-muted)" />
                            <span style={{ fontWeight: "600" }}>{user.username}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}
                            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
                            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </motion.nav>

                <header style={{ marginBottom: "60px" }} className="main-header">
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: "48px", marginBottom: "16px" }}
                    >
                        System Dashboard
                    </motion.h1>
                    <motion.p
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{ color: "var(--text-muted)", fontSize: "18px" }}
                    >
                        Welcome back, commander. All systems are operational.
                    </motion.p>
                </header>

                <div
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}
                    className="cards-container"
                >
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            whileHover={{ y: -5, borderColor: "var(--primary)" }}
                            className="glass glass-hover stat-card"
                            style={{ padding: "32px" }}
                        >
                            <div style={{ marginBottom: "20px" }}>{card.icon}</div>
                            <h3 style={{ fontSize: "22px", marginBottom: "12px", background: "none", webkitTextFillColor: "white", color: "white" }}>{card.title}</h3>
                            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>{card.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="glass bottom-section"
                    style={{ marginTop: "40px", padding: "40px", textAlign: "center", background: "linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))", position: "relative", overflow: "hidden" }}
                >
                    <div className="parallax-bg" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "200%", background: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)", zIndex: -1 }} />
                    <h2 style={{ marginBottom: "16px" }}>Hackathon Challenge</h2>
                    <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 32px" }}>
                        The clock is ticking. You have 24 hours to change the world. Use your resources wisely and build something that inspires.
                    </p>
                    <button className="btn-primary">Initiate Build Sequence</button>
                </motion.div>

            </div>
        </div>
    );
};

export default Home;
