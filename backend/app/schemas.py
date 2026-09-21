from datetime import datetime
from pydantic import BaseModel, Field


class MatchRequest(BaseModel):
    resume_text: str = Field(..., min_length=20, description="Full resume text")
    job_description: str = Field(..., min_length=20, description="Full job description text")


class MatchResult(BaseModel):
    score: int
    matched_skills: list[str]
    missing_skills: list[str]
    suggestions: list[str]


class MatchRecordOut(MatchResult):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MatchHistoryItem(BaseModel):
    """Lighter payload for the history list — no full resume/JD text."""
    id: int
    score: int
    created_at: datetime
    job_description_preview: str
