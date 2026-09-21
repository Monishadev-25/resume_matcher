from sqlalchemy.orm import Session

from app.models import MatchRecord


class MatchRepository:
    """Data-access layer. All raw DB queries for MatchRecord live here."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, resume_text: str, job_description: str, result: dict) -> MatchRecord:
        record = MatchRecord(
            resume_text=resume_text,
            job_description=job_description,
            score=result["score"],
            matched_skills=result["matched_skills"],
            missing_skills=result["missing_skills"],
            suggestions=result["suggestions"],
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_all(self, limit: int = 20) -> list[MatchRecord]:
        return (
            self.db.query(MatchRecord)
            .order_by(MatchRecord.created_at.desc())
            .limit(limit)
            .all()
        )

    def get_by_id(self, record_id: int) -> MatchRecord | None:
        return self.db.query(MatchRecord).filter(MatchRecord.id == record_id).first()
