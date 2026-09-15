const messagesEl = document.getElementById('chatMessages');
const form = document.getElementById('chatForm');
const input = document.getElementById('chatInput');
const docTitleEl = document.querySelector('header .text-sm.font-semibold.truncate');
const docMetaEl = document.querySelector('header .text-xs.text-muted');

const activeDoc = window.getActiveDoc ? window.getActiveDoc() : null;
let history = [];

if (activeDoc && docTitleEl) {
  docTitleEl.textContent = activeDoc.name;
  docMetaEl.textContent = 'Connected to your backend · Tutor Agent active';
}

const DEMO_SEED = [
  { role: 'ai', text: activeDoc
      ? `Loaded <strong>${activeDoc.name}</strong>. Ask me anything about it.`
      : "Hi! No document is connected yet — go to <a href='upload.html' class='text-secondary underline'>Upload</a> and add a PDF/DOCX/TXT to chat with real AI. Showing demo mode for now." },
];

function addMessage(role, html, animate = true) {
  const wrap = document.createElement('div');
  wrap.className = `flex gap-3 ${role === 'user' ? 'justify-end' : ''} ${animate ? 'reveal' : ''}`;
  if (animate) requestAnimationFrame(() => wrap.classList.add('in-view'));
  const bubble = `<div class="chat-bubble ${role}">${html}</div>`;
  const avatar = role === 'ai'
    ? `<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center shrink-0 mt-0.5"><i data-lucide="sparkles" class="w-4 h-4 text-white"></i></div>`
    : '';
  wrap.innerHTML = role === 'ai' ? avatar + bubble : bubble;
  messagesEl.appendChild(wrap);
  lucide.createIcons();
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'flex gap-3';
  wrap.id = 'typingRow';
  wrap.innerHTML = `
    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center shrink-0 mt-0.5"><i data-lucide="sparkles" class="w-4 h-4 text-white"></i></div>
    <div class="chat-bubble ai flex items-center gap-1.5">
      <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
    </div>`;
  messagesEl.appendChild(wrap);
  lucide.createIcons();
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

const DEMO_RESPONSES = [
  "That's a great question — but I'm running in demo mode right now. Upload a document on the Upload page and make sure the backend is running to get real, grounded answers.",
];

async function respondTo(text) {
  addTyping();

  if (activeDoc) {
    try {
      const res = await fetch(`${window.API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc_id: activeDoc.doc_id, message: text, history }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      document.getElementById('typingRow')?.remove();
      addMessage('ai', data.reply.replace(/\n/g, '<br>'));
      history.push({ role: 'user', content: text }, { role: 'assistant', content: data.reply });
      return;
    } catch (err) {
      console.warn('Backend chat failed, falling back to demo:', err);
    }
  }

  setTimeout(() => {
    document.getElementById('typingRow')?.remove();
    addMessage('ai', DEMO_RESPONSES[0]);
  }, 900);
}

DEMO_SEED.forEach(m => addMessage(m.role, m.text, false));

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMessage('user', text.replace(/</g, '&lt;'));
  input.value = '';
  respondTo(text);
});

input?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
});

document.querySelectorAll('[data-suggest]').forEach(btn => {
  btn.addEventListener('click', () => { input.value = btn.dataset.suggest; form.requestSubmit(); });
});
