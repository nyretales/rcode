# R•CODE IMAGINATION — Static Concept V1.3

Konsep ini mempertahankan bahasa visual dan komponen utama website Me20 yang diberikan sebagai template: hero phone carousel, glass cards, hover navigation, fixed mobile dock, reveal effects, typography, dan ritme layout. Konten lama yang tidak relevan telah disederhanakan.

## Arah R•CODE
- Hadier Al Ghanie — Independent Web Designer & Developer.
- Building spaces from imagination.
- AI digunakan sebagai alat bantu; konsep, arahan desain, dan keputusan akhir tetap berada pada Hadier.
- Berbagi kode HTML/CSS/JS gratis, termasuk navbar, glassmorphism, claymorphism, dan eksperimen UI.
- Membagikan prompt gratis.
- Mengembangkan ZonaGreen Creative Lab sebagai ruang belajar dan sumber daya digital untuk desainer apparel, jersey, DTF, sablon, dan sublimasi.

## Menjalankan lokal
1. Ekstrak ZIP.
2. Buka folder di VS Code.
3. Jalankan `index.html` dengan Live Server.
4. Navigasi utama berada pada satu halaman; menu mengarah ke section ID.

## Deploy Vercel nanti
- Framework preset: Other
- Build command: kosongkan
- Output directory: `.`
- Root directory: folder proyek ini
Belum disiapkan untuk deployment final; lakukan QA dan cek semua link terlebih dahulu.

## Isi paket yang dipertahankan
- `index.html` sebagai homepage utama.
- `assets/styles-ChRMwuVM.css` untuk sistem visual template, serta `assets/rcode-interactions.js` untuk indikator navbar, carousel phone, dan fallback reveal. Bundle lama tetap disimpan hanya untuk halaman resource/demo yang masih memerlukannya; homepage tidak menjalankan hydration lama agar konten R•CODE tidak tertimpa data template.
- `free/` dan `demo/` untuk contoh resource kode dan demo interaktif yang relevan.
- `shop.html` sebagai etalase kosong sementara.
- `privacy.html` dan `terms.html` sebagai draft yang wajib ditinjau ulang sebelum publikasi.

## Yang sengaja dihapus
- Galeri portofolio, artikel, media, dan halaman bahasa Ukraina milik template yang belum relevan dengan konten R•CODE.
- Gambar dan video promosi lama yang dapat disalahartikan sebagai karya R•CODE.
- Tracker/analytics mirror yang tidak diperlukan untuk versi konsep.

## Placeholder
Gambar/video yang belum tersedia menggunakan placeholder CSS kosong. Tidak ada media Me20 lama yang dipertahankan sebagai karya R•CODE.
Lihat `ASSET-RENAME-ROADMAP.md` untuk nama slot aset yang akan digunakan saat materi final tersedia. Lihat `ROADMAP-90-HARI.md` untuk urutan pengembangan R•CODE dan ZonaGreen Creative Lab.

## Kontak yang dikonfirmasi
- Email: hadierag@gmail.com
- WhatsApp: +62 823-1952-7214
- Instagram: @rcode.imagination
- Domain target: arungpalakka.com

## Catatan teknis penting
File JavaScript dan CSS di folder `assets/` merupakan bundle hasil build yang dipertahankan agar interaksi template tidak hilang. Jangan mengganti nama bundle secara manual. Beberapa demo gratis masih merupakan halaman contoh dari template; tinjau atribusi/lisensi dan sesuaikan nama serta kontennya sebelum dibagikan publik.


## Free Resource Libraries

- `code-library.html` — koleksi komponen HTML/CSS/JavaScript dengan live preview, source files, dan tombol copy.
- `prompt-library.html` — 60 koleksi prompt, kartu koleksi, detail prompt satu per satu, pencarian, kategori, dan tombol copy.
- `data/code-library.json` dan `data/prompt-library.json` — data sumber perpustakaan.
- `assets/library.css`, `assets/code-library.js`, `assets/prompt-library.js` — antarmuka dan interaksi katalog.

Buka `index.html` melalui Live Server. Katalog membutuhkan akses ke file JSON lokal, jadi jangan membuka halaman katalog dengan `file://`; gunakan Live Server atau static hosting (Vercel).

## Resource library contents (V1.4)

The free resource section now uses the two supplied collections as source material:

- `html.md` is represented in `data/code-library.json` as 27 UI/code projects with 49 source files. Most projects have a sandboxed live preview; the React + Vite example is shown as a source/build-required project.
- `prompt.md` is represented in `data/prompt-library.json` as 60 collections and more than 4,600 individually copyable prompt/use-case entries. Original collection text is retained for reference and full-collection copying.
- `code-library.html` and `prompt-library.html` are separate static catalogue pages. Both include search, category filters, detail views, and copy controls.
- `assets/library.css`, `assets/code-library.js`, and `assets/prompt-library.js` power the catalogue interfaces.

For local testing, run the project through VS Code Live Server or `python -m http.server`; JSON data is loaded with `fetch`, so opening the pages directly via `file://` is not supported. The project is compatible with static hosting such as Vercel.

### Replacing a resource later

Keep each project ID and JSON structure stable. To update a code sample, edit its entry in `data/code-library.json`; to update a prompt collection, edit the matching entry in `data/prompt-library.json`. The cards, previews, and copy controls read from these data files, so content can be updated without redesigning the catalogue UI.
