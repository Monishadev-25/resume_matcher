from app.repositories.match_repository import MatchRepository
from app.services.ai_service import AIService


class MatchService:
    """Business logic layer. Orchestrates AIService + MatchRepository."""

    def __init__(self, repository: MatchRepository, ai_service: AIService | None = None):
        self.repository = repository
        self.ai_service = ai_service or AIService()

    def evaluate_match(self, resume_text: str, job_description: str):
        result = self.ai_service.match_resume_to_job(resume_text, job_description)
        result["score"] = max(0, min(100, int(result.get("score", 0))))
        return self.repository.create(resume_text, job_description, result)

    def list_history(self, limit: int = 20):
        return self.repository.get_all(limit=limit)

    def get_record(self, record_id: int):
        return self.repository.get_by_id(record_id)
