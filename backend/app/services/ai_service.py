"""
Provider-agnostic AI service layer.
Swap out GroqProvider for OpenAIProvider / AnthropicProvider etc.
without touching any calling code — only this file changes.
"""
import json
import re
from abc import ABC, abstractmethod

from groq import Groq

from app.config import settings

SYSTEM_PROMPT = """You are an ATS (Applicant Tracking System) and technical recruiter assistant.
Compare the given RESUME against the given JOB DESCRIPTION and respond with ONLY a valid JSON object,
no markdown, no preamble, no code fences. The JSON must have exactly this shape:

{
  "score": <integer 0-100, overall match percentage>,
  "matched_skills": [<list of skills/keywords found in both resume and JD>],
  "missing_skills": [<list of important skills/keywords in the JD but missing from the resume>],
  "suggestions": [<2-4 short, specific, actionable lines the candidate could add or edit in their resume>]
}

Be honest and specific. Only include skills that are explicitly evidenced. Keep suggestions concise (under 20 words each)."""


class AIProvider(ABC):
    @abstractmethod
    def generate_json(self, prompt: str) -> dict:
        ...


class GroqProvider(AIProvider):
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)
        self.model = settings.groq_model

    def generate_json(self, prompt: str) -> dict:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=1024,
        )
        raw = response.choices[0].message.content.strip()
        return self._safe_parse(raw)

    @staticmethod
    def _safe_parse(raw: str) -> dict:
        cleaned = re.sub(r"^```(json)?|```$", "", raw.strip(), flags=re.MULTILINE).strip()
        return json.loads(cleaned)


class AIService:
    """Facade the rest of the app talks to. Swap self.provider to change LLM vendor."""

    def __init__(self, provider: AIProvider | None = None):
        self.provider = provider or GroqProvider()

    def match_resume_to_job(self, resume_text: str, job_description: str) -> dict:
        prompt = f"RESUME:\n{resume_text}\n\nJOB DESCRIPTION:\n{job_description}"
        return self.provider.generate_json(prompt)
