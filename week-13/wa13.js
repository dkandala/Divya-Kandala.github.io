const API_BASE = 'https://openlibrary.org/search.json?author=';

document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-button');
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('clearBtn');
  const exportBtn = document.getElementById('exportBtn');

  if (searchBtn) searchBtn.addEventListener('click', searchBooks);
  if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchBooks(); });

  if (clearBtn) clearBtn.addEventListener('click', () => {
    localStorage.removeItem('resultsData');
    renderEmptyResults('Results cleared.');
  });

  if (exportBtn) exportBtn.addEventListener('click', () => {
    const raw = localStorage.getItem('resultsData');
    if (!raw) return alert('No results to export.');
    downloadAsJSON(raw, 'search-results.json');
  });

  const saved = localStorage.getItem('resultsData');
  if (saved) renderSavedResults(JSON.parse(saved));

  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const opened = navMenu.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', String(opened));
    });
  }
});

async function searchBooks() {
  const q = (document.getElementById('search-input') || {}).value || '';
  const resultsEl = document.getElementById('results');
  const listEl = document.getElementById('results-list');
  if (!resultsEl || !listEl) return;

  const query = q.trim();
  if (!query) { resultsEl.innerHTML = '<p>Enter an author name.</p>'; listEl.innerHTML = ''; return; }

  resultsEl.innerHTML = '<p>Searching…</p>';
  listEl.innerHTML = '';

  try {
    const resp = await fetch(API_BASE + encodeURIComponent(query));
    if (!resp.ok) throw new Error(resp.statusText);
    const data = await resp.json();
    const docs = (data.docs || []).slice(0, 5);
    if (docs.length === 0) { renderEmptyResults('No books found.'); return; }

    const normalized = docs.map(d => ({
      title: d.title || 'No title',
      authors: (d.author_name || []).slice(0,3).join(', ') || 'Unknown author', // fallback
      year: d.first_publish_year || '',
      coverId: d.cover_i || null
    }));
    localStorage.setItem('resultsData', JSON.stringify(normalized));

    renderResults(normalized);
  } catch (err) {
    console.error(err);
    renderEmptyResults('Error fetching results: ' + (err.message || 'unknown'));
  }
}

function renderResults(items) {
    const resultsEl = document.getElementById('results');
    const listEl = document.getElementById('results-list');
    resultsEl.innerHTML = '';
    listEl.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'results-grid';

    const frag = document.createDocumentFragment();
    items.forEach(item => {
        const coverUrl = item.coverId
            ? `https://covers.openlibrary.org/b/id/${item.coverId}-M.jpg`
            : 'https://via.placeholder.com/128x180?text=No+Cover'; 

        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
          <div class="cover">
            <img src="${coverUrl}" alt="${escapeHtml(item.title)}"
                 onerror="this.src='https://via.placeholder.com/128x180?text=No+Cover'">
          </div>
          <div class="meta">
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.authors)} ${item.year ? '• ' + item.year : ''}</p>
          </div>
        `;
        grid.appendChild(card);

        const li = document.createElement('li');
        li.textContent = `${item.title} — ${item.authors}${item.year ? ' (' + item.year + ')' : ''}`;
        frag.appendChild(li);
    });

    resultsEl.appendChild(grid);
    listEl.appendChild(frag);
}

function renderEmptyResults(msg) {
  const resultsEl = document.getElementById('results');
  const listEl = document.getElementById('results-list');
  if (resultsEl) resultsEl.innerHTML = `<p>${escapeHtml(msg)}</p>`;
  if (listEl) listEl.innerHTML = '';
}

function renderSavedResults(items) {
  if (!items || items.length === 0) return renderEmptyResults('No saved results.');
  renderResults(items);
}

function downloadAsJSON(data, filename = 'data.json') {
  const json = (typeof data === 'string') ? data : JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('Export started.');
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}