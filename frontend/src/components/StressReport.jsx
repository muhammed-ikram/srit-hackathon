import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Dumbbell, Gamepad2, Youtube, RefreshCw, TrendingDown, TrendingUp, Minus, Star, CheckCircle, AlertCircle } from "lucide-react";
import api from "../api";

/* ── Recommendations by tier ── */
const TIERS = [
  {
    label: "Minimal Stress",
    emoji: "🌿",
    color: "emerald",
    gradient: "from-emerald-600/20 to-cyan-600/20",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    description: "You are managing stress very well. Keep up your healthy habits and routines — you're thriving!",
    TrendIcon: TrendingUp,
    exercises: [
      { name: "Morning stretching (10 min)", detail: "Maintain flexibility and energy levels" },
      { name: "Evening walk or jog", detail: "30 min to keep endorphins high" },
      { name: "Mindful breathing", detail: "5-5-5 breathing twice daily" },
    ],
    games: [
      { name: "Stardew Valley", detail: "Relaxing farm simulation – peaceful and rewarding" },
      { name: "Journey", detail: "Beautiful, calming exploration game" },
      { name: "Monument Valley", detail: "Elegant puzzle game for your commute" },
    ],
    videos: [
      { title: "10-Min Morning Yoga for Energy", url: "https://www.youtube.com/results?search_query=10+min+morning+yoga+energy", channel: "Yoga with Adriene" },
      { title: "Productivity Tips for Students", url: "https://www.youtube.com/results?search_query=student+productivity+tips", channel: "Thomas Frank" },
      { title: "How to Stay Motivated", url: "https://www.youtube.com/results?search_query=how+to+stay+motivated+student", channel: "Mike and Matty" },
    ],
  },
  {
    label: "Low Stress",
    emoji: "🌤️",
    color: "cyan",
    gradient: "from-cyan-600/20 to-indigo-600/20",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    description: "You're handling things reasonably well, but there are some areas to watch. Building better habits now pays off.",
    TrendIcon: Minus,
    exercises: [
      { name: "Yoga flow (20 min)", detail: "Reduces cortisol and improves mood" },
      { name: "Cycling or swimming", detail: "Low-impact cardio, great for clearing the mind" },
      { name: "Progressive muscle relaxation", detail: "Before bed, 10-15 min" },
    ],
    games: [
      { name: "Animal Crossing", detail: "Chill island life with no time pressure" },
      { name: "A Short Hike", detail: "Tiny open world focused on exploration and joy" },
      { name: "Abzû", detail: "Meditative underwater exploration" },
    ],
    videos: [
      { title: "Beginner 20-Min Yoga for Stress", url: "https://www.youtube.com/results?search_query=beginner+yoga+stress+relief+20+minutes", channel: "Yoga with Adriene" },
      { title: "Study With Me – Pomodoro Timer", url: "https://www.youtube.com/results?search_query=study+with+me+pomodoro+lofi", channel: "LoFi Girl" },
      { title: "How to Deal with Academic Pressure", url: "https://www.youtube.com/results?search_query=how+to+deal+with+academic+pressure", channel: "Psych2Go" },
    ],
  },
  {
    label: "Moderate Stress",
    emoji: "🌧️",
    color: "yellow",
    gradient: "from-yellow-600/20 to-orange-600/20",
    border: "border-yellow-500/30",
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    description: "You are under noticeable stress. It's time to actively invest in your well-being. Small daily changes can shift your baseline significantly.",
    TrendIcon: Minus,
    exercises: [
      { name: "Daily 30-min brisk walk", detail: "Proven to reduce anxiety and improve sleep" },
      { name: "Body-scan meditation (15 min)", detail: "Re-connects you to physical sensations" },
      { name: "Journaling before sleep", detail: "Write 3 things you're grateful for + tomorrow's plan" },
      { name: "Stretching & deep breathing", detail: "Mid-study break, 5-10 min" },
    ],
    games: [
      { name: "Minecraft Creative Mode", detail: "Build freely with no survival pressure" },
      { name: "Sky: Children of the Light", detail: "Beautiful social exploration game" },
      { name: "Unpacking", detail: "Calming, satisfying puzzle game about moving in" },
    ],
    videos: [
      { title: "Guided Meditation for Anxiety Relief", url: "https://www.youtube.com/results?search_query=guided+meditation+anxiety+relief+students", channel: "Great Meditation" },
      { title: "How to Manage Stress as a Student", url: "https://www.youtube.com/results?search_query=how+to+manage+stress+as+a+student", channel: "Psych2Go" },
      { title: "10-Min Body Scan Before Bed", url: "https://www.youtube.com/results?search_query=body+scan+meditation+before+bed+10+minutes", channel: "Headspace" },
      { title: "The Science of Stress", url: "https://www.youtube.com/results?search_query=science+of+stress+explained", channel: "TED-Ed" },
    ],
  },
  {
    label: "High Stress",
    emoji: "⛈️",
    color: "orange",
    gradient: "from-orange-600/20 to-rose-600/20",
    border: "border-orange-500/30",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    description: "You are experiencing high stress. This needs attention. Please consider speaking to a counselor. Prioritize rest and recovery above everything else.",
    TrendIcon: TrendingDown,
    exercises: [
      { name: "Nature walk daily (30-45 min)", detail: "Nature exposure significantly lowers cortisol" },
      { name: "Box breathing (4-4-4-4)", detail: "Inhale 4s, hold 4s, exhale 4s, hold 4s — repeat 10×" },
      { name: "Light yoga or gentle stretching", detail: "Avoid intense workouts when highly stressed" },
      { name: "Cold-water face splash", detail: "Activates dive reflex, instant calm" },
      { name: "Phone-free hour before bed", detail: "No screens — read or listen to calm music" },
    ],
    games: [
      { name: "Alto's Odyssey", detail: "Serene endless snowboarding — incredibly peaceful" },
      { name: "Flower (PS/PC)", detail: "Float petals through beautiful landscapes" },
      { name: "Cloud gardens", detail: "Relaxing diorama-building game — no fail state" },
    ],
    videos: [
      { title: "Instant Anxiety Relief – Box Breathing", url: "https://www.youtube.com/results?search_query=box+breathing+anxiety+relief+technique", channel: "Mark Wiens" },
      { title: "Yoga Nidra for Deep Rest (30 min)", url: "https://www.youtube.com/results?search_query=yoga+nidra+for+deep+rest+30+minutes", channel: "Yoga Nidra Network" },
      { title: "Signs You Need to Take a Break", url: "https://www.youtube.com/results?search_query=signs+you+need+to+take+a+break+burnout", channel: "Psych2Go" },
      { title: "How to Stop Overthinking", url: "https://www.youtube.com/results?search_query=how+to+stop+overthinking+anxiety", channel: "Therapy in a Nutshell" },
    ],
  },
  {
    label: "Severe Stress",
    emoji: "🌪️",
    color: "rose",
    gradient: "from-rose-600/20 to-purple-600/20",
    border: "border-rose-500/30",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    description: "Your stress level is severe. Please reach out to your counselor or the hostel management IMMEDIATELY. You are not alone — help is available and it works.",
    TrendIcon: TrendingDown,
    exercises: [
      { name: "STOP technique (right now)", detail: "Stop → Take a breath → Observe → Proceed mindfully" },
      { name: "5-4-3-2-1 grounding exercise", detail: "Name 5 things you see, 4 feel, 3 hear, 2 smell, 1 taste" },
      { name: "Gentle walk outside daily", detail: "Even 10 minutes helps reset the nervous system" },
      { name: "Talk to someone today", detail: "Friend, family, counselor — connection heals" },
      { name: "Sleep: aim for 7-8 hours", detail: "Prioritize above studying — rest is productive" },
    ],
    games: [
      { name: "Alto's Odyssey", detail: "Gentle and meditative — no competition" },
      { name: "Kind Words (lo-fi chillout game)", detail: "Write kind notes to strangers. Receive kind notes back." },
      { name: "Spiritfarer", detail: "Warm, emotional game about care and letting go" },
    ],
    videos: [
      { title: "Emergency Calm Down Technique", url: "https://www.youtube.com/results?search_query=emergency+calm+down+technique+anxiety+attack", channel: "Therapy in a Nutshell" },
      { title: "Guided Breathing for Panic", url: "https://www.youtube.com/results?search_query=guided+breathing+panic+attack+4-7-8", channel: "Calm" },
      { title: "You Are Not Alone – Mental Health", url: "https://www.youtube.com/results?search_query=you+are+not+alone+mental+health+students", channel: "Psych2Go" },
      { title: "Talking to a Therapist – What to Expect", url: "https://www.youtube.com/results?search_query=talking+to+a+therapist+first+time+what+to+expect", channel: "Kati Morton" },
    ],
  },
];

function getTier(avg) {
  if (avg <= 1.8) return TIERS[0];
  if (avg <= 2.6) return TIERS[1];
  if (avg <= 3.4) return TIERS[2];
  if (avg <= 4.2) return TIERS[3];
  return TIERS[4];
}

const Section = ({ icon: Icon, title, color, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8"
  >
    <h3 className={`text-xl font-black mb-6 flex items-center gap-3 text-${color}-400`}>
      <Icon size={22} /> {title}
    </h3>
    {children}
  </motion.div>
);

export default function StressReport({ avg, answers, onRetake }) {
  const tier = getTier(avg);
  const score = Math.round(avg * 10) / 10;
  const percent = Math.round(((avg - 1) / 4) * 100);

  const [savedStatus, setSavedStatus] = useState('saving'); // 'saving' | 'saved' | 'error'

  // Save to backend when report is first shown
  useEffect(() => {
    const save = async () => {
      try {
        await api.post('/api/stress-reports', { score: avg, answers });
        setSavedStatus('saved');
      } catch (err) {
        setSavedStatus('error');
      }
    };
    save();
  }, []);

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Save status indicator */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
        {savedStatus === 'saving' && <span className="text-slate-500 animate-pulse">Saving your report...</span>}
        {savedStatus === 'saved' && (
          <span className="flex items-center gap-2 text-emerald-400">
            <CheckCircle size={14} /> Report saved to your profile
          </span>
        )}
        {savedStatus === 'error' && (
          <span className="flex items-center gap-2 text-rose-400">
            <AlertCircle size={14} /> Could not save — check your connection
          </span>
        )}
      </div>

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`relative p-10 rounded-[3rem] bg-gradient-to-br ${tier.gradient} border ${tier.border} overflow-hidden`}
      >
        <div className="absolute top-8 right-10 text-8xl select-none opacity-30">{tier.emoji}</div>
        <div className={`inline-block px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest mb-6 ${tier.badge}`}>
          {tier.label}
        </div>
        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">Your Stress Score</h1>
        <div className="flex items-end gap-3 mb-6">
          <span className="text-7xl font-black text-white">{score}</span>
          <span className="text-slate-400 font-bold text-2xl pb-2">/ 5.0</span>
        </div>

        <div className="w-full bg-black/30 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-rose-500"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-widest mb-6">
          <span>Minimal</span><span>Moderate</span><span>Severe</span>
        </div>
        <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">{tier.description}</p>
      </motion.div>

      {/* Star rating */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2"
      >
        {[1, 2, 3, 4, 5].map(s => (
          <Star
            key={s}
            size={24}
            className={s <= Math.round(score) ? "text-yellow-400 fill-yellow-400" : "text-white/10"}
          />
        ))}
        <span className="text-slate-500 text-sm font-bold ml-2">Stress intensity rating</span>
      </motion.div>

      {/* Exercises */}
      <Section icon={Dumbbell} title="Recommended Exercises & Practices" color="indigo" delay={0.2}>
        <div className="space-y-4">
          {tier.exercises.map((ex, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="w-8 h-8 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0 text-indigo-400 font-black text-sm">{i + 1}</div>
              <div>
                <div className="font-black text-white">{ex.name}</div>
                <div className="text-slate-400 text-sm mt-0.5">{ex.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Games */}
      <Section icon={Gamepad2} title="Games to Help You Unwind" color="purple" delay={0.35}>
        <div className="grid md:grid-cols-3 gap-4">
          {tier.games.map((g, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-purple-500/30 transition-all group">
              <div className="text-3xl mb-3">🎮</div>
              <div className="font-black text-white group-hover:text-purple-400 transition-colors">{g.name}</div>
              <div className="text-slate-400 text-sm mt-1 leading-relaxed">{g.detail}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* YouTube */}
      <Section icon={Youtube} title="Helpful YouTube Videos" color="rose" delay={0.5}>
        <div className="space-y-3">
          {tier.videos.map((v, i) => (
            <a
              key={i}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-rose-500/30 hover:bg-white/[0.04] transition-all group"
            >
              <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Youtube size={20} className="text-rose-400" />
              </div>
              <div className="flex-1">
                <div className="font-black text-white group-hover:text-rose-400 transition-colors">{v.title}</div>
                <div className="text-slate-500 text-xs uppercase tracking-widest font-bold mt-0.5">{v.channel}</div>
              </div>
              <span className="text-slate-600 group-hover:text-rose-400 transition-colors">→</span>
            </a>
          ))}
        </div>
      </Section>

      {/* Retake */}
      <button
        onClick={onRetake}
        className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-slate-300 hover:bg-white/10 transition-all"
      >
        <RefreshCw size={18} /> Retake Assessment
      </button>
    </div>
  );
}
