# lyrics_gen.py
import os
import time
from typing import Optional
from dataclasses import dataclass

from dotenv import load_dotenv
from openai import OpenAI, APIError, RateLimitError, InternalServerError

load_dotenv()  # loads OPENAI_API_KEY from .env if present

@dataclass
class EmployeeInfo:
    name: str
    department: str
    role: str
    years: int

PROMPT_TEMPLATE = """You are a songwriter creating parody corporate jingles for a fictional HR training app. 
Each song is an over-the-top, cheerful parody about firing an employee — intended to show how absurd or tone-deaf corporate communication can sound.

Your task:
Write a 30-second song announcing that an employee has been "let go," using the following details:
- Employee name: {employee_name}
- Department: {department}
- Role: {role}
- Years at company: {years_of_work}

Guidelines:
- Keep lyrics between 6–8 lines (≈ 30 seconds when sung)
- Tone: overly optimistic, corporate-jargon-heavy, ironically cheerful
- Style: parody of a motivational company jingle
- Must sound playful and fictional — no cruelty or realism
- Include workplace clichés like "synergy," "restructuring," "growth mindset"
- End with a catchy, ironic corporate tagline (e.g., “We wish you synergy on your way!”)
- Avoid profanity, real company names, or specific insults

Output format:
Return ONLY the song lyrics (no explanations, no preambles).
Optionally suggest a musical style in parentheses at the top.
"""

def build_prompt(emp: EmployeeInfo) -> str:
    return PROMPT_TEMPLATE.format(
        employee_name=emp.name,
        department=emp.department,
        role=emp.role,
        years_of_work=emp.years
    )

def generate_lyrics(
    emp: EmployeeInfo,
    model: str = "gpt-4o-mini",
    temperature: float = 0.8,
    max_retries: int = 3,
    timeout: Optional[float] = None
) -> str:
    """
    Calls Chat Completions and returns lyrics text.
    - model: set to any chat-capable model you prefer.
    - temperature: 0.7–0.9 gives playful variety.
    - timeout: optional per-request timeout in seconds.
    """
    client = OpenAI(timeout=timeout)
    prompt = build_prompt(emp)

    backoff = 1.0
    for attempt in range(1, max_retries + 1):
        try:
            resp = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You write concise, catchy parody corporate songs."},
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
            )
            lyrics = resp.choices[0].message.content.strip()
            return lyrics
        except (RateLimitError, InternalServerError) as e:
            if attempt == max_retries:
                raise
            time.sleep(backoff)
            backoff *= 2
        except APIError:
            raise  # bubble up for non-retryable errors

