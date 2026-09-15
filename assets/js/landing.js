// ==========================================================================
// Landing page — dynamic content
// ==========================================================================

const FEATURES = [
  { icon: 'graduation-cap', color: 'primary', title: 'AI Tutor', desc: 'A patient, on-demand tutor that explains concepts at your level and adjusts when you\'re stuck.' },
  { icon: 'message-circle', color: 'secondary', title: 'Document Chat', desc: 'Ask your PDF a question and get an answer grounded in the exact page it came from.' },
  { icon: 'list-checks', color: 'success', title: 'Quiz Generator', desc: 'MCQs, fill-in-the-blanks, true/false, and coding questions generated from your own material.' },
  { icon: 'layers', color: 'warning', title: 'Flashcards', desc: 'Auto-generated decks with spaced repetition, swipe review, and bookmarking.' },
  { icon: 'git-branch', color: 'primary', title: 'Mind Maps', desc: 'Turn dense chapters into a navigable concept map in seconds.' },
  { icon: 'notebook-pen', color: 'secondary', title: 'AI Notes', desc: 'Clean, structured notes with headings, key terms, and summaries pulled from raw uploads.' },
  { icon: 'mic', color: 'danger', title: 'Interview Coach', desc: 'Mock technical and HR interviews with feedback on clarity, structure, and gaps.' },
  { icon: 'code-2', color: 'success', title: 'Coding Assistant', desc: 'Line-by-line explanations, complexity breakdowns, and debugging help.' },
  { icon: 'search', color: 'warning', title: 'Research Assistant', desc: 'Summarizes papers, extracts citations, and compares sources side by side.' },
  { icon: 'map', color: 'primary', title: 'Roadmap Generator', desc: 'A day-by-day study plan sequenced around your deadline and current level.' },
  { icon: 'bar-chart-3', color: 'secondary', title: 'Learning Analytics', desc: 'Accuracy trends, weak topics, and study-time breakdowns in one view.' },
  { icon: 'audio-lines', color: 'danger', title: 'Voice Assistant', desc: 'Talk through a topic hands-free and get spoken explanations back.' },
];

const AGENTS = [
  { icon: 'graduation-cap', name: 'Tutor Agent', role: 'Explains concepts, adapts to your pace', status: 'Active' },
  { icon: 'list-checks', name: 'Quiz Agent', role: 'Builds practice tests from your material', status: 'Active' },
  { icon: 'layers', name: 'Flashcard Agent', role: 'Extracts key terms into review decks', status: 'Active' },
  { icon: 'search', name: 'Research Agent', role: 'Summarizes papers &amp; finds citations', status: 'Active' },
  { icon: 'mic', name: 'Interview Agent', role: 'Runs mock interviews with feedback', status: 'Idle' },
  { icon: 'code-2', name: 'Coding Agent', role: 'Explains and debugs code samples', status: 'Active' },
  { icon: 'notebook-pen', name: 'Notes Agent', role: 'Structures raw uploads into clean notes', status: 'Active' },
  { icon: 'map', name: 'Roadmap Agent', role: 'Sequences your study plan by deadline', status: 'Active' },
  { icon: 'flame', name: 'Motivation Agent', role: 'Nudges streaks &amp; celebrates milestones', status: 'Idle' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'B.Tech CSE, final year', text: 'I stopped bouncing between five apps before exams. Document chat alone saved me hours on a 200-page reference.', initials: 'PS' },
  { name: 'Rahul Verma', role: 'MCA student', text: 'The roadmap agent rebuilt my whole revision plan after I fell behind — and it actually accounted for the deadline.', initials: 'RV' },
  { name: 'Sneha Iyer', role: 'Placement aspirant', text: 'Interview Coach caught how often I rambled before getting to the point. That feedback alone was worth it.', initials: 'SI' },
  { name: 'Arjun Mehta', role: 'B.Com, exam prep', text: 'Flashcards from my own notes instead of generic decks online made revision finally feel relevant.', initials: 'AM' },
  { name: 'Kavya Nair', role: 'Data Science learner', text: 'Analytics showed me I was weak in one specific topic I kept avoiding. Fixed it in three sessions.', initials: 'KN' },
];

const FAQS = [
  { q: 'Is SmartStudy AI really free?', a: 'Yes — the core workspace, including all nine agents, is free for students. There\'s no trial countdown and no card required to start.' },
  { q: 'What file types can I upload?', a: 'PDF, DOCX, PPTX, TXT, CSV, and scanned images. OCR runs automatically on scanned or image-based documents.' },
  { q: 'Does the AI just summarize, or can I actually ask it questions?', a: 'Both. Document Chat lets you ask follow-up questions and get answers grounded in the specific page or section of your upload.' },
  { q: 'Can I use this to prep for interviews, not just exams?', a: 'Yes — the Interview Coach agent runs mock technical and HR-style interviews and gives structured feedback after each session.' },
  { q: 'Is my uploaded data private?', a: 'Your documents and chat history are tied to your account and are not shared with other users or used to train models without consent.' },
];

/* ---------- Render Features ---------- */
const featureGrid = document.querySelector('#features .grid');
if (featureGrid) {
  featureGrid.innerHTML = FEATURES.map((f, i) => `
    <div class="reveal card card-lift p-6" style="--d:${(i % 3) * 90}ms">
      <div class="w-11 h-11 rounded-xl bg-${f.color}/15 grid place-items-center mb-4">
        <i data-lucide="${f.icon}" class="w-5 h-5 text-${f.color}"></i>
      </div>
      <h3 class="font-display font-semibold text-base mb-1.5">${f.title}</h3>
      <p class="text-muted text-sm leading-relaxed">${f.desc}</p>
    </div>
  `).join('');
}

/* ---------- Render Agents ---------- */
const agentGrid = document.getElementById('agentGrid');
if (agentGrid) {
  agentGrid.innerHTML = AGENTS.map((a, i) => `
    <div class="reveal card card-lift p-6 relative overflow-hidden" style="--d:${(i % 3) * 90}ms">
      <div class="flex items-start justify-between mb-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/25 to-secondary/10 grid place-items-center">
          <i data-lucide="${a.icon}" class="w-5 h-5 text-secondary"></i>
        </div>
        <span class="flex items-center gap-1.5 text-[11px] font-medium ${a.status === 'Active' ? 'text-success' : 'text-muted'}">
          <span class="w-1.5 h-1.5 rounded-full ${a.status === 'Active' ? 'bg-success dot-pulse' : 'bg-muted'}"></span>
          ${a.status}
        </span>
      </div>
      <h3 class="font-display font-semibold text-base mb-1">${a.name}</h3>
      <p class="text-muted text-sm leading-relaxed">${a.role}</p>
    </div>
  `).join('');
}

/* ---------- Render Testimonials (marquee) ---------- */
const track = document.getElementById('testimonialTrack');
if (track) {
  const cardsHtml = TESTIMONIALS.concat(TESTIMONIALS).map(t => `
    <div class="card p-6 w-[320px] shrink-0">
      <div class="flex items-center gap-1 text-warning mb-4">
        ${'<i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>'.repeat(5)}
      </div>
      <p class="text-sm leading-relaxed mb-6">&ldquo;${t.text}&rdquo;</p>
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center text-xs font-semibold">${t.initials}</div>
        <div>
          <div class="text-sm font-semibold">${t.name}</div>
          <div class="text-xs text-muted">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');
  track.innerHTML = cardsHtml;
  track.style.animation = 'marquee 38s linear infinite';
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');

  const style = document.createElement('style');
  style.textContent = `@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`;
  document.head.appendChild(style);
}

/* ---------- Render FAQ ---------- */
const faqList = document.getElementById('faqList');
if (faqList) {
  faqList.innerHTML = FAQS.map((f, i) => `
    <div class="card reveal" data-faq-item style="--d:${i * 60}ms">
      <button class="w-full flex items-center justify-between gap-4 p-5 text-left" data-faq-trigger>
        <span class="font-medium text-sm">${f.q}</span>
        <i data-lucide="plus" class="w-4 h-4 text-muted shrink-0 transition-transform" data-faq-icon></i>
      </button>
      <div class="px-5 overflow-hidden transition-all duration-300" style="max-height:0" data-faq-panel>
        <p class="text-muted text-sm pb-5 leading-relaxed">${f.a}</p>
      </div>
    </div>
  `).join('');
}

/* ---------- Radar chart ---------- */
window.addEventListener('load', () => {
  lucide.createIcons();
  const ctx = document.getElementById('landingRadar');
  if (ctx && window.Chart) {
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['DSA', 'DBMS', 'OS', 'Networks', 'Aptitude', 'System Design'],
        datasets: [{
          label: 'Accuracy',
          data: [82, 74, 91, 68, 88, 60],
          backgroundColor: 'rgba(99,102,241,0.25)',
          borderColor: '#6366F1',
          pointBackgroundColor: '#22D3EE',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: 'rgba(248,250,252,0.08)' },
            grid: { color: 'rgba(248,250,252,0.08)' },
            pointLabels: { color: '#94A3B8', font: { size: 11 } },
            ticks: { display: false, backdropColor: 'transparent' },
            suggestedMin: 0, suggestedMax: 100,
          }
        }
      }
    });
  }
});
