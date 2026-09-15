const DEMO_DECK = [
  { front: 'AVL Tree', back: 'A self-balancing binary search tree where the height difference between left and right subtrees is at most 1 for every node.' },
  { front: 'Binary Search Tree', back: 'A tree where every left child is smaller and every right child is greater than its parent node.' },
  { front: 'Tree Traversal', back: 'Visiting every node in a tree exactly once — common orders are in-order, pre-order, and post-order.' },
  { front: 'Rotation', back: 'A local restructuring of a few nodes used to restore balance in a self-balancing tree after insertion or deletion.' },
  { front: 'Heap', back: 'A complete binary tree where every parent is either always greater (max-heap) or always smaller (min-heap) than its children.' },
];

const activeDoc = window.getActiveDoc ? window.getActiveDoc() : null;
let DECK = [];
let idx = 0;

const flipCard = document.getElementById('flipCard');
const frontText = document.getElementById('frontText');
const backText = document.getElementById('backText');
const cardIndex = document.getElementById('cardIndex');
const cardProgress = document.getElementById('cardProgress');

async function loadDeck() {
  frontText.textContent = 'Loading…';
  if (activeDoc) {
    try {
      const res = await fetch(`${window.API_BASE}/api/generate/flashcards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc_id: activeDoc.doc_id, count: 10 }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.cards?.length) {
        DECK = data.cards;
        document.querySelector('.text-muted.text-sm').textContent = `${activeDoc.name} · ${DECK.length} cards`;
      }
    } catch (err) {
      console.warn('Backend flashcard generation failed, using demo deck:', err);
    }
  }
  if (!DECK.length) DECK = DEMO_DECK;
  document.getElementById('cardTotal').textContent = DECK.length;
  loadCard();
}

function loadCard() {
  flipCard.classList.remove('flipped');
  const c = DECK[idx];
  setTimeout(() => { frontText.textContent = c.front; backText.textContent = c.back; }, 150);
  cardIndex.textContent = idx + 1;
  cardProgress.style.width = ((idx + 1) / DECK.length * 100) + '%';
}

flipCard.addEventListener('click', () => flipCard.classList.toggle('flipped'));

function nextCard() { idx = (idx + 1) % DECK.length; loadCard(); }

document.getElementById('easyBtn').addEventListener('click', nextCard);
document.getElementById('hardBtn').addEventListener('click', nextCard);
document.getElementById('bookmarkBtn').addEventListener('click', (e) => {
  e.currentTarget.classList.toggle('!bg-warning/20');
  e.currentTarget.classList.toggle('!text-warning');
});

loadDeck();
