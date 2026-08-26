import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

const STEPS = [
  'Extracting resume content…',
  'Analyzing your experience…',
  'Evaluating skills and keywords…',
  'Checking ATS compatibility…',
  'Generating improvement suggestions…',
  'Almost done…',
]

export default function LoadingScreen() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
      {/* Spinner */}
      <div className="relative w-24 h-24 mb-10">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
        <div className="absolute inset-3 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <Sparkles size={22} className="text-indigo-400" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">Analyzing Your Resume</h2>
      <p className="text-slate-400 text-sm mb-8">This usually takes 15–30 seconds</p>

      {/* Step list */}
      <div className="space-y-3 w-full max-w-sm">
        {STEPS.map((step, idx) => (
          <div
            key={step}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500
              ${idx === stepIndex
                ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300'
                : idx < stepIndex
                ? 'text-slate-500'
                : 'text-slate-700'
              }`}
          >
            <span className="text-lg">
              {idx < stepIndex ? '✓' : idx === stepIndex ? '→' : '○'}
            </span>
            <span className="text-sm font-medium">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
