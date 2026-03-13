import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/* Maps score → gradient colour stop */
function scoreColor(score) {
  if (score <= 1.8) return '#34d399'; // emerald
  if (score <= 2.6) return '#22d3ee'; // cyan
  if (score <= 3.4) return '#facc15'; // yellow
  if (score <= 4.2) return '#fb923c'; // orange
  return '#f87171';                   // rose
}

const TIER_LABELS = {
  'Minimal Stress': '🌿 Minimal',
  'Low Stress':     '🌤️ Low',
  'Moderate Stress':'🌧️ Moderate',
  'High Stress':    '⛈️ High',
  'Severe Stress':  '🌪️ Severe',
};

export default function StressChart({ reports }) {
  if (!reports || reports.length === 0) return null;

  // Sort oldest → newest for the chart
  const sorted = [...reports].reverse();

  const labels = sorted.map(r =>
    new Date(r.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: '2-digit'
    })
  );

  const scores = sorted.map(r => parseFloat(r.score.toFixed(2)));

  // Build a per-point gradient by assigning each point a colour
  const pointColors = scores.map(scoreColor);

  const data = {
    labels,
    datasets: [
      {
        label: 'Stress Score',
        data: scores,
        borderColor: '#6366f1',
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const { chartArea } = ctx.chart;
          if (!chartArea) return 'rgba(99,102,241,0.1)';
          const gradient = canvas.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(244,114,182,0.35)');   // rose at top (high stress)
          gradient.addColorStop(0.5, 'rgba(99,102,241,0.2)');   // indigo mid
          gradient.addColorStop(1, 'rgba(52,211,153,0.05)');    // emerald at bottom (low stress)
          return gradient;
        },
        fill: true,
        tension: 0.45,
        pointRadius: 7,
        pointHoverRadius: 10,
        pointBackgroundColor: pointColors,
        pointBorderColor: '#0f0f0f',
        pointBorderWidth: 2,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 900,
      easing: 'easeInOutQuart',
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { family: 'Inter, sans-serif', weight: '700', size: 11 } },
        border: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        min: 1,
        max: 5,
        grid: { color: 'rgba(255,255,255,0.04)' },
        border: { color: 'rgba(255,255,255,0.05)' },
        ticks: {
          color: '#64748b',
          stepSize: 1,
          font: { family: 'Inter, sans-serif', weight: '700', size: 11 },
          callback: (val) => {
            const map = { 1: '🌿 Min', 2: '🌤️ Low', 3: '🌧️ Mod', 4: '⛈️ High', 5: '🌪️ Severe' };
            return map[val] || val;
          },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: 'rgba(99,102,241,0.3)',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        padding: 14,
        callbacks: {
          label: (ctx) => {
            const r = sorted[ctx.dataIndex];
            return [
              `  Score: ${ctx.parsed.y.toFixed(1)} / 5.0`,
              `  Level: ${TIER_LABELS[r.tier] || r.tier}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">Stress Trend</h3>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {reports.length} assessment{reports.length !== 1 ? 's' : ''} recorded
          </p>
        </div>

        {/* Mini legend */}
        <div className="hidden sm:flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
          {[
            { color: '#34d399', label: 'Low' },
            { color: '#facc15', label: 'Mid' },
            { color: '#f87171', label: 'High' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-2 text-slate-400">
              <span className="w-3 h-3 rounded-full" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ height: '320px' }}>
        <Line data={data} options={options} />
      </div>

      {/* Reference bands label */}
      <div className="flex justify-between mt-5 text-[10px] font-black uppercase tracking-widest text-slate-600 px-1">
        <span>1 — Best</span>
        <span>Score Scale (1–5)</span>
        <span>5 — Worst</span>
      </div>
    </div>
  );
}
