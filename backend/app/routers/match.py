from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.match_repository import MatchRepository
from app.schemas import MatchRequest, MatchRecordOut, MatchHistoryItem
from app.services.match_service import MatchService

router = APIRouter(prefix="/api/match", tags=["match"])


def get_match_service(db: Session = Depends(get_db)) -> MatchService:
    return MatchService(repository=MatchRepository(db))


@router.post("/", response_model=MatchRecordOut)
def evaluate_match(payload: MatchRequest, service: MatchService = Depends(get_match_service)):
    try:
        record = service.evaluate_match(payload.resume_text, payload.job_description)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI evaluation failed: {exc}")
    return record


@router.get("/history", response_model=list[MatchHistoryItem])
def get_history(limit: int = 20, service: MatchService = Depends(get_match_service)):
    records = service.list_history(limit=limit)
    return [
        MatchHistoryItem(
            id=r.id,
            score=r.score,
            created_at=r.created_at,
            job_description_preview=(r.job_description[:80] + "…") if len(r.job_description) > 80 else r.job_description,
        )
        for r in records
    ]


@router.get("/{record_id}", response_model=MatchRecordOut)
def get_record(record_id: int, service: MatchService = Depends(get_match_service)):
    record = service.get_record(record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Match record not found")
    return record
