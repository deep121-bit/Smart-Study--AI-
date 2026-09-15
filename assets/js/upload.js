const RECENTS = [
  { icon: 'file-text', color: 'danger', name: 'Data Structures — Ch. 4 Trees.pdf', meta: '2.1 MB · Processed 2 hours ago' },
  { icon: 'presentation', color: 'primary', name: 'OS — Deadlock Slides.pptx', meta: '5.4 MB · Processed yesterday' },
  { icon: 'file-type-2', color: 'secondary', name: 'DBMS Normalization Notes.docx', meta: '820 KB · Processed 2 days ago' },
];

const recentEl = document.getElementById('recentUploads');
if (recentEl) {
  recentEl.innerHTML = RECENTS.map(r => `
    <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[.03] transition-colors">
      <div class="w-10 h-10 rounded-lg bg-${r.color}/15 grid place-items-center shrink-0"><i data-lucide="${r.icon}" class="w-4 h-4 text-${r.color}"></i></div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium truncate">${r.name}</div>
        <div class="text-xs text-muted">${r.meta}</div>
      </div>
      <span class="pill !py-1"><span class="dot"></span> Ready</span>
    </div>
  `).join('');
  lucide.createIcons();
}

const dropInner = document.getElementById('dropInner');
const fileInput = document.getElementById('fileInput');
const progressList = document.getElementById('progressList');

function row(name) {
  const id = 'up-' + Math.random().toString(36).slice(2, 8);
  const el = document.createElement('div');
  el.className = 'card p-4';
  el.innerHTML = `
    <div class="flex items-center gap-4">
      <div class="w-10 h-10 rounded-lg bg-primary/15 grid place-items-center shrink-0"><i data-lucide="file-up" class="w-4 h-4 text-primary"></i></div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-sm font-medium truncate">${name}</span>
          <span class="text-xs text-muted" id="${id}-status">Uploading...</span>
        </div>
        <div class="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div class="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 shimmer" style="width:35%" id="${id}-bar"></div>
        </div>
      </div>
    </div>`;
  progressList.prepend(el);
  lucide.createIcons();
  return {
    setDone(text, ok = true) {
      el.querySelector(`#${id}-status`).textContent = text;
      el.querySelector(`#${id}-status`).classList.add(ok ? 'text-success' : 'text-danger');
      const bar = el.querySelector(`#${id}-bar`);
      bar.style.width = '100%';
      bar.classList.remove('shimmer');
      if (!ok) bar.classList.replace('from-primary', 'from-danger');
    },
    openChatBtn() {
      const btnWrap = document.createElement('div');
      btnWrap.className = 'mt-3';
      btnWrap.innerHTML = `<a href="chat.html" class="btn btn-primary btn-sm">Open in chat <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></a>`;
      el.appendChild(btnWrap);
      lucide.createIcons();
    }
  };
}

async function realUpload(file) {
  const r = row(file.name);
  const form = new FormData();
  form.append('file', file);

  try {
    const res = await fetch(`${window.API_BASE}/api/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    window.setActiveDoc({ doc_id: data.doc_id, name: data.name });
    r.setDone('Processed by AI ✓', true);
    r.openChatBtn();
  } catch (err) {
    console.warn('Backend not reachable, falling back to demo mode:', err);
    r.setDone('Backend offline — demo mode', false);
  }
}

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    Array.from(e.target.files).forEach(f => realUpload(f));
  });
}

['dragover', 'dragenter'].forEach(evt => {
  dropInner?.addEventListener(evt, (e) => { e.preventDefault(); dropInner.classList.add('border-primary/60', 'bg-primary/5'); });
});
['dragleave', 'drop'].forEach(evt => {
  dropInner?.addEventListener(evt, (e) => { e.preventDefault(); dropInner.classList.remove('border-primary/60', 'bg-primary/5'); });
});
dropInner?.addEventListener('drop', (e) => Array.from(e.dataTransfer.files).forEach(f => realUpload(f)));
dropInner?.addEventListener('click', (e) => { if (!e.target.closest('label')) fileInput.click(); });
