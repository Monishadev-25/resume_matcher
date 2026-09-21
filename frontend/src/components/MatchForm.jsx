import { useState } from 'react'

export default function MatchForm({ onSubmit, loading }) {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (resumeText.trim().length < 20 || jobDescription.trim().length < 20) return
    onSubmit(resumeText, jobDescription)
  }

  return (
    <form className="sheet" onSubmit={handleSubmit}>
      <div className="sheet-head">
        <span className="sheet-label">01 — Draft</span>
        <h2>Paste what you're working with</h2>
      </div>

      <label className="field">
        <span className="field-label">Your resume</span>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume text here…"
          rows={12}
        />
      </label>

      <label className="field">
        <span className="field-label">Job description</span>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here…"
          rows={8}
        />
      </label>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Marking it up…' : 'Review against this role'}
      </button>
    </form>
  )
}
