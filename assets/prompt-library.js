/* R•CODE Prompt Library — v2 (1 kartu = 1 prompt + contoh gambar, terbaru di atas) */
const API = 'https://rcode-cms-api.nyretales.workers.dev';
const PAGE_SIZE = 24;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
let activeCategory = 'All', searchTerm = '', shown = PAGE_SIZE, items = [];

const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cleanTitle = t => String(t || '').replace(/^\d+\.\d+\s*/, '');
const isNew = x => x.createdAt && Date.now() - Date.parse(x.createdAt) < 14 * 864e5;
const newestFirst = a => a.map((x, i) => ({ x, i })).sort((p, q) => (Date.parse(q.x.createdAt) || 0) - (Date.parse(p.x.createdAt) || 0) || p.i - q.i).map(o => o.x);
const imageOf = x => x.thumbnail || (x.images && x.images[0]) || (x.prompts && x.prompts[0] && x.prompts[0].image) || '';
const copyTextOf = x => (x.prompts && x.prompts.length === 1) ? x.prompts[0].text : (x.raw || (x.prompts || []).map(p => p.text).join('\n\n'));

async function copyText(text, btn) {
  try { await navigator.clipboard.writeText(text); } catch (e) {
    const t = document.createElement('textarea'); t.value = text; document.body.append(t); t.select(); document.execCommand('copy'); t.remove();
  }
  if (btn) { const old = btn.textContent; btn.textContent = 'Copied ✓'; setTimeout(() => btn.textContent = old, 1400); }
}

function openModal() { $('#modal').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() {
  $('#modal').classList.remove('open'); document.body.style.overflow = '';
  const u = new URL(location.href); if (u.searchParams.has('item')) { u.searchParams.delete('item'); history.replaceState(null, '', u); }
}
$('#close').addEventListener('click', closeModal);
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

$('#grid').innerHTML = Array.from({ length: 6 }, () => '<article class="lib-card lib-skel" aria-hidden="true"><div class="lib-skel-img"></div><div class="lib-card-body"><i></i><i></i><i class="short"></i></div></article>').join('');

fetch(API + '/api/public/prompt-library').then(r => r.json()).then(data => {
  if (!Array.isArray(data)) throw 0;
  items = newestFirst(data);
  window.promptItems = items;
  buildFilters();
  $('#search').addEventListener('input', e => { searchTerm = e.target.value.toLowerCase(); shown = PAGE_SIZE; render(); });
  render();
  const id = new URL(location.href).searchParams.get('item');
  if (id) showPrompts(id);
}).catch(() => { $('#grid').innerHTML = '<div class="lib-empty">Katalog belum dapat dimuat dari server. Silakan coba beberapa saat lagi.</div>'; });

function setCategory(c) {
  activeCategory = c; shown = PAGE_SIZE;
  $$('.lib-filter').forEach(x => x.setAttribute('aria-pressed', x.dataset.cat === c));
  const s = $('#catSelect'); if (s) s.value = c;
  render();
}
function buildFilters() {
  const cats = ['All', ...new Set(items.map(x => x.category))];
  $('#filters').innerHTML = cats.map(c => `<button class="lib-filter" data-cat="${esc(c)}" aria-pressed="${c === 'All'}">${esc(c)}</button>`).join('');
  $('#filters').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) setCategory(b.dataset.cat); });
  const sel = document.createElement('select');
  sel.id = 'catSelect'; sel.className = 'lib-select'; sel.setAttribute('aria-label', 'Pilih kategori');
  sel.innerHTML = cats.map(c => `<option value="${esc(c)}">${c === 'All' ? 'Semua kategori' : esc(c)}</option>`).join('');
  sel.addEventListener('change', () => setCategory(sel.value));
  $('#filters').before(sel);
}

function render() {
  const list = items.filter(x => (activeCategory === 'All' || x.category === activeCategory) && `${x.title} ${x.category} ${x.summary}`.toLowerCase().includes(searchTerm));
  const page = list.slice(0, shown);
  const total = items.reduce((n, x) => n + ((x.prompts || []).length || 1), 0);
  $('#count').textContent = `${list.length} koleksi · ${total.toLocaleString('id-ID')} prompt`;
  $('#grid').innerHTML = (page.length ? page.map(card).join('') : '<div class="lib-empty">Tidak ada koleksi yang cocok dengan pencarianmu.</div>') +
    (list.length > shown ? `<div class="lib-more"><button class="lib-btn secondary" id="moreBtn">Muat lebih banyak (${list.length - shown} lagi)</button></div>` : '');
  $$('[data-open]').forEach(b => b.addEventListener('click', () => showPrompts(b.dataset.open)));
  $$('[data-copy-collection]').forEach(b => b.addEventListener('click', () => copyText(copyTextOf(items.find(i => i.id === b.dataset.copyCollection)), b)));
  const more = $('#moreBtn'); if (more) more.addEventListener('click', () => { shown += PAGE_SIZE; render(); });
}

function card(x) {
  const img = imageOf(x), n = (x.prompts || []).length;
  const art = img
    ? `<div class="lib-prompt-art has-img"><img src="${esc(img)}" alt="Contoh hasil: ${esc(x.title)}" loading="lazy">${isNew(x) ? '<span class="lib-badge-new">BARU</span>' : ''}</div>`
    : `<div class="lib-prompt-art"><span>${esc((x.category || '').toUpperCase())} / FREE PROMPTS</span>${isNew(x) ? '<span class="lib-badge-new">BARU</span>' : ''}</div>`;
  const summary = String(x.summary || '').slice(0, 170);
  return `<article class="lib-card">${art}<div class="lib-card-body"><div class="lib-meta"><span>${esc(x.category)}</span><span>${n > 1 ? n + ' PROMPTS' : n === 1 ? '1 PROMPT' : 'FULL COLLECTION'}</span></div><h2>${esc(cleanTitle(x.title))}</h2><p>${esc(summary)}${String(x.summary || '').length > 170 ? '…' : ''}</p><div class="lib-card-actions"><button class="lib-btn" data-open="${esc(x.id)}">${n > 1 ? 'Open collection' : 'Lihat prompt'} ↗</button><button class="lib-btn secondary" data-copy-collection="${esc(x.id)}">${n > 1 ? 'Copy all' : 'Copy prompt'}</button></div></div></article>`;
}

function showPrompts(id) {
  const x = items.find(i => i.id === id); if (!x) return;
  const u = new URL(location.href); u.searchParams.set('item', id); history.replaceState(null, '', u);
  const prompts = x.prompts || [], img = imageOf(x), multi = prompts.length > 1;
  $('#modalCat').textContent = x.category;
  $('#modalTitle').textContent = cleanTitle(x.title);
  $('#modalDesc').textContent = multi ? `${prompts.length} prompt siap disalin · Sumber: ${x.source || 'Koleksi prompt'}` : 'Salin prompt, lalu tempel ke alat AI pilihanmu.';
  const figure = img ? `<figure class="lib-figure"><img src="${esc(img)}" alt="Contoh hasil: ${esc(x.title)}"><figcaption>Contoh hasil generate</figcaption></figure>` : '';
  const cards = prompts.length
    ? prompts.map((p, i) => `<article class="lib-prompt-item"><div class="lib-meta"><span>PROMPT ${String(i + 1).padStart(3, '0')}</span><span>${esc(x.category)}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p><button class="lib-btn" data-copy-prompt="${i}">Copy prompt ↗</button></article>`).join('')
    : `<article class="lib-prompt-item" style="grid-column:1/-1"><h3>Full collection</h3><p>${esc(x.raw)}</p><button class="lib-btn" id="copyRaw">Copy full collection</button></article>`;
  const tools = `<div class="lib-toolbar">${multi ? '<input class="lib-detail-search" id="promptSearch" placeholder="Cari prompt di koleksi ini…" style="max-width:480px;margin:0">' : '<span></span>'}<span class="lib-toolbar-btns"><button class="lib-btn secondary" id="copyLink">Salin tautan</button>${multi ? '<button class="lib-btn secondary" id="copyCollection">Copy entire collection</button>' : ''}</span></div>`;
  $('#modalContent').innerHTML = tools + (multi || !img ? figure + `<div class="lib-prompt-list${multi ? '' : ' single'}" id="promptList">${cards}</div>` : `<div class="lib-split">${figure}<div class="lib-prompt-list single" id="promptList">${cards}</div></div>`);
  $$('[data-copy-prompt]').forEach(b => b.addEventListener('click', () => copyText(prompts[+b.dataset.copyPrompt].text, b)));
  const c = $('#copyCollection'); if (c) c.addEventListener('click', () => copyText(copyTextOf(x), c));
  const cr = $('#copyRaw'); if (cr) cr.addEventListener('click', () => copyText(x.raw, cr));
  $('#copyLink').addEventListener('click', e => copyText(location.href, e.currentTarget));
  const ps = $('#promptSearch'); if (ps) ps.addEventListener('input', e => { const q = e.target.value.toLowerCase(); $$('.lib-prompt-item', $('#promptList')).forEach(cd => cd.style.display = cd.textContent.toLowerCase().includes(q) ? 'flex' : 'none'); });
  openModal();
}
