// Point this at your running backend (see /backend/README or main README).
// If the backend isn't reachable, pages fall back to demo data automatically.
window.API_BASE = 'https://smart-study-ai-1-1dzn.onrender.com';

window.getActiveDoc = function () {
  const raw = localStorage.getItem('smartstudy_active_doc');
  return raw ? JSON.parse(raw) : null;
};

window.setActiveDoc = function (doc) {
  localStorage.setItem('smartstudy_active_doc', JSON.stringify(doc));
};
