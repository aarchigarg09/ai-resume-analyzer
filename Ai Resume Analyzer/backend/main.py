"""
main.py — FastAPI entry point for the AI Resume Analyzer backend.
"""
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from parser import extract_resume_text
from analyzer import analyze_resume

app = FastAPI(title="AI Resume Analyzer API", version="1.0.0")

# Allow requests from the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    """Simple health-check endpoint."""
    return {"status": "ok"}


@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(..., description="PDF or DOCX resume file"),
    job_description: str = Form("", description="Optional job description text"),
):
    """
    Accepts a resume file upload and an optional job description.
    Returns a structured AI analysis of the resume.
    """
    # Validate content type
    allowed_types = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
    if resume.content_type not in allowed_types and not (
        resume.filename.endswith(".pdf") or resume.filename.endswith(".docx")
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a PDF or DOCX file.",
        )

    # Read file bytes
    file_bytes = await resume.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    # Extract text
    try:
        resume_text = extract_resume_text(resume.filename, file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to parse resume: {str(e)}"
        )

    if not resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the resume. Make sure the file is not image-only or password-protected.",
        )

    # Run AI analysis
    try:
        analysis = analyze_resume(resume_text, job_description)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"AI analysis failed: {str(e)}"
        )

    return analysis
