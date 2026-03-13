import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const quotes = [
    {
      text: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela"
    },
    {
      text: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King"
    },
    {
      text: "Empowering campuses, guarding futures. CampusGuardian AI is the next step in educational excellence.",
      author: "CampusGuardian AI"
    }
  ];

  const features = [
    {
      title: "Performance AI",
      description: "Advanced analytics to track and improve student performance through intelligent insights.",
      icon: "📊"
    },
    {
      title: "Seamless Counseling",
      description: "Direct connection between students, counselors, and HODs for holistic growth.",
      icon: "🤝"
    },
    {
      title: "Resource Management",
      description: "Real-time updates on lab availability, library resources, and hostel management.",
      icon: "🏢"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 relative overflow-x-hidden font-sans">
      {/* Background Decorative Blurs */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="fixed top-[30%] left-[40%] w-[30%] h-[30%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative z-10 w-full max-w-7xl pt-24 pb-48 px-8 sm:px-12 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block px-6 py-2 mb-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-bold tracking-[0.3em] uppercase text-indigo-400"
          >
            The Future of Campus Intelligence
          </motion.div>

          <h1 className="text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-[0.85] text-white">
            Campus<br /><span className="bg-gradient-to-tr from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent italic">Guardian</span> AI
          </h1>

          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-400 mb-16 font-medium leading-relaxed tracking-tight">
            Empowering educational institutions with AI-driven performance tracking, integrated counseling, and seamless resource management.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="group relative px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-bold text-2xl transition-all border border-white/20 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Launch Guardian <ArrowRight size={28} />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-12 py-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl font-bold text-2xl transition-all"
            >
              Portal Access
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Quotes Section */}
      <section className="w-full max-w-[90rem] py-48 z-10 px-8 sm:px-12 md:px-24">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Philosophy of Excellence</h2>
          <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {quotes.map((quote, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2 * idx, duration: 0.8 }}
              className="p-12 bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] rounded-[3rem] relative group transition-all hover:bg-white/[0.04] hover:border-indigo-500/30"
            >
              <div className="text-7xl text-indigo-500/10 absolute top-8 left-8 font-serif group-hover:text-indigo-500/20 transition-colors">"</div>
              <p className="text-2xl text-slate-300 italic mb-10 relative z-10 font-light leading-relaxed">
                {quote.text}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-[1px] bg-indigo-500" />
                <p className="text-indigo-400 font-bold text-sm tracking-widest uppercase">{quote.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-[90rem] py-48 z-10 px-8 sm:px-12 md:px-24">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Core Ecosystem</h2>
          <div className="w-24 h-1 bg-purple-500 mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-16">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2 * idx }}
              className="group relative"
            >
              <div className="absolute -inset-8 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/[0.05] hover:border-white/20 transition-all text-center h-full flex flex-col items-center">
                <div className="text-7xl mb-10 p-8 bg-white/[0.03] rounded-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-black mb-6 text-white tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed text-xl">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full max-w-5xl py-60 z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-20 bg-gradient-to-b from-indigo-600/10 to-transparent rounded-[4rem] border border-white/10 backdrop-blur-xl"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-12 text-white leading-tight">Join the Next Generation of <br />Higher Education</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-16 py-7 bg-white text-black rounded-[2rem] font-black text-2xl hover:scale-105 hover:shadow-2xl transition-all active:scale-95 shadow-white/20 shadow-lg"
            >
              Get Early Access
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl border-t border-white/5 py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-6 z-10 mt-auto">
        <div className="text-white font-black text-xl tracking-tighter">
          Campus<span className="text-indigo-500">Guardian</span> AI
        </div>
        <div className="text-slate-500 text-sm font-medium tracking-wide uppercase">
          © 2026 CampusGuardian AI. All rights reserved.
        </div>
        <div className="flex gap-8 text-slate-400 text-sm font-bold">
          <a href="#" className="hover:text-white transition-colors">Vision</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
