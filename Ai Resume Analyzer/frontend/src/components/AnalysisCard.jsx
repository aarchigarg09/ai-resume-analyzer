/**
 * AnalysisCard — Displays a named section analysis with score bar and feedback.
 * Props:
 *  - title: string
 *  - score: number (0–100)
 *  - feedback: string
 *  - status: 'good' | 'needs_work' | 'missing'
 *  - icon: React node
 */
export default function AnalysisCard({ title, score, feedback, status, icon }) {
  const statusConfig = {
    good: {
      label: 'Good',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      bar: 'bg-green-500',
    },
    needs_work: {
      label: 'Needs Work',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      bar: 'bg-yellow-500',
    },
    missing: {
      label: 'Missing',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      bar: 'bg-red-500',
    },
  }

  const cfg = statusConfig[status] || statusConfig.needs_work

  return (
    <div className={`glass rounded-2xl p-5 border ${cfg.border} animate-slide-up`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          <h3 className="text-white font-semibold text-sm">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
          <span className="text-white font-bold text-sm">{score}</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-1.5 bg-white/5 rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full ${cfg.bar} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-slate-400 text-xs leading-relaxed">{feedback}</p>
    </div>
  )
}
