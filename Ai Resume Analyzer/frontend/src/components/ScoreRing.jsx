import { useEffect, useRef } from 'react'

/**
 * Animated SVG circular score ring.
 * Props:
 *  - score: number (0–100)
 *  - size: number (px, default 120)
 *  - strokeWidth: number (default 10)
 *  - color: tailwind-compatible stroke color string (default '#6366f1')
 *  - label: string shown below score
 */
export default function ScoreRing({
  score = 0,
  size = 120,
  strokeWidth = 10,
  color = '#6366f1',
  label = '',
}) {
  const circleRef = useRef(null)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    if (!circleRef.current) return
    const offset = circumference - (score / 100) * circumference
    circleRef.current.style.transition = 'stroke-dashoffset 1.2s ease-out'
    circleRef.current.style.strokeDashoffset = offset
  }, [score, circumference])

  const scoreColor =
    score >= 80
      ? '#22c55e'
      : score >= 60
      ? '#eab308'
      : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color || scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference} // starts at 0, animates to score
        />
      </svg>
      {/* Centered score number (counter-rotated) */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size, marginTop: -(size + 8) }}
      >
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-xs text-slate-500">/100</span>
      </div>
      {label && (
        <span className="text-xs text-slate-400 font-medium text-center max-w-[100px]">
          {label}
        </span>
      )}
    </div>
  )
}
