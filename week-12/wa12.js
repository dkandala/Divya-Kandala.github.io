const endpointBase = "https://openlibrary.org/search.json?author=";

document.addEventListener('DOMContentLoaded', () => {
  ['search-button', 'exportBtn', 'clearBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === 'search-button') el.addEventListener('click', searchBooks);
    if (id === 'exportBtn') el.addEventListener('click', exportData);
    if (id === 'clearBtn') el.addEventListener('click', clearResults);
  });

  // if e is pressed for enter then search will start accessing results
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchBooks();
      }
    });
  }
});

async function searchBooks() {
  const input = document.getElementById('search-input');
  const resultsEl = document.getElementById('results');
  if (!input || !resultsEl) return;

  const query = input.value.trim();
  if (!query) return showMessage(resultsEl, 'Please enter an author name.');

  showMessage(resultsEl, 'Searching…');

  try {
    const res = await fetch(endpointBase + encodeURIComponent(query));
    if (!res.ok) throw new Error(res.statusText);

    const docs = (await res.json()).docs ?? [];
    if (docs.length === 0) return showMessage(resultsEl, 'No books found for that author.');

    const container = document.createElement('div');
    container.className = 'results-list';

    docs.slice(0, 20).forEach(doc => {
      const item = document.createElement('div');
      item.className = 'result-item';
      item.innerHTML = `
        <div class="meta">
          <ul><li>${escapeHtml(doc.title ?? 'No title')}</li></ul>
        </div>`;
      container.appendChild(item);
    });

    resultsEl.innerHTML = '';
    resultsEl.appendChild(container);
    localStorage.setItem('resultsData', JSON.stringify(docs.slice(0, 20)));
  } catch (err) {
    showMessage(resultsEl, `Error fetching results: ${escapeHtml(err.message)}`);
    console.error(err);
  }
}

function exportData() {
  const results = localStorage.getItem('resultsData');
  if (!results) return alert('No results data to export.');
  downloadAsJSON(results, 'search-results.json');
}

function downloadAsJSON(data, filename = 'data.json') {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('Results exported successfully!');
}

function clearResults() {
  localStorage.removeItem('resultsData');
  showMessage(document.getElementById('results'), 'Results cleared.');
  alert('Results cleared successfully!');
}

function showMessage(el, msg) {
  if (el) el.innerHTML = `<p>${msg}</p>`;
}

function escapeHtml(str = '') {
  return str.replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}