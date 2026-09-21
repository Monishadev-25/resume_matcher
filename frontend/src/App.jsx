import { useState } from 'react'
import MatchForm from './components/MatchForm.jsx'
import ResultCard from './components/ResultCard.jsx'
import History from './components/History.jsx'

const API_BASE = 'http://localhost:8000'

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [historyKey, setHistoryKey] = useState(0)

  async function handleSubmit(resumeText, jobDescription) {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/api/match/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
      })
      if (!res.ok) throw new Error('The reviewer could not finish. Try again.')
      const data = await res.json()
      setResult(data)
      setHistoryKey((k) => k + 1) // triggers History to refetch
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSelectHistory(id) {
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/match/${id}`)
      if (!res.ok) throw new Error('Could not open that past review.')
      const data = await res.json()
      setResult(data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <header className="masthead">
        <p className="kicker">resume matcher</p>
        <h1>Redline Review</h1>
        <p className="subhead">
          Paste a resume and a job description. Get it back marked up like an editor took a pen to it —
          what's already there, what's missing, and what to add.
        </p>
      </header>

      <main className="desk">
        <MatchForm onSubmit={handleSubmit} loading={loading} />

        <div className="right-col">
          {error && <p className="error-note">{error}</p>}
          {result ? (
            <ResultCard result={result} />
          ) : (
            <div className="sheet placeholder">
              <div className="sheet-head">
                <span className="sheet-label">02 — Redline</span>
                <h2>Waiting on a draft</h2>
              </div>
              <p className="empty-note">Submit the form and your markup will appear here.</p>
            </div>
          )}

          <History apiBase={API_BASE} refreshKey={historyKey} onSelect={handleSelectHistory} />
        </div>
      </main>
    </div>
  )
}
