/* R•CODE CMS Admin — v2
   - Simpan per item (tidak menimpa item lain)
   - Item baru di urutan pertama (createdAt)
   - Preview kode dirakit otomatis + pratinjau langsung
   - Prompt: 1 prompt + 1 gambar contoh hasil
   - Tab "Gambar Situs" untuk mengisi placeholder halaman utama
   - Riwayat & pulihkan versi katalog */
(() => {
const API = 'https://rcode-cms-api.nyretales.workers.dev';
const $ = s => document.querySelector(s);
const state = { token: sessionStorage.getItem('rcode_cms_token') || '', catalog: 'code', data: { code: [], prompt: [] }, site: {}, selected: null, newRef: null, dirty: false, media: [], siteSlot: null };
const paths = { code: 'data/code-library.json', prompt: 'data/prompt-library.json' };
const titles = { code: 'Code Library', prompt: 'Prompt Library' };
const labels = { code: 'Koleksi komponen dan source code HTML, CSS, serta JavaScript.', prompt: 'Setiap kartu berisi satu prompt dan (opsional) satu gambar contoh hasil.' };

const SLOTS = [
  ...Array.from({ length: 8 }, (_, i) => ({ key: `hero-${i + 1}`, label: `Hero · HP ${i + 1}`, hint: 'Potret 390×844', ratio: '390/844', def: `assets/images/hero-code-preview-0${i + 1}.webp` })),
  { key: 'free-code', label: 'Kartu Free Code', hint: 'Persegi 1:1', ratio: '1/1', def: 'assets/images/free-code-preview.webp' },
  { key: 'free-prompts', label: 'Kartu Free Prompts', hint: 'Persegi 1:1', ratio: '1/1', def: 'assets/images/prompt-library-preview.webp' },
  { key: 'zonagreen', label: 'Kartu ZonaGreen Creative Lab', hint: 'Persegi 1:1', ratio: '1/1', def: 'assets/images/zonagreen-lab-preview.webp' },
  { key: 'experiments', label: 'Kartu Experiments & Projects', hint: 'Persegi 1:1', ratio: '1/1', def: 'assets/images/experiments-preview.webp' },
  { key: 'content-1', label: 'ZonaGreen · Jersey Fundamentals & Workflow', hint: 'Lanskap 16:9', ratio: '16/9' },
  { key: 'content-2', label: 'ZonaGreen · AI Prompt Library & Templates', hint: 'Lanskap 16:9', ratio: '16/9' },
  { key: 'content-3', label: 'ZonaGreen · Production Ready Checklist', hint: 'Lanskap 16:9', ratio: '16/9' },
  { key: 'content-4', label: 'Work in progress · Web Experiments', hint: 'Lanskap 16:9', ratio: '16/9' },
  { key: 'content-5', label: 'Work in progress · Interface Studies', hint: 'Lanskap 16:9', ratio: '16/9' },
  { key: 'content-6', label: 'Work in progress · Learning Notes', hint: 'Lanskap 16:9', ratio: '16/9' }
];

function status(m, k = '') { $('#saveStatus').textContent = m; $('#saveStatus').style.color = k === 'error' ? '#ff9b91' : k === 'ok' ? '#5cd5a5' : ''; }
function setConnection(ok, m) { const e = $('#connection'); e.classList.toggle('online', ok); e.innerHTML = `<i></i> ${m}`; }
async function api(path, { method = 'GET', body = null, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && state.token) headers.Authorization = `Bearer ${state.token}`;
  const r = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let d; try { d = await r.json(); } catch { throw Error(`Respons server tidak valid (${r.status})`); }
  if (!r.ok || d.success === false) { const e = Error(d.message || `HTTP ${r.status}`); e.data = d; e.status = r.status; throw e; }
  return d;
}
function showLogin() { $('#loginView').classList.remove('hidden'); $('#dashboard').classList.add('hidden'); $('#logoutBtn').classList.add('hidden'); }
function showDashboard() { $('#loginView').classList.add('hidden'); $('#dashboard').classList.remove('hidden'); $('#logoutBtn').classList.remove('hidden'); }
async function login(password) { const d = await api('/api/auth/login', { method: 'POST', body: { password }, auth: false }); state.token = d.token; sessionStorage.setItem('rcode_cms_token', state.token); showDashboard(); await loadAll(); }
async function logout() { try { await api('/api/auth/logout', { method: 'POST' }); } catch {} state.token = ''; sessionStorage.removeItem('rcode_cms_token'); state.data = { code: [], prompt: [] }; showLogin(); setConnection(true, 'API online'); }
async function loadCatalog(t) { const d = await api('/api/github/read?path=' + encodeURIComponent(paths[t])); if (d.type !== 'file') throw Error(`File ${paths[t]} tidak ditemukan`); const a = JSON.parse(d.content); if (!Array.isArray(a)) throw Error('Format katalog tidak valid'); state.data[t] = a; }
async function loadSite() { try { const d = await api('/api/github/read?path=data/site-media.json'); const m = JSON.parse(d.content); state.site = m && typeof m === 'object' && !Array.isArray(m) ? m : {}; } catch { state.site = {}; } }
async function loadAll() {
  setConnection(true, 'Memuat katalog…'); status('Mengambil data dari repository private…');
  try { await Promise.all([loadCatalog('code'), loadCatalog('prompt'), loadSite()]); state.selected = null; state.newRef = null; renderCounts(); renderList(); if (state.catalog === 'site') renderSite(); setConnection(true, 'GitHub tersambung'); status('Data berhasil dimuat.', 'ok'); }
  catch (e) { setConnection(false, 'Gagal memuat data'); status(e.message, 'error'); throw e; }
}
function current() { return state.data[state.catalog] || []; }
function titleOf(x) { return x.title || x.name || '(Tanpa judul)'; }
function esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function renderCounts() {
  $('#codeCount').textContent = state.data.code.length; $('#promptCount').textContent = state.data.prompt.length;
  $('#sideCode').textContent = state.data.code.length; $('#sidePrompt').textContent = state.data.prompt.length;
  $('#sideSite').textContent = `${Object.keys(state.site).length}/${SLOTS.length}`;
  $('#listCountLabel').textContent = `${current().length} item`;
}
function renderList() {
  if (state.catalog === 'site') return;
  const q = $('#searchInput').value.trim().toLowerCase();
  const items = current().map((x, i) => ({ x, i })).filter(({ x }) => `${x.title || ''} ${x.category || ''} ${x.id || ''}`.toLowerCase().includes(q));
  $('#visibleCount').textContent = `${items.length} / ${current().length} item`; $('#listCountLabel').textContent = `${current().length} item`;
  $('#itemList').innerHTML = items.length ? items.map(({ x, i }) => `<button class="item-row ${state.selected === i ? 'active' : ''}" data-index="${i}"><b>${esc(titleOf(x))}</b><small>${esc(x.category || 'Tanpa kategori')} · ${esc(x.id || 'item baru (belum disimpan)')}</small></button>`).join('') : '<div class="empty">Tidak ada item yang cocok.</div>';
  document.querySelectorAll('[data-index]').forEach(b => b.addEventListener('click', () => selectItem(+b.dataset.index)));
}
function dirty() { state.dirty = true; $('#dirtyState').textContent = 'Belum disimpan'; $('#dirtyState').classList.add('dirty'); }
function clean(text = 'Tersimpan') { state.dirty = false; $('#dirtyState').textContent = text; $('#dirtyState').classList.remove('dirty'); }
function categoryNames() { return [...new Set(current().map(x => x.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)); }
function populateCategories(selected = '') {
  const sel = $('#fCategorySelect');
  sel.innerHTML = '<option value="">Pilih kategori</option>' + categoryNames().map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('') + '<option value="__new__">＋ Buat kategori baru</option>';
  if (selected && !categoryNames().includes(selected)) { sel.value = '__new__'; $('#newCategoryWrap').classList.remove('hidden'); $('#fNewCategory').value = selected; } else sel.value = selected || '';
}
function selectedCategory() { return $('#fCategorySelect').value === '__new__' ? $('#fNewCategory').value.trim() : $('#fCategorySelect').value; }
function slug(s) { return String(s || 'item').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'item'; }
function makeUniqueId(title) { const base = slug(title); let id = base, n = 2; const ids = new Set(current().filter((x, i) => i !== state.selected).map(x => x.id)); while (ids.has(id)) id = base + '-' + n++; return id; }

function composePreview(files) {
  files = files || []; const h = files.find(f => f.lang === 'html'); if (!h) return '';
  let doc = h.code || '';
  const css = files.filter(f => f.lang === 'css').map(f => f.code).join('\n'), js = files.filter(f => f.lang === 'js').map(f => f.code).join('\n');
  if (css) doc = doc.replace(/<link[^>]+href=["'](?:\.\/)?[\w.-]+\.css["'][^>]*>/gi, '');
  if (js) doc = doc.replace(/<script[^>]+src=["'](?:\.\/)?[\w.-]+\.js["'][^>]*>\s*<\/script>/gi, '');
  if (!/<html[\s>]/i.test(doc)) doc = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + doc + '</body></html>';
  if (css) doc = /<\/head>/i.test(doc) ? doc.replace(/<\/head>/i, '<style>' + css + '</style></head>') : '<style>' + css + '</style>' + doc;
  if (js) doc = /<\/body>/i.test(doc) ? doc.replace(/<\/body>/i, '<script>' + js + '<\/script></body>') : doc + '<script>' + js + '<\/script>';
  return doc;
}
function filesFromForm(old) {
  let files = Array.isArray(old.files) ? old.files.map(f => ({ ...f })) : [];
  const put = (lang, filename, code) => {
    const i = files.findIndex(f => f.lang === lang);
    if (code.trim()) { if (i >= 0) files[i] = { ...files[i], lang, code }; else files.push({ lang, filename, code }); }
    else if (i >= 0 && lang !== 'html') files.splice(i, 1);
  };
  const htmlI = files.findIndex(f => f.lang === 'html'), html = $('#fCodeContent').value;
  if (htmlI >= 0) files[htmlI] = { ...files[htmlI], code: html }; else files.unshift({ lang: 'html', filename: 'index.html', code: html });
  put('css', 'style.css', $('#fCodeCss').value); put('js', 'script.js', $('#fCodeJs').value);
  return files;
}

function renderMedia() {
  const host = $('#existingMedia');
  host.innerHTML = state.media.map((u, i) => `<div class="media-thumb"><img src="${esc(u)}" alt="Media ${i + 1}"><button type="button" data-remove-media="${i}">×</button><small>${i === 0 ? (state.catalog === 'prompt' ? 'Contoh hasil' : 'Gambar utama') : 'Gambar ' + (i + 1)}</small></div>`).join('');
  host.querySelectorAll('[data-remove-media]').forEach(b => b.onclick = () => { state.media.splice(+b.dataset.removeMedia, 1); renderMedia(); dirty(); });
}
function selectItem(i) {
  state.selected = i; const x = current()[i]; state.media = Array.isArray(x.images) ? [...x.images] : x.thumbnail ? [x.thumbnail] : (x.prompts && x.prompts[0] && x.prompts[0].image ? [x.prompts[0].image] : []);
  $('#editorEmpty').classList.add('hidden'); $('#editorArea').classList.remove('hidden'); $('#editorTitle').textContent = titleOf(x);
  $('#fId').value = x.id || ''; $('#fTitle').value = x.title || '';
  populateCategories(x.category || ''); $('#fNewCategory').value = ''; if (!(x.category && !categoryNames().includes(x.category))) $('#newCategoryWrap').classList.add('hidden');
  $('#fDesc').value = state.catalog === 'code' ? (x.description || '') : (x.summary || '');
  $('#codeFields').classList.toggle('hidden', state.catalog !== 'code'); $('#promptFields').classList.toggle('hidden', state.catalog !== 'prompt');
  $('#mediaHeading').textContent = state.catalog === 'prompt' ? 'CONTOH HASIL GAMBAR (OPSIONAL)' : 'GAMBAR PREVIEW (OPSIONAL)';
  $('#mediaTip').textContent = state.catalog === 'prompt' ? 'Unggah satu gambar hasil generate dari prompt ini. Otomatis dikonversi ke WebP dan tampil di kartu serta detail prompt.' : 'Opsional. Live preview kode sudah dibuat otomatis, jadi gambar hanya untuk komponen yang tidak bisa dipratinjau.';
  $('#livePreview').classList.add('hidden'); $('#livePreview').removeAttribute('srcdoc');
  if (state.catalog === 'code') {
    const f = x.files || [], g = l => (f.find(z => z.lang === l) || {}).code || '';
    $('#fCodeContent').value = g('html'); $('#fCodeCss').value = g('css'); $('#fCodeJs').value = g('js');
  } else {
    const n = (x.prompts || []).length;
    $('#fPromptContent').value = (x.prompts || []).map(p => p.text || '').join('\n\n');
    $('#multiNote').classList.toggle('hidden', n < 2);
    $('#multiNote').textContent = n > 1 ? `Koleksi ini berisi ${n} prompt. Teks di bawah adalah gabungannya; jika Anda tidak mengubahnya, struktur asli (${n} prompt) dipertahankan.` : '';
  }
  renderMedia(); clean('Editor siap'); renderList();
}

function buildItem() {
  const old = current()[state.selected] || {}, title = $('#fTitle').value.trim(), category = selectedCategory(), desc = $('#fDesc').value.trim();
  const id = old.id || makeUniqueId(title), categoryIndex = old.categoryIndex || String(current().filter(x => x.category === category).length + 1);
  const x = { ...old, id, title, category, categoryIndex };
  if (state.catalog === 'code') {
    const files = filesFromForm(old);
    x.files = files; x.description = desc || old.description || 'Komponen HTML/CSS/JS'; x.requiresBuild = old.requiresBuild ?? false;
    if (!x.requiresBuild && (!old.preview || JSON.stringify(files) !== JSON.stringify(old.files || []))) x.preview = composePreview(files); else x.preview = old.preview || '';
    x.previewable = x.requiresBuild ? false : !!x.preview; x.source = old.source || 'R•CODE CMS';
  } else {
    const body = $('#fPromptContent').value.trim();
    const oldBody = (old.prompts || []).map(p => p.text || '').join('\n\n').trim();
    const image = state.media[0] || '';
    if ((old.prompts || []).length > 1 && body === oldBody) { x.prompts = old.prompts.map(p => ({ ...p })); x.raw = old.raw || body; }
    else { x.prompts = body ? [{ title: title || 'Prompt', text: body, ...(image ? { image } : {}) }] : []; x.raw = body; }
    x.summary = desc || (x.prompts.length === 1 ? body.slice(0, 180) : (old.summary || body.slice(0, 180)));
    x.countLabel = `${x.prompts.length} prompt`; x.source = old.source || 'R•CODE CMS';
  }
  if (state.media.length) { x.images = [...state.media]; x.thumbnail = state.media[0]; } else { delete x.images; delete x.thumbnail; }
  if (state.catalog === 'prompt' && x.prompts.length === 1 && !state.media.length) delete x.prompts[0].image;
  return x;
}
function validate(x) {
  if (!x.title || !x.category) throw Error('Judul dan kategori wajib diisi.');
  if (state.catalog === 'code' && !x.files.some(f => f.code.trim())) throw Error('Isi code HTML belum diisi.');
  if (state.catalog === 'prompt' && !x.prompts.length) throw Error('Isi prompt belum diisi.');
  if (current().some((v, i) => i !== state.selected && v.id === x.id)) throw Error('ID sudah digunakan item lain.');
}

// Simpan SATU item. Item lain di server tidak disentuh.
async function saveItem() {
  const btn = $('#saveItemBtn'); btn.disabled = true;
  try {
    if (state.selected === null) throw Error('Pilih atau buat item terlebih dahulu.');
    const x = buildItem(); validate(x);
    const isNew = current()[state.selected] === state.newRef;
    status('Menyimpan item ke GitHub…');
    await api('/api/github/item', { method: 'POST', body: { catalog: state.catalog, item: x, isNew } });
    current()[state.selected] = x; if (isNew) state.newRef = null;
    renderCounts(); selectItem(state.selected); clean('Tersimpan');
    status(isNew ? 'Item baru tersimpan dan tampil paling atas (±1 menit di situs).' : 'Perubahan tersimpan (±1 menit sampai tampil di situs).', 'ok');
  } catch (e) { status(e.message, 'error'); alert('Belum berhasil disimpan: ' + e.message); }
  finally { btn.disabled = false; }
}

// Terapkan seluruh katalog (dipakai setelah Import JSON).
async function saveAll() {
  try {
    const list = current().filter(x => x && x.id && x.title);
    const ids = new Set(); for (const x of list) { if (ids.has(x.id)) throw Error('ID duplikat: ' + x.id); ids.add(x.id); }
    if (!confirm(`Terapkan ${list.length} item ke GitHub dan menggantikan seluruh isi katalog ${titles[state.catalog]}?`)) return;
    status('Menyimpan katalog ke GitHub…');
    const body = { path: paths[state.catalog], content: JSON.stringify(list, null, 2), message: `CMS: Replace ${titles[state.catalog]} (${list.length} items)` };
    try { await api('/api/github/save', { method: 'POST', body }); }
    catch (e) {
      if (e.data && e.data.shrink) { if (!confirm(e.message + '\n\nTetap simpan?')) { status('Dibatalkan.'); return; } await api('/api/github/save', { method: 'POST', body: { ...body, force: true } }); }
      else throw e;
    }
    state.data[state.catalog] = list; state.selected = null; state.newRef = null;
    $('#editorArea').classList.add('hidden'); $('#editorEmpty').classList.remove('hidden'); renderCounts(); renderList(); clean(); status('Seluruh katalog tersimpan.', 'ok');
  } catch (e) { status(e.message, 'error'); alert('Belum berhasil disimpan: ' + e.message); }
}

function newItem() {
  const x = state.catalog === 'code'
    ? { id: '', title: '', category: '', categoryIndex: '', description: '', files: [{ lang: 'html', filename: 'index.html', code: '' }], preview: '', previewable: true, requiresBuild: false, source: 'R•CODE CMS', createdAt: new Date().toISOString() }
    : { id: '', title: '', category: '', categoryIndex: '', summary: '', source: 'R•CODE CMS', raw: '', prompts: [], countLabel: '0 prompt', createdAt: new Date().toISOString() };
  if (state.newRef) { const k = current().indexOf(state.newRef); if (k >= 0) current().splice(k, 1); }
  current().unshift(x); state.newRef = x; state.selected = 0; renderCounts(); selectItem(0); $('#fTitle').focus();
  status('Isi judul, kategori, dan konten, lalu tekan Simpan perubahan.');
}
async function deleteItem() {
  if (state.selected === null) return; const x = current()[state.selected];
  if (!confirm(`Hapus "${titleOf(x)}" dari GitHub? Tindakan ini membuat commit baru (masih bisa dipulihkan dari Riwayat).`)) return;
  try {
    if (x !== state.newRef) { status('Menghapus item…'); await api('/api/github/item-delete', { method: 'POST', body: { catalog: state.catalog, id: x.id } }); }
    else state.newRef = null;
    current().splice(state.selected, 1); state.selected = null; $('#editorArea').classList.add('hidden'); $('#editorEmpty').classList.remove('hidden'); renderCounts(); renderList(); clean(); status('Item dihapus.', 'ok');
  } catch (e) { status(e.message, 'error'); alert('Gagal menghapus: ' + e.message); }
}
function exportCatalog() { const b = new Blob([JSON.stringify(current(), null, 2)], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = paths[state.catalog].split('/').pop(); a.click(); URL.revokeObjectURL(a.href); }
async function importCatalog(file) {
  try { const a = JSON.parse(await file.text()); if (!Array.isArray(a) || !confirm(`Ganti draft katalog dengan ${a.length} item? (Belum dikirim ke GitHub sampai Anda menekan "Terapkan seluruh katalog".)`)) return; state.data[state.catalog] = a; state.selected = null; state.newRef = null; $('#editorArea').classList.add('hidden'); $('#editorEmpty').classList.remove('hidden'); renderCounts(); renderList(); status('Import menjadi draft. Tekan "Terapkan seluruh katalog" untuk menyimpan.'); }
  catch (e) { alert('Import gagal: ' + e.message); }
}

// ---- gambar ----
async function toWebp(file) {
  if (!file.type.startsWith('image/')) throw Error('File bukan gambar.');
  const bmp = await createImageBitmap(file); const scale = Math.min(1, 2200 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale); c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); bmp.close();
  let blob = await new Promise((res, rej) => c.toBlob(b => b ? res(b) : rej(Error('Browser tidak dapat membuat WebP')), 'image/webp', .84));
  if (blob.size > 3 * 1024 * 1024) blob = await new Promise((res, rej) => c.toBlob(b => b ? res(b) : rej(Error('Browser tidak dapat membuat WebP')), 'image/webp', .6));
  if (blob.size > 3 * 1024 * 1024) throw Error('Gambar hasil konversi masih lebih dari 3 MB. Gunakan gambar lebih kecil.');
  return blob;
}
async function uploadWebp(file, folder, base) {
  const blob = await toWebp(file);
  const dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(Error('Gagal membaca gambar')); r.readAsDataURL(blob); });
  const name = `${slug(base)}-${Date.now()}.webp`;
  const d = await api('/api/media/upload', { method: 'POST', body: { path: `media/${folder}/${name}`, data: dataUrl, mimeType: 'image/webp' } });
  return d.url || `${API}/${d.path}`;
}

// ---- Gambar Situs ----
function renderSite() {
  $('#siteGrid').innerHTML = SLOTS.map(s => {
    const custom = state.site[s.key], src = custom || s.def || '';
    return `<div class="site-card"><div class="site-thumb" style="--ratio:${s.ratio}">${src ? `<img src="${esc(src)}" alt="" onerror="this.remove()">` : ''}<span>${custom ? '' : (s.def ? 'BAWAAN' : 'KOSONG')}</span></div><div><b>${esc(s.label)}</b><br><small>${esc(s.hint)} · ${custom ? 'gambar kustom' : s.def ? 'memakai gambar bawaan' : 'placeholder'}</small></div><div class="row"><button class="btn primary" data-site-up="${s.key}" type="button">${custom ? 'Ganti' : 'Unggah'}</button>${custom ? `<button class="btn danger" data-site-clear="${s.key}" type="button">${s.def ? 'Kembalikan bawaan' : 'Hapus'}</button>` : ''}</div></div>`;
  }).join('');
  document.querySelectorAll('[data-site-up]').forEach(b => b.onclick = () => { state.siteSlot = b.dataset.siteUp; $('#siteFile').click(); });
  document.querySelectorAll('[data-site-clear]').forEach(b => b.onclick = async () => {
    if (!confirm('Hapus gambar kustom untuk slot ini?')) return;
    try { status('Menghapus gambar slot…'); const d = await api('/api/github/site-media', { method: 'POST', body: { slot: b.dataset.siteClear, url: null } }); state.site = d.slots; renderSite(); renderCounts(); status('Slot dikembalikan.', 'ok'); } catch (e) { status(e.message, 'error'); alert(e.message); }
  });
}
async function uploadSiteImage(file) {
  const slot = state.siteSlot; if (!slot || !file) return;
  try {
    status(`Mengunggah gambar untuk ${slot}…`);
    const url = await uploadWebp(file, 'site', slot);
    const d = await api('/api/github/site-media', { method: 'POST', body: { slot, url } });
    state.site = d.slots; renderSite(); renderCounts(); status('Gambar tersimpan. Tampil di situs dalam ±1 menit.', 'ok');
  } catch (e) { status(e.message, 'error'); alert('Upload gagal: ' + e.message); }
}

// ---- Riwayat ----
async function showHistory() {
  if (state.catalog === 'site') { alert('Riwayat tersedia untuk Code Library dan Prompt Library.'); return; }
  const ov = document.createElement('div'); ov.className = 'hist-overlay'; ov.innerHTML = `<div class="hist-box"><h3>Riwayat ${titles[state.catalog]}</h3><p class="editor-tip">20 penyimpanan terakhir. "Pulihkan" mengembalikan seluruh katalog ke versi tersebut (dibuat sebagai commit baru).</p><div id="histList">Memuat…</div><div style="margin-top:14px"><button class="btn ghost" id="histClose" type="button">Tutup</button></div></div>`;
  document.body.appendChild(ov); ov.querySelector('#histClose').onclick = () => ov.remove(); ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  try {
    const d = await api('/api/github/history?catalog=' + state.catalog);
    ov.querySelector('#histList').innerHTML = d.commits.map(c => `<div class="hist-row"><span>${esc(c.message)}<small>${c.date ? new Date(c.date).toLocaleString('id-ID') : ''} · ${c.sha.slice(0, 7)}</small></span><button class="btn ghost" data-restore="${c.sha}" type="button">Pulihkan</button></div>`).join('') || 'Belum ada riwayat.';
    ov.querySelectorAll('[data-restore]').forEach(b => b.onclick = async () => {
      if (!confirm('Pulihkan seluruh katalog ke versi ini? Isi katalog saat ini akan digantikan (tetap tersimpan di riwayat).')) return;
      try { b.disabled = true; const r = await api('/api/github/restore', { method: 'POST', body: { catalog: state.catalog, sha: b.dataset.restore } }); ov.remove(); await loadAll(); status(`Katalog dipulihkan (${r.total} item).`, 'ok'); } catch (e) { b.disabled = false; alert('Gagal memulihkan: ' + e.message); }
    });
  } catch (e) { ov.querySelector('#histList').textContent = 'Gagal memuat riwayat: ' + e.message; }
}

// ---- wiring ----
$('#loginForm').addEventListener('submit', async e => { e.preventDefault(); const b = e.submitter; b.disabled = true; $('#loginMessage').textContent = 'Memverifikasi…'; try { await login($('#password').value); $('#password').value = ''; $('#loginMessage').textContent = ''; } catch (err) { $('#loginMessage').textContent = err.message; setConnection(false, 'Login gagal'); } finally { b.disabled = false; } });
$('#logoutBtn').onclick = logout;
function switchCatalog(c, btn) {
  if (state.dirty && !confirm('Ada perubahan yang belum disimpan. Pindah tab dan buang perubahan?')) return;
  state.catalog = c; state.selected = null; state.newRef = null; clean('Tidak ada perubahan');
  document.querySelectorAll('[data-catalog]').forEach(n => n.classList.toggle('active', n === btn));
  const site = c === 'site';
  $('#sitePanel').classList.toggle('hidden', !site);
  document.querySelectorAll('.workspace > .content:not(#sitePanel)').forEach(el => el.classList.toggle('hidden', site));
  if (site) { renderSite(); return; }
  $('#catalogTitle').textContent = titles[c]; $('#catalogDesc').textContent = labels[c]; $('#catalogEyebrow').textContent = c === 'code' ? 'CATALOG / 01' : 'CATALOG / 02';
  $('#editorArea').classList.add('hidden'); $('#editorEmpty').classList.remove('hidden'); $('#searchInput').value = ''; renderList();
}
document.querySelectorAll('[data-catalog]').forEach(b => b.onclick = () => switchCatalog(b.dataset.catalog, b));
$('#searchInput').oninput = renderList;
$('#newItemBtn').onclick = () => { newItem(); $('#itemListPanel').classList.add('hidden'); $('#listToggleBtn').setAttribute('aria-expanded', 'false'); $('#listToggleHint').textContent = 'Buka untuk memilih atau mencari item'; $('#editorArea').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
$('#listToggleBtn').onclick = () => { const panel = $('#itemListPanel'), opening = panel.classList.contains('hidden'); panel.classList.toggle('hidden', !opening); $('#listToggleBtn').setAttribute('aria-expanded', String(opening)); $('#listToggleHint').textContent = opening ? 'Daftar sedang terbuka' : 'Buka untuk memilih atau mencari item'; };
$('#saveItemBtn').onclick = saveItem; $('#saveAllBtn').onclick = saveAll; $('#deleteBtn').onclick = deleteItem;
$('#refreshBtn').onclick = () => { if (state.dirty && !confirm('Perubahan belum disimpan akan hilang. Lanjut refresh?')) return; clean('Tidak ada perubahan'); loadAll().catch(() => {}); };
$('#exportBtn').onclick = exportCatalog; $('#importBtn').onclick = () => $('#importFile').click(); $('#importFile').onchange = e => { if (e.target.files[0]) importCatalog(e.target.files[0]); e.target.value = ''; };
$('#historyBtn').onclick = showHistory;
$('#siteFile').onchange = e => { const f = e.target.files[0]; e.target.value = ''; uploadSiteImage(f); };
['fTitle', 'fDesc', 'fCodeContent', 'fCodeCss', 'fCodeJs', 'fPromptContent', 'fNewCategory'].forEach(id => $('#' + id).addEventListener('input', dirty));
$('#fCategorySelect').onchange = () => { const isNew = $('#fCategorySelect').value === '__new__'; $('#newCategoryWrap').classList.toggle('hidden', !isNew); if (isNew) $('#fNewCategory').focus(); dirty(); };
$('#codeFileUpload').onchange = async e => { const f = e.target.files[0]; if (!f) return; $('#fCodeContent').value = await f.text(); dirty(); e.target.value = ''; };
$('#previewBtn').onclick = () => { const files = filesFromForm(current()[state.selected] || {}); const f = $('#livePreview'); f.classList.remove('hidden'); f.srcdoc = composePreview(files) || '<p style="font:14px sans-serif;padding:20px">Isi code HTML terlebih dahulu.</p>'; };
$('#mediaFiles').onchange = async e => {
  const files = [...e.target.files]; e.target.value = '';
  if (files.length > 1) { alert('Unggah satu gambar untuk setiap item.'); return; }
  if (!files.length) return;
  try { status('Mengunggah gambar…'); const base = $('#fTitle').value.trim() || current()[state.selected]?.id || 'item'; const url = await uploadWebp(files[0], state.catalog === 'code' ? 'code-library' : 'prompt-library', base); state.media = [url]; renderMedia(); dirty(); status('Gambar terunggah. Tekan Simpan perubahan untuk menautkannya ke item.', 'ok'); }
  catch (err) { status(err.message, 'error'); alert('Upload gambar gagal: ' + err.message); }
};
window.addEventListener('beforeunload', e => { if (state.dirty) { e.preventDefault(); e.returnValue = ''; } });
(async () => {
  try { const h = await api('/api/health', { auth: false }); setConnection(!!h.success, 'API online'); } catch { setConnection(false, 'API tidak terjangkau'); }
  if (state.token) { try { showDashboard(); await loadAll(); } catch { state.token = ''; sessionStorage.removeItem('rcode_cms_token'); showLogin(); $('#loginMessage').textContent = 'Sesi berakhir. Silakan login kembali.'; } } else showLogin();
})();
})();
