/**
 * KeywordBadges — Displays matched and missing keywords as color-coded badges.
 * Props:
 *  - matched: string[]
 *  - missing: string[]
 */
export default function KeywordBadges({ matched = [], missing = [] }) {
  if (matched.length === 0 && missing.length === 0) {
    return (
      <p className="text-slate-500 text-sm">
        No keyword data available. Add a job description to enable keyword matching.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {matched.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
            ✓ Matched Keywords ({matched.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {matched.map((kw) => (
              <span
                key={kw}
                className="text-xs font-medium px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
            ✗ Missing Keywords ({missing.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {missing.map((kw) => (
              <span
                key={kw}
                className="text-xs font-medium px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
