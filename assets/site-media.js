/* R•CODE — gambar situs yang diatur dari Admin > Gambar Situs.
   Setiap elemen [data-site-slot="nama"] otomatis diisi gambar jika slot tersebut sudah diunggah.
   Jika belum, placeholder/gambar bawaan tetap tampil. */
(() => {
  const API = 'https://rcode-cms-api.nyretales.workers.dev';
  const st = document.createElement('style');
  st.textContent = '.rcode-content-placeholder.has-media:before,.rcode-content-placeholder.has-media:after{display:none!important}.rcode-content-placeholder.has-media{border-style:solid}';
  document.head.appendChild(st);
  fetch(API + '/api/public/site-media')
    .then(r => r.json())
    .then(map => {
      document.querySelectorAll('[data-site-slot]').forEach(el => {
        const url = map && map[el.dataset.siteSlot];
        if (!url) return;
        let img = el.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          img.alt = el.getAttribute('aria-label') || '';
          img.loading = 'lazy';
          img.decoding = 'async';
          el.appendChild(img);
        }
        img.removeAttribute('onerror');
        img.removeAttribute('srcset');
        img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block';
        img.src = url;
        el.classList.add('has-img', 'has-media');
      });
    })
    .catch(() => {});
})();
