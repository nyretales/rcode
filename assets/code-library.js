/* R•CODE Code Library — v2 (data dari Worker, terbaru di atas, preview otomatis) */
const API = 'https://rcode-cms-api.nyretales.workers.dev';
const PAGE_SIZE = 18;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
let activeCategory = 'All', searchTerm = '', shown = PAGE_SIZE, items = [];

const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cleanTitle = t => String(t || '').replace(/^\d+\.\d+\s*/, '');
const isNew = x => x.createdAt && Date.now() - Date.parse(x.createdAt) < 14 * 864e5;
const newestFirst = a => a.map((x, i) => ({ x, i })).sort((p, q) => (Date.parse(q.x.createdAt) || 0) - (Date.parse(p.x.createdAt) || 0) || p.i - q.i).map(o => o.x);

function composePreview(files) {
  files = files || [];
  const h = files.find(f => f.lang === 'html');
  if (!h) return '';
  let doc = h.code || '';
  const css = files.filter(f => f.lang === 'css').map(f => f.code).join('\n');
  const js = files.filter(f => f.lang === 'js').map(f => f.code).join('\n');
  if (css) doc = doc.replace(/<link[^>]+href=["'](?:\.\/)?[\w.-]+\.css["'][^>]*>/gi, '');
  if (js) doc = doc.replace(/<script[^>]+src=["'](?:\.\/)?[\w.-]+\.js["'][^>]*>\s*<\/script>/gi, '');
  if (!/<html[\s>]/i.test(doc)) doc = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + doc + '</body></html>';
  if (css) doc = /<\/head>/i.test(doc) ? doc.replace(/<\/head>/i, '<style>' + css + '</style></head>') : '<style>' + css + '</style>' + doc;
  if (js) doc = /<\/body>/i.test(doc) ? doc.replace(/<\/body>/i, '<script>' + js + '<\/script></body>') : doc + '<script>' + js + '<\/script>';
  return doc;
}

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

function skeleton() {
  $('#grid').innerHTML = Array.from({ length: 6 }, () => '<article class="lib-card lib-skel" aria-hidden="true"><div class="lib-skel-img"></div><div class="lib-card-body"><i></i><i></i><i class="short"></i></div></article>').join('');
}
skeleton();

fetch(API + '/api/public/code-library').then(r => r.json()).then(data => {
  if (!Array.isArray(data)) throw 0;
  items = newestFirst(data);
  items.forEach(x => { if (!x.preview && !x.requiresBuild) { x.preview = composePreview(x.files); x.previewable = !!x.preview; } });
  window.codeItems = items;
  buildFilters();
  $('#search').addEventListener('input', e => { searchTerm = e.target.value.toLowerCase(); shown = PAGE_SIZE; render(); });
  render();
  const id = new URL(location.href).searchParams.get('item');
  if (id) showCode(id);
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
  const list = items.filter(x => (activeCategory === 'All' || x.category === activeCategory) && `${x.title} ${x.category} ${x.description}`.toLowerCase().includes(searchTerm));
  const page = list.slice(0, shown);
  $('#count').textContent = `${list.length} dari ${items.length} komponen`;
  $('#grid').innerHTML = (page.length ? page.map(card).join('') : '<div class="lib-empty">Tidak ada komponen yang cocok dengan pencarianmu.</div>') +
    (list.length > shown ? `<div class="lib-more"><button class="lib-btn secondary" id="moreBtn">Muat lebih banyak (${list.length - shown} lagi)</button></div>` : '');
  page.forEach(x => { if (x.previewable) { const f = $(`[data-preview-id="${CSS.escape(x.id)}"]`); if (f) f.srcdoc = x.preview; } });
  $$('[data-open]').forEach(b => b.addEventListener('click', () => showCode(b.dataset.open)));
  $$('[data-copy-all]').forEach(b => b.addEventListener('click', () => { const x = items.find(i => i.id === b.dataset.copyAll); copyText(x.files.map(f => `/* ${f.filename} */\n${f.code}`).join('\n\n'), b); }));
  const more = $('#moreBtn'); if (more) more.addEventListener('click', () => { shown += PAGE_SIZE; render(); });
}

function card(x) {
  const visual = x.previewable
    ? `<iframe title="Preview ${esc(x.title)}" loading="lazy" sandbox="allow-scripts allow-forms" data-preview-id="${esc(x.id)}"></iframe>`
    : (x.thumbnail ? `<img src="${esc(x.thumbnail)}" alt="${esc(x.title)}" loading="lazy" style="width:100%;height:100%;object-fit:cover">`
      : `<div class="lib-prompt-art"><span>${x.requiresBuild ? 'REACT + VITE PROJECT' : 'INTERACTIVE UI COMPONENT'}</span></div>`);
  return `<article class="lib-card"><div class="lib-preview">${visual}<span class="lib-preview-label">${x.previewable ? 'LIVE PREVIEW' : 'SOURCE PREVIEW'}</span>${isNew(x) ? '<span class="lib-badge-new">BARU</span>' : ''}</div><div class="lib-card-body"><div class="lib-meta"><span>${esc(x.category)}</span><span>${x.files.length} FILE${x.files.length > 1 ? 'S' : ''}</span></div><h2>${esc(cleanTitle(x.title))}</h2><p>${esc(x.description || 'Komponen antarmuka siap dipelajari dan dikembangkan.')}</p><div class="lib-card-actions"><button class="lib-btn" data-open="${esc(x.id)}">Preview & source ↗</button><button class="lib-btn secondary" data-copy-all="${esc(x.id)}">Copy code</button></div></div></article>`;
}

function showCode(id) {
  const x = items.find(i => i.id === id); if (!x) return;
  const u = new URL(location.href); u.searchParams.set('item', id); history.replaceState(null, '', u);
  $('#modalCat').textContent = x.category;
  $('#modalTitle').textContent = cleanTitle(x.title);
  $('#modalDesc').textContent = x.description || '';
  const preview = x.previewable
    ? `<div class="lib-toolbar"><span class="lib-kicker">LIVE PREVIEW</span><span class="lib-toolbar-btns"><button class="lib-btn secondary" data-w="desktop">Desktop</button><button class="lib-btn secondary" data-w="mobile">Mobile</button><button class="lib-btn secondary" id="fullBtn">Layar penuh ↗</button></span></div><div class="lib-code-preview" id="codePrev"><iframe title="Live preview ${esc(x.title)}" sandbox="allow-scripts allow-forms allow-modals"></iframe></div>`
    : x.requiresBuild ? '<div class="lib-empty">Komponen ini menggunakan React + Vite. Source tersedia untuk disalin, tetapi preview langsung memerlukan proses build proyek.</div>'
      : (x.thumbnail ? `<figure class="lib-figure"><img src="${esc(x.thumbnail)}" alt="${esc(x.title)}"></figure>` : '');
  const files = x.files.map((f, i) => `<section class="lib-file"><div class="lib-file-head"><span>${esc(f.filename || 'file')} · ${esc((f.lang || '').toUpperCase())}</span><button class="lib-btn" data-copy-file="${i}">Copy file</button></div><pre><code>${esc(f.code)}</code></pre></section>`).join('');
  $('#modalContent').innerHTML = preview + `<div class="lib-toolbar"><p class="lib-kicker">SOURCE FILES · ${x.files.length}</p><span class="lib-toolbar-btns"><button class="lib-btn secondary" id="copyLink">Salin tautan</button><button class="lib-btn" id="copyAll">Copy all source</button></span></div>${files}`;
  if (x.previewable) {
    $('#codePrev iframe').srcdoc = x.preview;
    $$('[data-w]').forEach(b => b.addEventListener('click', () => $('#codePrev').classList.toggle('is-mobile', b.dataset.w === 'mobile')));
    $('#fullBtn').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([x.preview], { type: 'text/html' })); window.open(url, '_blank', 'noopener'); setTimeout(() => URL.revokeObjectURL(url), 60000); });
  }
  $$('[data-copy-file]').forEach(b => b.addEventListener('click', () => copyText(x.files[+b.dataset.copyFile].code, b)));
  $('#copyAll').addEventListener('click', e => copyText(x.files.map(f => `/* ${f.filename} */\n${f.code}`).join('\n\n'), e.currentTarget));
  $('#copyLink').addEventListener('click', e => copyText(location.href, e.currentTarget));
  openModal();
}
