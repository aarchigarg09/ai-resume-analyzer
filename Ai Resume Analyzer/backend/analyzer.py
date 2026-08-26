"""
analyzer.py — Core AI analysis logic using the Google Gemini API.
Constructs a detailed prompt, calls the model, and parses the JSON response.
"""
import json
import re
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

ANALYSIS_PROMPT = """
You are an expert resume analyst and career coach. Analyze the provided resume and return a detailed, structured JSON response.

RESUME TEXT:
{resume_text}

JOB DESCRIPTION (if provided):
{job_description}

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{{
  "overall_score": <integer 0-100>,
  "ats_score": <integer 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "candidate_name": "<extracted name or 'Not found'>",
  "sections": {{
    "contact_info": {{
      "score": <integer 0-100>,
      "feedback": "<feedback string>",
      "status": "<'good' | 'needs_work' | 'missing'>"
    }},
    "summary_objective": {{
      "score": <integer 0-100>,
      "feedback": "<feedback string>",
      "status": "<'good' | 'needs_work' | 'missing'>"
    }},
    "experience": {{
      "score": <integer 0-100>,
      "feedback": "<feedback string>",
      "status": "<'good' | 'needs_work' | 'missing'>"
    }},
    "skills": {{
      "score": <integer 0-100>,
      "feedback": "<feedback string>",
      "status": "<'good' | 'needs_work' | 'missing'>"
    }},
    "education": {{
      "score": <integer 0-100>,
      "feedback": "<feedback string>",
      "status": "<'good' | 'needs_work' | 'missing'>"
    }},
    "formatting": {{
      "score": <integer 0-100>,
      "feedback": "<feedback string>",
      "status": "<'good' | 'needs_work' | 'missing'>"
    }}
  }},
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "improvements": [
    "<improvement suggestion 1>",
    "<improvement suggestion 2>",
    "<improvement suggestion 3>",
    "<improvement suggestion 4>"
  ],
  "keywords": {{
    "matched": ["<keyword1>", "<keyword2>"],
    "missing": ["<keyword1>", "<keyword2>"]
  }},
  "skill_match_percentage": <integer 0-100 — set to null if no JD provided>,
  "top_skills_found": ["<skill1>", "<skill2>", "<skill3>", "<skill4>", "<skill5>"],
  "red_flags": ["<red flag 1 if any, else empty list>"]
}}

Guidelines:
- Be honest and constructive.
- If no job description is provided, set skill_match_percentage to null and keywords.missing to [].
- ATS score should reflect how well the resume would parse in an applicant tracking system (formatting, keywords, standard section names).
- Scores should be realistic — a perfect 100 is rare.
- Keep feedback concise but specific (1-2 sentences per section).
"""


def analyze_resume(resume_text: str, job_description: str = "") -> dict:
    """
    Send resume text (and optional JD) to Gemini and return structured analysis.
    """
    prompt = ANALYSIS_PROMPT.format(
        resume_text=resume_text,
        job_description=job_description if job_description.strip() else "Not provided.",
    )

    response = model.generate_content(prompt)
    raw = response.text.strip()

    # Strip potential markdown code fences
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        result = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON: {e}\n\nRaw response:\n{raw}")

    return result
