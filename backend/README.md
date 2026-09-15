# SmartStudy AI — Backend (100% free, runs on your own machine)

This backend uses **Llama 3 via [Ollama](https://ollama.com)** instead of a
paid API. No API key, no billing, no usage limits — everything, including
the AI, runs locally on your computer.

Trade-off: it needs a decent machine (8GB+ RAM minimum, more is better) and
answers are slower than a hosted API, especially on CPU-only laptops.

## 1. Install Ollama

Download and install from **https://ollama.com** (Windows / Mac / Linux).

Then pull Llama 3:

```bash
ollama pull llama3
```

This downloads ~4.7GB once. Ollama then runs a local server automatically
(usually on `http://localhost:11434`). You can check it's alive with:

```bash
ollama list
```

If your machine is low on RAM/VRAM, use the smaller model instead — it's
noticeably faster and still decent quality:

```bash
ollama pull llama3.2:3b
```

Then set `OLLAMA_MODEL=llama3.2:3b` when running the backend (step 3).

## 2. Install Python dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

No API key / `.env` needed — the backend just talks to Ollama on localhost.

## 3. Run the server

```bash
Terminal 1
cd backend
uvicorn main:app --reload --port 8000


Terminal 2
cd "D:\smart-study AI"
python -m http.server 5500
```

Using a different model name or a remote Ollama host? Set env vars first:

```bash
export OLLAMA_MODEL=llama3.2:3b          # Windows: set OLLAMA_MODEL=llama3.2:3b
export OLLAMA_HOST=http://localhost:11434
```

Check it's wired up correctly: open **http://localhost:8000/api/health** —
`ollama_reachable` should say `true`.

## 4. Serve the frontend

Browsers can block `fetch()` calls from a `file://` page, so serve the
frontend folder too, from a second terminal:

```bash
cd ..                # back to the smartstudy-ai root
python -m http.server 5500
```

Open **http://localhost:5500** (not `file://...`).

## 5. Use it

1. Go to **Upload**, drop in a real PDF/DOCX/TXT.
2. Once it says "Processed by AI ✓", click **Open in chat** and ask it
   real questions — answers come from Llama 3 reading your document.
3. Go to **Quizzes** or **Flashcards** — they'll generate from that same
   document. Generation can take anywhere from a few seconds to a minute or
   two depending on your machine — the button shows a loading state.

If Ollama or the backend isn't running, every page quietly falls back to
the built-in demo data — nothing breaks.

## Notes / known limits

- **Storage is in-memory** — restarting the backend clears uploaded
  documents. Fine for a demo; swap in SQLite for persistence later.
- **No auth** — anyone hitting the API can upload/read. Local-only demo,
  don't expose this port publicly as-is.
- **Prompts are trimmed to ~12,000 characters** (`MAX_CHARS` in `main.py`).
  Local models handle long context much worse than hosted ones, so very
  long PDFs get truncated — only the first ~12k characters are used. For
  full-document coverage on big files you'd want to chunk the text and
  process it in sections, or add real retrieval (embeddings + a vector
  store) instead of stuffing raw text into the prompt.
- **JSON output can occasionally be malformed** — Llama 3 is less reliable
  at strict JSON than hosted frontier models. The backend tries to salvage
  it (`ask_llama_json`); if it still fails, the frontend falls back to demo
  data for that request. Retrying usually works.
- **Scanned/image PDFs** won't extract text — you'd need an OCR step (e.g.
  `pytesseract`) before this pipeline.
- Want better quality and don't mind paying a small amount per use? Swap
  `ollama_chat()` in `main.py` for a hosted API call (Anthropic, OpenAI,
  etc.) — the rest of the app (routes, JSON shapes, frontend) stays the same.


