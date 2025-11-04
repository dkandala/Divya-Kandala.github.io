const endpointBase = "https://openlibrary.org/search.json?author=";

document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-button');
  if (searchBtn) searchBtn.addEventListener('click', searchBooks);
});

async function searchBooks() {
  const input = document.getElementById('search-input');
  const resultsEl = document.getElementById('results');
  if (!input || !resultsEl) return;

  const query = input.value.trim();
  if (!query) {
    resultsEl.innerHTML = '<p>Please enter an author name.</p>';
    return;
  }

  resultsEl.innerHTML = '<p>Searching…</p>';

  try {
    const url = endpointBase + encodeURIComponent(query);
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    const docs = data.docs || [];

    if (docs.length === 0) {
      resultsEl.innerHTML = '<p>No books found for that author.</p>';
      return;
    }

    const container = document.createElement('div');
    container.className = 'results-list';

    docs.slice(0, 20).forEach(doc => {
      const title = doc.title || 'No title';

      const item = document.createElement('div');
      item.className = 'result-item';

      item.innerHTML = `
        <div class="meta">
            <ul>
            <li>${escapeHtml(title)}</li>
            </ul>
        </div>
      `;
      container.appendChild(item);
    });

    resultsEl.innerHTML = '';
    resultsEl.appendChild(container);
  } catch (err) {
    resultsEl.innerHTML = `<p>Error fetching results: ${escapeHtml(err.message)}</p>`;
    console.error(err);
  }
}

// Save favorites locally, give option to export
function exportData() {
  const favorites = localStorage.getItem('resultsData');
  if (!favorites) {
    alert('No results data to export.');
  downloadAsJSON(favorites); // User gets their data
}
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}