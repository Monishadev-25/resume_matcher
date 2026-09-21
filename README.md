# Resume Matcher — Redline Review

A mini full-stack AI project: paste a resume + job description, get back
an LLM-generated match score, matched/missing skills, and resume suggestions —
styled like an editor's redline markup. Includes a history panel of past reviews.

## Stack
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, Service-Repository pattern
- **AI:** Groq (free tier) via a provider-agnostic `AIService` — swap providers
  by writing a new `AIProvider` subclass in `app/services/ai_service.py`
- **Frontend:** React (Vite), plain CSS

## Project structure
```
resume-matcher/
├── backend/
│   └── app/
│       ├── main.py               # FastAPI app entrypoint
│       ├── config.py             # env-based settings
│       ├── database.py           # SQLAlchemy engine/session
│       ├── models.py             # MatchRecord ORM model
│       ├── schemas.py            # Pydantic request/response models
│       ├── services/
│       │   ├── ai_service.py     # provider-agnostic LLM layer (Groq)
│       │   └── match_service.py  # business logic
│       ├── repositories/
│       │   └── match_repository.py  # DB access layer
│       └── routers/
│           └── match.py          # /api/match endpoints
└── frontend/
    └── src/
        ├── App.jsx
        └── components/
            ├── MatchForm.jsx
            ├── ResultCard.jsx
            └── History.jsx       # past reviews panel
```

## Setup

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edit .env: set DATABASE_URL (a Postgres DB you've created) and GROQ_API_KEY
# get a free Groq key at https://console.groq.com

uvicorn app.main:app --reload --port 8000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Visit http://localhost:5173

## API

`POST /api/match/`
```json
{ "resume_text": "...", "job_description": "..." }
```
Returns: `{ id, score, matched_skills, missing_skills, suggestions, created_at }`

`GET /api/match/history?limit=20` — lightweight list of past reviews
(`id`, `score`, `created_at`, `job_description_preview`) — powers the "Past reviews" panel.

`GET /api/match/{id}` — full record for one past review, used when a history
row is clicked to reload it into the result view.

## Notes / talking points for interviews
- **Service-Repository pattern**: `MatchRepository` only knows SQLAlchemy; `MatchService`
  only knows business rules; the router only knows HTTP. Same pattern as your HRMS project.
- **Provider-agnostic AIService**: `AIService` depends on an abstract `AIProvider`, so the
  Groq implementation is swappable without touching callers — same idea as your Minute Ledger AI layer.
- **Structured LLM output**: the system prompt forces strict JSON so the frontend can render
  it directly, with a safe-parse fallback that strips stray code fences.
- **History list uses a slimmer schema** (`MatchHistoryItem`) than the full record —
  avoids shipping the entire resume/JD text over the wire just to render a list.
