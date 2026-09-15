# SmartStudy AI — Multi-Agent Intelligent Learning Assistant

A premium, dark-mode AI SaaS UI concept: a landing page plus a working front-end
demo of the product (dashboard, upload, document chat, quiz, flashcards,
analytics, profile).

## Two ways to run it

**A) Demo mode — just the frontend, fake data.**
No build step, no npm install:
1. Unzip the folder.
2. Double-click `index.html` (or right-click → Open with your browser).
3. Navigate using the top nav / sidebar to explore every page.

You do need an internet connection the first time you open it, because the
page loads Tailwind CSS, Google Fonts, Lucide icons, and Chart.js from public
CDNs rather than bundling them locally.

**B) Real AI mode — upload a real PDF, get real Llama-3-generated quiz/flashcards/chat, 100% free.**
See `backend/README.md`. Short version: install [Ollama](https://ollama.com),
`ollama pull llama3`, run the FastAPI backend (no API key needed), serve
this frontend folder with a local static server instead of opening the
file directly, then upload a document on the Upload page. If the backend
isn't running, every page automatically falls back to the demo data below
— nothing breaks.

## What's inside

```
smartstudy-ai/
├── index.html         Landing page (hero, features, agents, pricing, FAQ...)
├── dashboard.html      Main app dashboard with widgets + charts
├── upload.html         Drag-and-drop upload flow with simulated progress
├── chat.html            Document chat (ChatGPT-style 3-column layout)
├── quiz.html            Quiz flow: setup → questions → animated results
├── flashcards.html      Flip-card review deck
├── analytics.html       Charts: line, doughnut, radar, bar, heatmap
├── profile.html          XP, level, streak, badges, certificates
├── assets/
│   ├── css/style.css     Design tokens, glassmorphism, animations
│   ├── css/app.css        Sidebar / topbar / chat layout
│   └── js/                 Page-specific interactivity (vanilla JS)
├── backend/
│   ├── main.py             FastAPI app: upload, quiz/flashcard/summary/
│   │                        roadmap generation, and chat — all via a
│   │                        local, free Llama 3 model (Ollama)
│   ├── requirements.txt
│   └── README.md           Free real-AI-mode setup instructions
└── README.md
```

## Design system

- **Palette:** background `#050816`, surface `#0F172A`, card `#111827`,
  primary `#6366F1`, secondary `#22D3EE`, plus success/warning/danger accents.
- **Type:** Space Grotesk for display/headings, Inter for body text.
- **Style:** glassmorphism cards, soft gradient glows, floating elements,
  scroll-reveal animation, shimmer/skeleton states, and a flip-card component.

## Why this stack, not the full Vite/React/TS build you asked for

This build environment has no network access for installing packages
(`npm install`, Vite, shadcn, etc. can't be fetched or verified here), so a
full TypeScript/Vite/Tailwind-compiled/shadcn project couldn't actually be
built or tested in this sandbox. Instead, this is a **dependency-free,
open-and-run** version of the exact same product: every page, section, and
interaction from the brief is implemented, using Tailwind via CDN, vanilla
JS instead of React, and Chart.js instead of Recharts (Recharts requires a
React build step to run).

If you want the "real" React + TypeScript + Vite + shadcn/Framer Motion
codebase to submit as a proper repo, the fastest path is:

1. On your own machine (with internet + Node installed), run:
   `npm create vite@latest smartstudy-ai -- --template react-ts`
2. Install Tailwind, shadcn/ui, Framer Motion, Recharts, React Router,
   React Hook Form + Zod per their own setup docs.
3. Use this HTML/CSS as the visual + copy reference — port each section
   into components (`Hero.tsx`, `FeatureGrid.tsx`, `AgentCard.tsx`, etc.)
   and swap the vanilla JS interactions for React state + Framer Motion
   variants.

Happy to help build out any specific page as real React/TSX components
right here in chat if that's more useful than the static version.

"""cd "D:\smart-study AI"
.\venv\Scripts\Activate.ps1
python start.py """