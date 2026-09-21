export default function ResultCard({ result }) {
  if (!result) return null
  const { score, matched_skills, missing_skills, suggestions } = result

  const verdict =
    score >= 80 ? 'Strong fit' : score >= 55 ? 'Worth tailoring' : 'Needs work'

  return (
    <div className="sheet reviewed">
      <div className="sheet-head">
        <span className="sheet-label">02 — Redline</span>
        <h2>Editor's markup</h2>
      </div>

      <div className="score-row">
        <div className="score-circle" style={{ '--pct': score }}>
          <span>{score}</span>
        </div>
        <div className="score-meta">
          <p className="verdict">{verdict}</p>
          <p className="verdict-sub">match against this job description</p>
        </div>
      </div>

      <div className="margin-block">
        <span className="margin-tag matched-tag">underlined — already there</span>
        <div className="tag-row">
          {matched_skills?.length ? (
            matched_skills.map((s, i) => (
              <span key={i} className="tag tag-matched">{s}</span>
            ))
          ) : (
            <span className="empty-note">Nothing confidently matched yet.</span>
          )}
        </div>
      </div>

      <div className="margin-block">
        <span className="margin-tag missing-tag">circled — missing</span>
        <div className="tag-row">
          {missing_skills?.length ? (
            missing_skills.map((s, i) => (
              <span key={i} className="tag tag-missing">{s}</span>
            ))
          ) : (
            <span className="empty-note">No obvious gaps found.</span>
          )}
        </div>
      </div>

      <div className="margin-block notes">
        <span className="margin-tag notes-tag">margin notes</span>
        <ul className="notes-list">
          {suggestions?.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
