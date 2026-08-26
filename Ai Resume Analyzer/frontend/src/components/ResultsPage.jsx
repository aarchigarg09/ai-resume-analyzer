import { useState } from 'react'
import ScoreRing from './ScoreRing'
import AnalysisCard from './AnalysisCard'
import KeywordBadges from './KeywordBadges'
import {
  User, Briefcase, Code, GraduationCap, Layout, Mail,
  TrendingUp, AlertTriangle, Star, ChevronDown, ChevronUp,
  ClipboardCopy, Check, RefreshCw,
} from 'lucide-react'

const SECTION_ICONS = {
  contact_info: <Mail size={14} />,
  summary_objective: <User size={14} />,
  experience: <Briefcase size={14} />,
  skills: <Code size={14} />,
  education: <GraduationCap size={14} />,
  formatting: <Layout size={14} />,
}

const SECTION_LABELS = {
  contact_info: 'Contact Info',
  summary_objective: 'Summary / Objective',
  experience: 'Work Experience',
  skills: 'Skills',
  education: 'Education',
  formatting: 'Formatting & Structure',
}

function ScoreLabel({ score }) {
  if (score >= 80) return <span className="text-green-400">Excellent</span>
  if (score >= 65) return <span className="text-yellow-400">Good</span>
  if (score >= 50) return <span className="text-orange-400">Fair</span>
  return <span className="text-red-400">Needs Work</span>
}

export default function ResultsPage({ data, onReset }) {
  const [copied, setCopied] = useState(false)
  const [showAllSections, setShowAllSections] = useState(false)

  const {
    overall_score = 0,
    ats_score = 0,
    skill_match_percentage,
    summary = '',
    candidate_name = '',
    sections = {},
    strengths = [],
    improvements = [],
    keywords = {},
    top_skills_found = [],
    red_flags = [],
  } = data

  const sectionEntries = Object.entries(sections)
  const visibleSections = showAllSections ? sectionEntries : sectionEntries.slice(0, 4)

  const copyReport = () => {
    const text = [
      `AI Resume Analysis Report`,
      candidate_name ? `Candidate: ${candidate_name}` : '',
      `Overall Score: ${overall_score}/100`,
      `ATS Score: ${ats_score}/100`,
      skill_match_percentage != null ? `Skill Match: ${skill_match_percentage}%` : '',
      ``,
      `Summary:`,
      summary,
      ``,
      `Strengths:`,
      ...strengths.map((s) => `• ${s}`),
      ``,
      `Improvements:`,
      ...improvements.map((s) => `• ${s}`),
    ]
      .filter(Boolean)
      .join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="py-10 animate-fade-in">
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">
          {candidate_name ? `${candidate_name}'s` : 'Your'} Resume Analysis
        </h2>
        <p className="text-slate-400 mt-1">{summary}</p>
      </div>

      {/* Score cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Overall score */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center col-span-1">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-4">
            Overall Score
          </p>
          <div className="relative flex items-center justify-center">
            <ScoreRing score={overall_score} size={130} strokeWidth={12} />
          </div>
          <p className="text-slate-400 text-sm mt-3">
            <ScoreLabel score={overall_score} />
          </p>
        </div>

        {/* ATS score */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-4">
            ATS Compatibility
          </p>
          <div className="relative flex items-center justify-center">
            <ScoreRing score={ats_score} size={130} strokeWidth={12} color="#a855f7" />
          </div>
          <p className="text-slate-400 text-sm mt-3">
            <ScoreLabel score={ats_score} />
          </p>
        </div>

        {/* Skill match */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-4">
            Skill Match
          </p>
          {skill_match_percentage != null ? (
            <>
              <div className="relative flex items-center justify-center">
                <ScoreRing score={skill_match_percentage} size={130} strokeWidth={12} color="#06b6d4" />
              </div>
              <p className="text-slate-400 text-sm mt-3">
                <ScoreLabel score={skill_match_percentage} />
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <span className="text-4xl mb-3">📋</span>
              <p className="text-slate-500 text-sm">Add a job description to enable skill matching</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — section scores + keywords */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section breakdown */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Layout size={18} className="text-indigo-400" />
              Section Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visibleSections.map(([key, val]) => (
                <AnalysisCard
                  key={key}
                  title={SECTION_LABELS[key] || key}
                  score={val.score}
                  feedback={val.feedback}
                  status={val.status}
                  icon={SECTION_ICONS[key]}
                />
              ))}
            </div>
            {sectionEntries.length > 4 && (
              <button
                onClick={() => setShowAllSections((s) => !s)}
                className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                {showAllSections ? (
                  <>Show less <ChevronUp size={14} /></>
                ) : (
                  <>Show all sections <ChevronDown size={14} /></>
                )}
              </button>
            )}
          </div>

          {/* Keywords */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Code size={18} className="text-indigo-400" />
              Keywords
            </h3>
            <KeywordBadges
              matched={keywords.matched || []}
              missing={keywords.missing || []}
            />
          </div>
        </div>

        {/* Right column — strengths, improvements, skills, red flags */}
        <div className="space-y-4">
          {/* Strengths */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
              <Star size={15} className="text-yellow-400" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-xs">
                  <span className="text-green-400 mt-0.5">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
              <TrendingUp size={15} className="text-blue-400" />
              Improvements
            </h3>
            <ul className="space-y-2">
              {improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-xs">
                  <span className="text-indigo-400 mt-0.5">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Top skills */}
          {top_skills_found.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                <Code size={15} className="text-purple-400" />
                Top Skills Found
              </h3>
              <div className="flex flex-wrap gap-2">
                {top_skills_found.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Red flags */}
          {red_flags.length > 0 && (
            <div className="glass rounded-2xl p-5 border border-red-500/20">
              <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2 text-sm">
                <AlertTriangle size={15} />
                Red Flags
              </h3>
              <ul className="space-y-2">
                {red_flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-400 text-xs">
                    <span className="text-red-400 mt-0.5">⚠</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={copyReport}
              className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-xl glass hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <ClipboardCopy size={14} />}
              {copied ? 'Copied!' : 'Copy Report'}
            </button>
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white transition-all"
            >
              <RefreshCw size={14} />
              New Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
