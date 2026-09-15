"""
SmartStudy AI — backend (100% free, runs on your own machine)

Uses Llama 3 through Ollama instead of a paid API — no API key, no cost,
no usage limits, everything runs locally.

Setup (see backend/README.md for full steps):
  1. Install Ollama: https://ollama.com
  2. ollama pull llama3
  3. ollama serve            (usually auto-starts after install)
  4. pip install -r requirements.txt
  5. uvicorn main:app --reload --port 8000
"""

import os
import re
import io
import json
import uuid

import requests
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pdfplumber
import docx

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
MODEL = os.environ.get("OLLAMA_MODEL", "llama3")  # try "llama3:8b" or "llama3.1" too

app = FastAPI(title="SmartStudy AI Backend (Llama 3 / Ollama)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store: { doc_id: { "name": str, "text": str } }
DOCS: dict[str, dict] = {}

MAX_CHARS = 12000  # local models have much smaller comfortable context than hosted Claude —
                    # keep prompts lean so generation stays fast and accurate


# --------------------------------------------------------------------------
# Text extraction
# --------------------------------------------------------------------------

def extract_text(filename: str, raw: bytes) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        text = []
        with pdfplumber.open(io.BytesIO(raw)) as pdf:
            for page in pdf.pages:
                text.append(page.extract_text() or "")
        return "\n".join(text)
    elif lower.endswith(".docx"):
        d = docx.Document(io.BytesIO(raw))
        return "\n".join(p.text for p in d.paragraphs)
    elif lower.endswith(".txt"):
        return raw.decode("utf-8", errors="ignore")
    else:
        raise HTTPException(400, f"Unsupported file type: {filename}. Use PDF, DOCX, or TXT.")


def clean(text: str) -> str:
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text[:MAX_CHARS]


# --------------------------------------------------------------------------
# Ollama / Llama 3 helpers
# --------------------------------------------------------------------------

def ollama_chat(system: str, user: str, json_mode: bool = True) -> str:
    """Calls a local Ollama server running Llama 3."""
    try:
        resp = requests.post(
            f"{OLLAMA_HOST}/api/chat",
            json={
                "model": MODEL,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                "stream": False,
                **({"format": "json"} if json_mode else {}),
                "options": {"temperature": 0.4},
            },
            timeout=180,
        )
        resp.raise_for_status()
    except requests.exceptions.ConnectionError:
        raise HTTPException(
            503,
            "Can't reach Ollama at " + OLLAMA_HOST + ". Is it running? "
            "Start it with `ollama serve`, and make sure you've run `ollama pull llama3`.",
        )
    except requests.exceptions.Timeout:
        raise HTTPException(504, "Llama 3 took too long to respond. Try a shorter document or a smaller model (e.g. llama3:8b).")

    return resp.json()["message"]["content"]


def ask_llama_json(system: str, user: str) -> dict:
    raw = ollama_chat(system, user, json_mode=True)
    raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Llama 3 occasionally wraps JSON in extra text even in json mode — try to salvage it.
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
        raise HTTPException(502, f"Model didn't return valid JSON. Raw output: {raw[:400]}")


def get_doc(doc_id: str) -> dict:
    doc = DOCS.get(doc_id)
    if not doc:
        raise HTTPException(404, "Unknown doc_id — upload the document again.")
    return doc


# --------------------------------------------------------------------------
# Routes
# --------------------------------------------------------------------------

@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    raw = await file.read()
    text = clean(extract_text(file.filename, raw))
    if not text:
        raise HTTPException(400, "Couldn't extract any text from that file (is it a scanned image PDF?).")

    doc_id = str(uuid.uuid4())
    DOCS[doc_id] = {"name": file.filename, "text": text}
    return {"doc_id": doc_id, "name": file.filename, "chars": len(text), "preview": text[:400]}


@app.get("/api/documents")
def list_documents():
    return [{"doc_id": k, "name": v["name"], "chars": len(v["text"])} for k, v in DOCS.items()]


class SummaryRequest(BaseModel):
    doc_id: str


@app.post("/api/generate/summary")
def generate_summary(req: SummaryRequest):
    doc = get_doc(req.doc_id)
    data = ask_llama_json(
        system="You are the Notes Agent for a study app. Reply with ONLY a JSON object — no prose, no markdown fences, nothing before or after it.",
        user=f"""Summarize the study material below.

Return exactly this JSON shape:
{{
  "title": "short title for the document",
  "summary": "4-6 sentence plain-language summary",
  "key_concepts": ["term 1", "term 2", "up to 8 terms"],
  "bullet_points": ["bullet 1", "bullet 2", "5-8 bullets covering the main ideas"]
}}

MATERIAL:
{doc['text']}""",
    )
    return data


class QuizRequest(BaseModel):
    doc_id: str
    difficulty: str = "Medium"
    count: int = 6
    types: list[str] = ["mcq", "fill_blank"]


@app.post("/api/generate/quiz")
def generate_quiz(req: QuizRequest):
    doc = get_doc(req.doc_id)
    data = ask_llama_json(
        system="You are the Quiz Agent for a study app. Reply with ONLY a JSON object — no prose, no markdown fences, nothing before or after it.",
        user=f"""Create a {req.difficulty} difficulty quiz with exactly {req.count} questions from the material below.
Only use these question types: {', '.join(req.types)}.

Return exactly this JSON shape:
{{
  "questions": [
    {{
      "type": "mcq",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0,
      "explanation": "one sentence why this is correct"
    }},
    {{
      "type": "fill_blank",
      "question": "sentence with ______ blank",
      "answer": "the missing word or phrase",
      "explanation": "one sentence why"
    }}
  ]
}}

MATERIAL:
{doc['text']}""",
    )
    if not data.get("questions"):
        raise HTTPException(502, "Model returned no questions — try again or use a shorter document.")
    return data


class FlashcardRequest(BaseModel):
    doc_id: str
    count: int = 10


@app.post("/api/generate/flashcards")
def generate_flashcards(req: FlashcardRequest):
    doc = get_doc(req.doc_id)
    data = ask_llama_json(
        system="You are the Flashcard Agent for a study app. Reply with ONLY a JSON object — no prose, no markdown fences, nothing before or after it.",
        user=f"""Create exactly {req.count} flashcards (term/definition or question/answer) from the material below.
Keep each "back" to 1-3 sentences.

Return exactly this JSON shape:
{{
  "cards": [
    {{"front": "term or question", "back": "definition or answer"}}
  ]
}}

MATERIAL:
{doc['text']}""",
    )
    if not data.get("cards"):
        raise HTTPException(502, "Model returned no flashcards — try again or use a shorter document.")
    return data


class RoadmapRequest(BaseModel):
    doc_id: str
    days: int = 7


@app.post("/api/generate/roadmap")
def generate_roadmap(req: RoadmapRequest):
    doc = get_doc(req.doc_id)
    data = ask_llama_json(
        system="You are the Roadmap Agent for a study app. Reply with ONLY a JSON object — no prose, no markdown fences, nothing before or after it.",
        user=f"""Build a {req.days}-day study plan for the material below, sequencing topics from
foundational to advanced, with one focus task per day.

Return exactly this JSON shape:
{{
  "days": [
    {{"day": 1, "focus": "topic", "task": "what to do that day"}}
  ]
}}

MATERIAL:
{doc['text']}""",
    )
    return data


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    doc_id: str
    message: str
    history: list[ChatMessage] = []


@app.post("/api/chat")
def chat(req: ChatRequest):
    doc = get_doc(req.doc_id)
    system = (
        "You are the Tutor Agent inside a study app. Answer the student's question using ONLY "
        "the document text provided below. If the answer isn't in the document, say so honestly "
        "instead of making it up. Keep answers concise and student-friendly.\n\n"
        f"DOCUMENT ({doc['name']}):\n{doc['text']}"
    )

    # Fold prior turns into the prompt (kept short — local models are slower with long context).
    convo = ""
    for m in req.history[-6:]:
        convo += f"\n{m.role.upper()}: {m.content}"
    user_prompt = f"{convo}\n\nSTUDENT QUESTION: {req.message}" if convo else req.message

    reply = ollama_chat(system, user_prompt, json_mode=False)
    return {"reply": reply}


@app.get("/api/health")
def health():
    ollama_ok = True
    try:
        requests.get(f"{OLLAMA_HOST}/api/tags", timeout=3)
    except requests.exceptions.RequestException:
        ollama_ok = False
    return {"status": "ok", "documents_loaded": len(DOCS), "ollama_reachable": ollama_ok, "model": MODEL}
