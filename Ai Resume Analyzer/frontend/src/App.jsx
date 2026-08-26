import { useState } from 'react'
import UploadSection from './components/UploadSection'
import LoadingScreen from './components/LoadingScreen'
import ResultsPage from './components/ResultsPage'
import axios from 'axios'

// App states
const STATES = {
  UPLOAD: 'upload',
  LOADING: 'loading',
  RESULTS: 'results',
}

export default function App() {
  const [appState, setAppState] = useState(STATES.UPLOAD)
  const [analysisData, setAnalysisData] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async (file, jobDescription) => {
    setError(null)
    setAppState(STATES.LOADING)

    const formData = new FormData()
    formData.append('resume', file)
    formData.append('job_description', jobDescription)

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000, // 2-minute timeout for large models
      })
      setAnalysisData(response.data)
      setAppState(STATES.RESULTS)
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'An unexpected error occurred. Please try again.'
      setError(msg)
      setAppState(STATES.UPLOAD)
    }
  }

  const handleReset = () => {
    setAnalysisData(null)
    setError(null)
    setAppState(STATES.UPLOAD)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <span className="font-semibold text-white text-lg tracking-tight">
              Resume<span className="text-gradient">Analyzer</span>
            </span>
          </div>
          {appState === STATES.RESULTS && (
            <button
              onClick={handleReset}
              className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
            >
              ← Analyze Another
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {appState === STATES.UPLOAD && (
          <UploadSection onAnalyze={handleAnalyze} error={error} />
        )}
        {appState === STATES.LOADING && <LoadingScreen />}
        {appState === STATES.RESULTS && analysisData && (
          <ResultsPage data={analysisData} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}
