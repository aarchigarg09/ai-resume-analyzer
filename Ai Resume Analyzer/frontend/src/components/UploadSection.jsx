import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Briefcase, Sparkles, AlertCircle, X } from 'lucide-react'

export default function UploadSection({ onAnalyze, error }) {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setIsLoading(true)
    await onAnalyze(file, jobDescription)
    setIsLoading(false)
  }

  const removeFile = (e) => {
    e.stopPropagation()
    setFile(null)
  }

  return (
    <div className="py-16 animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm px-4 py-1.5 rounded-full mb-6">
          <Sparkles size={14} />
          Powered by Google Gemini AI
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
          Analyze Your Resume{' '}
          <span className="text-gradient">Instantly</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Upload your resume and get a detailed AI-powered analysis — score, ATS compatibility,
          skill gaps, and actionable improvements in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200
            ${isDragActive
              ? 'border-indigo-500 bg-indigo-500/10'
              : file
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-white/20 hover:border-indigo-500/50 hover:bg-white/5'
            }`}
        >
          <input {...getInputProps()} />

          {file ? (
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <FileText size={24} className="text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-slate-500 text-sm">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="ml-auto p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <Upload size={28} className={isDragActive ? 'text-indigo-400' : 'text-slate-400'} />
              </div>
              <p className="text-white font-medium mb-1">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
              </p>
              <p className="text-slate-500 text-sm mb-4">
                or <span className="text-indigo-400 font-medium">click to browse</span>
              </p>
              <p className="text-slate-600 text-xs">Supports PDF and DOCX · Max 10MB</p>
            </>
          )}
        </div>

        {/* Job description */}
        <div className="glass rounded-2xl p-6">
          <label className="flex items-center gap-2 text-slate-300 font-medium mb-3">
            <Briefcase size={16} className="text-indigo-400" />
            Job Description
            <span className="ml-1 text-slate-600 text-xs font-normal">(optional — improves skill matching)</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to get keyword match analysis and tailored feedback..."
            rows={5}
            className="w-full bg-transparent text-slate-300 placeholder-slate-600 text-sm resize-none outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!file || isLoading}
          className="w-full py-4 rounded-2xl font-semibold text-white text-lg
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-500 hover:to-purple-500
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200 flex items-center justify-center gap-3
            shadow-lg shadow-indigo-500/20"
        >
          <Sparkles size={20} />
          {isLoading ? 'Analyzing...' : 'Analyze My Resume'}
        </button>
      </form>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3 mt-10">
        {[
          '📊 Overall Score',
          '🤖 ATS Compatibility',
          '🎯 Skill Gap Analysis',
          '💡 Actionable Tips',
          '🔑 Keyword Match',
          '⚡ Results in Seconds',
        ].map((feat) => (
          <span
            key={feat}
            className="text-sm text-slate-500 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full"
          >
            {feat}
          </span>
        ))}
      </div>
    </div>
  )
}
