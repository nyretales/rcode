/* R•CODE CMS — halaman login Neumorphism: tema terang/gelap, lihat password, mode login */
(function () {
  var root = document.documentElement, KEY = 'rcode_neu_theme';
  var COLORS = { light: '#e4ebea', dark: '#121a19' };
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var theme = (saved === 'light' || saved === 'dark') ? saved
    : (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-neu', theme);

  var meta, original;
  function setMeta(inLogin) {
    if (!meta) return;
    meta.setAttribute('content', inLogin ? COLORS[root.getAttribute('data-neu')] : original);
  }
  function applyTheme(t, persist) {
    root.setAttribute('data-neu', t);
    if (persist) { try { localStorage.setItem(KEY, t); } catch (e) {} }
    var b = document.getElementById('themeToggle');
    if (b) b.setAttribute('aria-label', t === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap');
    setMeta(document.body.classList.contains('login-mode'));
  }

  document.addEventListener('DOMContentLoaded', function () {
    meta = document.querySelector('meta[name="theme-color"]');
    original = meta ? meta.getAttribute('content') : '';
    var view = document.getElementById('loginView');
    function sync() {
      var inLogin = !!view && !view.classList.contains('hidden');
      document.body.classList.toggle('login-mode', inLogin);
      setMeta(inLogin);
    }
    if (view) { sync(); new MutationObserver(sync).observe(view, { attributes: true, attributeFilter: ['class'] }); }

    var tb = document.getElementById('themeToggle');
    if (tb) tb.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-neu') === 'dark' ? 'light' : 'dark', true);
    });
    applyTheme(theme, false);

    var pw = document.getElementById('password'), eye = document.getElementById('pwToggle');
    if (pw && eye) eye.addEventListener('click', function () {
      var show = pw.type === 'password';
      pw.type = show ? 'text' : 'password';
      eye.setAttribute('aria-pressed', String(show));
      eye.setAttribute('aria-label', show ? 'Sembunyikan password' : 'Tampilkan password');
      eye.classList.toggle('on', show);
    });
  });
})();
