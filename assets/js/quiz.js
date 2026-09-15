const DEMO_QUESTIONS = [
  { type: 'mcq', question: 'What is a necessary condition for deadlock to occur?', options: ['Mutual exclusion', 'Preemption', 'Sequential execution', 'Paging'], correct_index: 0 },
  { type: 'mcq', question: 'Which algorithm is used for deadlock avoidance?', options: ['Round Robin', "Banker's Algorithm", 'FCFS', 'Shortest Job First'], correct_index: 1 },
  { type: 'fill_blank', question: 'A ______ graph is used to detect deadlocks by checking for cycles.', answer: 'resource allocation' },
  { type: 'mcq', question: 'Which of these is NOT one of the four Coffman conditions?', options: ['Hold and wait', 'No preemption', 'Circular wait', 'Time sharing'], correct_index: 3 },
  { type: 'mcq', question: 'Breaking which condition is easiest to prevent deadlock in practice?', options: ['Mutual exclusion', 'Hold and wait', 'Circular wait', 'No preemption'], correct_index: 2 },
  { type: 'fill_blank', question: 'Deadlock ______ allows deadlocks to occur, then detects and recovers from them.', answer: 'detection' },
];

const activeDoc = window.getActiveDoc ? window.getActiveDoc() : null;
let QUESTIONS = [];
let current = 0, score = 0, selected = null;
let chosenDifficulty = 'Medium';

const setup = document.getElementById('quizSetup');
const runner = document.getElementById('quizRunner');
const results = document.getElementById('quizResults');
const card = document.getElementById('questionCard');
const nextBtn = document.getElementById('nextBtn');
const skipBtn = document.getElementById('skipBtn');
const startBtn = document.getElementById('startQuizBtn');

if (activeDoc) {
  const p = setup.querySelector('p');
  if (p) p.innerHTML = `Generating from <strong>${activeDoc.name}</strong> using your connected AI backend.`;
}

document.getElementById('difficultyGroup')?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-diff]');
  if (!btn) return;
  document.querySelectorAll('[data-diff]').forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-ghost'); });
  btn.classList.remove('btn-ghost'); btn.classList.add('btn-primary');
  chosenDifficulty = btn.dataset.diff;
  document.getElementById('qDifficulty').textContent = chosenDifficulty;
});

startBtn?.addEventListener('click', async () => {
  startBtn.disabled = true;
  startBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Generating quiz...`;
  lucide.createIcons();

  QUESTIONS = await fetchQuiz();

  setup.classList.add('hidden');
  runner.classList.remove('hidden');
  document.getElementById('qTotal').textContent = QUESTIONS.length;
  current = 0; score = 0;
  renderQuestion();
});

async function fetchQuiz() {
  if (activeDoc) {
    try {
      const res = await fetch(`${window.API_BASE}/api/generate/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc_id: activeDoc.doc_id, difficulty: chosenDifficulty, count: 6, types: ['mcq', 'fill_blank'] }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.questions?.length) return data.questions;
    } catch (err) {
      console.warn('Backend quiz generation failed, using demo bank:', err);
    }
  }
  return DEMO_QUESTIONS;
}

function renderQuestion() {
  selected = null;
  nextBtn.disabled = true;
  const q = QUESTIONS[current];
  document.getElementById('qIndex').textContent = current + 1;
  document.getElementById('qProgress').style.width = ((current + 1) / QUESTIONS.length * 100) + '%';

  card.classList.remove('in-view');
  card.style.opacity = 0;

  let inner = `<div class="pill mb-5">${q.type === 'mcq' ? 'Multiple choice' : 'Fill in the blank'}</div>
    <h2 class="font-display font-semibold text-xl mb-7 leading-snug">${q.question}</h2>`;

  if (q.type === 'mcq') {
    inner += `<div class="space-y-3" id="optionsWrap">`;
    q.options.forEach((opt, i) => {
      inner += `<button class="option-btn w-full text-left p-4 rounded-xl card card-lift flex items-center gap-3" data-idx="${i}">
        <span class="w-7 h-7 rounded-lg border border-white/15 grid place-items-center text-xs shrink-0">${String.fromCharCode(65 + i)}</span>
        <span class="text-sm">${opt}</span>
      </button>`;
    });
    inner += `</div>`;
  } else {
    inner += `<input type="text" id="fibInput" placeholder="Type your answer..." class="w-full card p-4 text-sm outline-none bg-transparent focus:border-primary/50" />`;
  }

  card.innerHTML = inner;
  setTimeout(() => { card.style.opacity = 1; card.classList.add('in-view'); }, 30);
  lucide.createIcons();

  if (q.type === 'mcq') {
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (selected !== null) return;
        selected = parseInt(btn.dataset.idx);
        document.querySelectorAll('.option-btn').forEach(b => {
          const idx = parseInt(b.dataset.idx);
          if (idx === q.correct_index) b.classList.add('!border-success', '!bg-success/10');
          else if (idx === selected) b.classList.add('!border-danger', '!bg-danger/10');
        });
        if (selected === q.correct_index) score++;
        nextBtn.disabled = false;
      });
    });
  } else {
    const fibInput = document.getElementById('fibInput');
    fibInput.addEventListener('input', () => {
      selected = fibInput.value.trim().toLowerCase();
      nextBtn.disabled = selected.length === 0;
    });
  }
}

function goNext() {
  const q = QUESTIONS[current];
  if (q.type === 'fill_blank' && selected) {
    if (selected === String(q.answer).toLowerCase()) score++;
  }
  current++;
  if (current >= QUESTIONS.length) showResults();
  else renderQuestion();
}

nextBtn?.addEventListener('click', goNext);
skipBtn?.addEventListener('click', () => { current++; current >= QUESTIONS.length ? showResults() : renderQuestion(); });

function showResults() {
  runner.classList.add('hidden');
  results.classList.remove('hidden');
  const pct = Math.round((score / QUESTIONS.length) * 100);
  document.getElementById('scoreText').textContent = `${score}/${QUESTIONS.length}`;
  let val = 0;
  const el = document.getElementById('scoreCircle');
  const iv = setInterval(() => {
    val += 4;
    if (val >= pct) { val = pct; clearInterval(iv); }
    el.textContent = val + '%';
  }, 30);
}
