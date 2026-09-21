import { useEffect, useState } from 'react'

export default function History({ apiBase, refreshKey, onSelect }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`${apiBase}/api/match/history?limit=10`)
      .then((res) => {
        if (!res.ok) throw new Error('Could not load past reviews.')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setItems(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [apiBase, refreshKey])

  return (
    <div className="sheet history">
      <div className="sheet-head">
        <span className="sheet-label">03 — Filed</span>
        <h2>Past reviews</h2>
      </div>

      {loading && <p className="empty-note">Loading past reviews…</p>}
      {error && <p className="error-note">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="empty-note">Nothing filed yet — your first review will show up here.</p>
      )}

      <ul className="history-list">
        {items.map((item) => (
          <li key={item.id}>
            <button className="history-row" onClick={() => onSelect(item.id)}>
              <span className="history-score" data-tier={
                item.score >= 80 ? 'high' : item.score >= 55 ? 'mid' : 'low'
              }>
                {item.score}
              </span>
              <span className="history-preview">{item.job_description_preview}</span>
              <span className="history-date">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
