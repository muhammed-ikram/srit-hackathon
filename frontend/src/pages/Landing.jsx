import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Antigravity from '../components/Antigravity';

/* ── Stress-management quotes for the marquee ticker ── */
const TICKER_QUOTES = [
  "\"Take a deep breath. You've got this.\"",
  "\"Progress, not perfection.\"",
  "\"Rest is not a reward — it's a requirement.\"",
  "\"One step at a time builds the whole stairway.\"",
  "\"Your well-being is your superpower.\"",
  "\"Pause. Reflect. Recharge.\"",
  "\"Stress is a signal, not a sentence.\"",
  "\"Balance is the foundation of excellence.\"",
  "\"Growth lives just outside your comfort zone.\"",
  "\"Small wins compound into great victories.\"",
  "\"A calm mind is your competitive advantage.\"",
  "\"You cannot pour from an empty cup.\"",
];

/* Duplicate for seamless infinite loop */
const DOUBLED = [...TICKER_QUOTES, ...TICKER_QUOTES];

const Ticker = ({ reverse = false, speed = 60 }) => (
  <div className="overflow-hidden w-full">
    <div
      className={`flex gap-16 whitespace-nowrap w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
      style={{ animationDuration: `${speed}s` }}
    >
      {DOUBLED.map((q, i) => (
        <span
          key={i}
          className="text-sm font-semibold tracking-widest uppercase text-slate-400 flex items-center gap-6"
        >
          {q}
          <span className="w-2 h-2 rounded-full bg-indigo-500/60 inline-block" />
        </span>
      ))}
    </div>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();

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

  const stressQuotes = [
    {
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein"
    },
    {
      text: "Do not anticipate trouble, or worry about what may never happen. Keep in the sunlight.",
      author: "Benjamin Franklin"
    },
    {
      text: "You don't have to control your thoughts. You just have to stop letting them control you.",
      author: "Dan Millman"
    },
    {
      text: "Stress is the gap between how things are and how we think they should be.",
      author: "Unknown"
    },
    {
      text: "Almost everything will work again if you unplug it for a few minutes — including you.",
      author: "Anne Lamott"
    },
    {
      text: "Your calm is your power. Protect it fiercely.",
      author: "CampusGuardian AI"
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center relative overflow-x-hidden font-sans" style={{ padding: 0 }}>

      {/* ── CSS Keyframes injected via a style tag ── */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse linear infinite;
        }
      `}</style>

      {/* ── Antigravity Particle Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        <Suspense fallback={null}>
          <Antigravity
            count={500}
            magnetRadius={12}
            ringRadius={5}
            waveSpeed={0.4}
            waveAmplitude={1}
            particleSize={1.5}
            lerpSpeed={0.05}
            color="#5555ff"
            autoAnimate
            particleVariance={1}
            rotationSpeed={0}
            depthFactor={1}
            pulseSpeed={3}
            particleShape="sphere"
            fieldStrength={10}
          />
        </Suspense>
      </div>

      {/* Dark overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-black/50" />

      {/* Ambient blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse pointer-events-none z-[1]" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse pointer-events-none z-[1]" style={{ animationDelay: '2s' }} />

      {/* Grid */}
      <div className="fixed inset-0 z-[1] opacity-[0.07] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      {/* ═══════════════════════════════════
          TOP TICKER BAND
      ════════════════════════════════════ */}
      <div className="w-full z-10 overflow-hidden border-b border-white/5 bg-white/[0.02] py-5 space-y-4">
        <Ticker speed={80} />
        <Ticker reverse speed={70} />
      </div>

      {/* ═══════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center relative z-10 w-full max-w-7xl pt-24 pb-40 px-8 sm:px-12 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="inline-block px-6 py-2 mb-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-bold tracking-[0.3em] uppercase text-indigo-400"
          >
            The Future of Campus Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.1 }}
            className="text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-[0.85] text-white"
          >
            Campus<br />
            <span className="bg-gradient-to-tr from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent italic">
              Guardian
            </span>{' '}AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-400 mb-16 font-medium leading-relaxed tracking-tight"
          >
            Empowering educational institutions with AI-driven performance tracking, integrated counseling, and seamless resource management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          >
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
              whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-12 py-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl font-bold text-2xl transition-all"
            >
              Portal Access
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════
          TICKER BAND — top row left→right
      ════════════════════════════════════ */}
      <div className="w-full z-10 overflow-hidden border-y border-white/5 bg-white/[0.02] py-5 space-y-4">
        <Ticker speed={80} />
        <Ticker reverse speed={70} />
      </div>

      {/* ═══════════════════════════════════
          STRESS MANAGEMENT QUOTES
      ════════════════════════════════════ */}
      <section className="w-full max-w-[90rem] py-40 z-10 px-8 sm:px-12 md:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <p className="text-indigo-400 text-xs font-black tracking-[0.5em] uppercase mb-4">Well-being First</p>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Your Mind Matters</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
          <p className="text-slate-400 text-xl mt-8 max-w-2xl mx-auto font-medium leading-relaxed">
            CampusGuardian AI is built not just for academic performance — but to actively support the mental wellness of every student.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {stressQuotes.map((quote, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: idx * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative p-10 bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-[2.5rem] group hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="absolute -inset-px rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-7xl text-indigo-500/15 absolute top-6 left-8 font-serif group-hover:text-indigo-500/30 transition-colors duration-300 select-none">"</div>
              <p className="text-xl text-slate-300 italic mb-8 relative z-10 font-light leading-relaxed pt-4">
                {quote.text}
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-8 h-[1px] bg-indigo-500" />
                <p className="text-indigo-400 font-bold text-xs tracking-widest uppercase">{quote.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          SECOND TICKER between sections
      ════════════════════════════════════ */}
      <div className="w-full z-10 overflow-hidden border-y border-white/5 bg-white/[0.02] py-5">
        <Ticker speed={90} />
      </div>

      {/* ═══════════════════════════════════
          FEATURES
      ════════════════════════════════════ */}
      <section className="w-full max-w-[90rem] py-40 z-10 px-8 sm:px-12 md:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <p className="text-purple-400 text-xs font-black tracking-[0.5em] uppercase mb-4">Platform Overview</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Core Ecosystem</h2>
          <div className="w-24 h-1 bg-purple-500 mx-auto rounded-full" />
        </motion.div>
        <div className="grid md:grid-cols-3 gap-16">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? -60 : idx === 2 ? 60 : 0, y: idx === 1 ? 60 : 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.15 * idx, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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

      {/* ═══════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════════ */}
      <section className="w-full max-w-5xl py-48 z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="p-20 bg-gradient-to-b from-indigo-600/10 to-transparent rounded-[4rem] border border-white/10 backdrop-blur-xl"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-12 text-white leading-tight">
            Join the Next Generation of <br />Higher Education
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-16 py-7 bg-white text-black rounded-[2rem] font-black text-2xl hover:shadow-2xl transition-all shadow-white/20 shadow-lg"
            >
              Get Early Access
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════
          FOOTER
      ════════════════════════════════════ */}
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
