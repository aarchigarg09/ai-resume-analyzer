# AI Resume Analyzer

An AI-powered resume analyzer that gives you an overall score, ATS compatibility rating, section-by-section feedback, skill gap analysis, and actionable improvement suggestions — all powered by **Google Gemini**.

---

## Features

- 📤 **Drag & Drop Upload** — PDF and DOCX support
- 📊 **Resume Score** — Overall quality score out of 100
- 🤖 **ATS Score** — How well your resume parses in applicant tracking systems
- 🎯 **Skill Match** — Match percentage against a job description (optional)
- 📋 **Section Breakdown** — Scores and feedback for Contact, Summary, Experience, Skills, Education, Formatting
- 💡 **AI Suggestions** — Strengths, improvements, and red flags
- 🔑 **Keyword Analysis** — Matched and missing keywords from the job description

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3.11+ |
| AI | Google Gemini 1.5 Flash |
| File Parsing | pdfplumber (PDF), python-docx (DOCX) |

---

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey) (free)

---

### 1. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and paste your Gemini API key

# Start the backend server
uvicorn main:app --reload --port 8000
```

The API will be running at `http://localhost:8000`.
You can view the auto-generated docs at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at `http://localhost:5173`.

---

## Usage

1. Open `http://localhost:5173` in your browser.
2. Drag and drop (or click to select) your **PDF or DOCX** resume.
3. Optionally paste a **job description** to enable keyword and skill matching.
4. Click **Analyze My Resume**.
5. Review your detailed analysis report.

---

## Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── main.py          # FastAPI app and /analyze endpoint
│   ├── analyzer.py      # Gemini AI prompt and response parsing
│   ├── parser.py        # PDF/DOCX text extraction
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── UploadSection.jsx
│   │       ├── LoadingScreen.jsx
│   │       ├── ResultsPage.jsx
│   │       ├── ScoreRing.jsx
│   │       ├── AnalysisCard.jsx
│   │       └── KeywordBadges.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key (required) |
