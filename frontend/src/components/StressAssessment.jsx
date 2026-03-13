import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronDown, Send, AlertCircle } from "lucide-react";

const QUESTIONS = [
  {
    id: 1,
    text: "How often do you feel overwhelmed by your academic workload?",
    options: [
      { label: "Never — I manage it well", score: 1 },
      { label: "Rarely — only during exams", score: 2 },
      { label: "Sometimes — a few times a week", score: 3 },
      { label: "Often — almost every day", score: 4 },
      { label: "Always — I feel constantly overwhelmed", score: 5 },
    ],
  },
  {
    id: 2,
    text: "How would you rate the quality of your sleep over the past two weeks?",
    options: [
      { label: "Excellent — 7-9 hrs, feel rested", score: 1 },
      { label: "Good — mostly adequate", score: 2 },
      { label: "Fair — sometimes troubled", score: 3 },
      { label: "Poor — frequently disrupted", score: 4 },
      { label: "Very poor — barely sleeping", score: 5 },
    ],
  },
  {
    id: 3,
    text: "How difficult is it for you to concentrate on studies or daily tasks?",
    options: [
      { label: "No difficulty — very focused", score: 1 },
      { label: "Slight difficulty sometimes", score: 2 },
      { label: "Moderate difficulty most days", score: 3 },
      { label: "High difficulty — often distracted", score: 4 },
      { label: "Cannot concentrate at all", score: 5 },
    ],
  },
  {
    id: 4,
    text: "How often do you experience physical symptoms like headaches, fatigue, or muscle tension?",
    options: [
      { label: "Never", score: 1 },
      { label: "Rarely — once a week", score: 2 },
      { label: "Sometimes — a few times a week", score: 3 },
      { label: "Often — almost daily", score: 4 },
      { label: "Every day, severely", score: 5 },
    ],
  },
  {
    id: 5,
    text: "How satisfied are you with your social connections and support system?",
    options: [
      { label: "Very satisfied — great support", score: 1 },
      { label: "Mostly satisfied", score: 2 },
      { label: "Neutral — could be better", score: 3 },
      { label: "Mostly dissatisfied — feel isolated", score: 4 },
      { label: "Very dissatisfied — no support", score: 5 },
    ],
  },
  {
    id: 6,
    text: "How often do you feel anxious or worried about the future?",
    options: [
      { label: "Rarely — I feel optimistic", score: 1 },
      { label: "Occasionally", score: 2 },
      { label: "Sometimes — it affects my day", score: 3 },
      { label: "Often — persistent worry", score: 4 },
      { label: "Constantly — it's overwhelming", score: 5 },
    ],
  },
  {
    id: 7,
    text: "How well do you manage your time between academics, rest, and leisure?",
    options: [
      { label: "Excellent — great balance", score: 1 },
      { label: "Good — mostly balanced", score: 2 },
      { label: "Fair — struggle sometimes", score: 3 },
      { label: "Poor — always rushed", score: 4 },
      { label: "No balance at all", score: 5 },
    ],
  },
  {
    id: 8,
    text: "How often do you engage in activities that bring you joy or relaxation?",
    options: [
      { label: "Daily — self-care is a priority", score: 1 },
      { label: "A few times a week", score: 2 },
      { label: "Occasionally", score: 3 },
      { label: "Rarely — no time", score: 4 },
      { label: "Never — completely burnt out", score: 5 },
    ],
  },
];

export default function StressAssessment({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;
  const progress = (answered / QUESTIONS.length) * 100;
  const allAnswered = answered === QUESTIONS.length;

  const handleSelect = (qId, score) => {
    setAnswers(prev => ({ ...prev, [qId]: score }));
    // Auto-advance to next unanswered question
    if (current < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent(i => i + 1), 350);
    }
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    const total = Object.values(answers).reduce((a, b) => a + b, 0);
    const avg = total / QUESTIONS.length;
    setSubmitted(true);
    setTimeout(() => onComplete(avg, answers), 600);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-6 mb-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20 flex-shrink-0">
          <Brain size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight">Stress Assessment</h1>
          <p className="text-slate-400 font-medium text-lg mt-1">Answer honestly — this is just for you.</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white/5 rounded-full h-2 border border-white/5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-slate-500 -mt-6">
        {answered} / {QUESTIONS.length} answered
      </p>

      {/* Question tabs */}
      <div className="flex flex-wrap gap-2">
        {QUESTIONS.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrent(idx)}
            className={`w-10 h-10 rounded-xl text-sm font-black border transition-all ${
              answers[q.id]
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : current === idx
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-white/10 bg-white/5 text-slate-500 hover:border-white/20'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Active question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10"
        >
          <div className="flex items-start gap-4 mb-8">
            <span className="text-4xl font-black text-indigo-500/40">{String(current + 1).padStart(2, '0')}</span>
            <p className="text-2xl font-bold text-white leading-snug pt-1">{QUESTIONS[current].text}</p>
          </div>

          <div className="space-y-3">
            {QUESTIONS[current].options.map((opt) => {
              const selected = answers[QUESTIONS[current].id] === opt.score;
              return (
                <button
                  key={opt.score}
                  onClick={() => handleSelect(QUESTIONS[current].id, opt.score)}
                  className={`w-full flex items-center justify-between px-7 py-4 rounded-2xl border text-left font-semibold transition-all ${
                    selected
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05] hover:border-white/20'
                  }`}
                >
                  <span>{opt.label}</span>
                  {selected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-indigo-500 flex-shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Prev / Next */}
          <div className="flex gap-4 mt-8">
            {current > 0 && (
              <button
                onClick={() => setCurrent(i => i - 1)}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold text-slate-300 hover:bg-white/10 transition-all"
              >
                ← Previous
              </button>
            )}
            {current < QUESTIONS.length - 1 && (
              <button
                onClick={() => setCurrent(i => i + 1)}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold text-slate-300 hover:bg-white/10 transition-all ml-auto"
              >
                Next →
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Submit */}
      {!allAnswered && (
        <p className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <AlertCircle size={16} /> Please answer all questions to unlock your report.
        </p>
      )}
      <motion.button
        whileHover={{ scale: allAnswered ? 1.02 : 1 }}
        whileTap={{ scale: allAnswered ? 0.97 : 1 }}
        onClick={handleSubmit}
        disabled={!allAnswered || submitted}
        className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg transition-all ${
          allAnswered
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 cursor-pointer'
            : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
        }`}
      >
        <Send size={20} />
        {submitted ? 'Generating your report...' : 'Submit & See My Report'}
      </motion.button>
    </div>
  );
}
