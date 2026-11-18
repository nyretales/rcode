# R•CODE — Asset & Content Renaming Roadmap (V1.3)

Tujuan: aset placeholder sekarang memiliki nama stabil. Saat materi final tersedia, ganti file dengan nama dan ekstensi yang sama agar referensi di HTML/CSS/JS tidak perlu diedit.

## 1. Aturan nama
- Gunakan huruf kecil, angka, dan tanda hubung (`kebab-case`).
- Hindari nama acak/hash, spasi, tanggal yang tidak perlu, dan nama brand lama.
- Nama file harus menggambarkan lokasi/fungsi, bukan isi sementara.
- Pertahankan ekstensi file yang dipakai di referensi. Jika format berubah, konversi ke ekstensi yang sama atau perbarui referensinya.
- Jangan rename file bundle `assets/*.js` dan `assets/*.css` secara manual. Nama hash adalah bagian dari referensi build; biarkan sampai proses build ulang.

## 2. Slot visual utama
| Slot | Nama final yang disarankan | Format | Status |
|---|---|---|---|
| Hero phone 01 | `hero-code-preview-01.webp` | WEBP | Placeholder CSS saat ini |
| Hero phone 02 | `hero-code-preview-02.webp` | WEBP | Placeholder CSS saat ini |
| Hero phone 03 | `hero-code-preview-03.webp` | WEBP | Placeholder CSS saat ini |
| Hero phone 04 | `hero-code-preview-04.webp` | WEBP | Placeholder CSS saat ini |
| Hero phone 05–08 | `hero-code-preview-05.webp` … `08.webp` | WEBP | Placeholder CSS saat ini |
| Free code card | `free-code-preview.webp` | WEBP | Placeholder CSS saat ini |
| Prompt library card | `prompt-library-preview.webp` | WEBP | Placeholder CSS saat ini |
| ZonaGreen card | `zonagreen-lab-preview.webp` | WEBP | Placeholder CSS saat ini |
| Experiments card | `experiments-preview.webp` | WEBP | Placeholder CSS saat ini |
| ZonaGreen Web Book cover | `zgcl-jersey-fundamentals-cover.webp` | WEBP | Belum dibuat |
| Jersey template pack | `zgcl-jersey-templates-pack.webp` | WEBP | Belum dibuat |
| Production checklist | `zgcl-production-checklist.webp` | WEBP | Belum dibuat |
| R•CODE social preview | `rcode-og-image.jpg` | JPG 1200×630 | Perlu finalisasi |
| Owner portrait | `hadier-al-ghanie-portrait.webp` | WEBP | Opsional, belum tersedia |

## 3. Video slots
| Slot | Nama final | Format | Status |
|---|---|---|---|
| Hero preview | `hero-showreel.mp4` | MP4 | Belum tersedia |
| Free code demo | `free-code-demo.mp4` | MP4 | Belum tersedia |
| ZonaGreen walkthrough | `zonagreen-webbook-demo.mp4` | MP4 | Belum tersedia |
| Project case study | `project-[slug]-preview.mp4` | MP4 | Dibuat per proyek |

## 4. Folder aset saat konten mulai diisi
```text
assets/
  brand/       # logo, favicon, social preview
  images/      # gambar hero, card, cover, portrait
  videos/      # video preview dan demo
  downloads/   # file contoh yang dapat diunduh
```
Saat ini gambar/video konten belum dibuat; komponen memakai placeholder CSS agar tidak ada media Me20 yang tersisa atau dikira sebagai karya R•CODE.

## 5. Penggantian tanpa edit kode
1. Siapkan file baru dengan nama slot yang tepat.
2. Simpan pada folder aset sesuai roadmap.
3. Saat slot diaktifkan, gunakan path tetap tersebut satu kali pada komponen terkait.
4. Setelah path ditetapkan, penggantian berikutnya cukup menimpa file dengan nama sama.
5. Jangan mengganti ekstensi diam-diam (`.jpg` menjadi `.webp`) tanpa memperbarui referensi.

## 6. Yang tidak perlu di-rename manual
- `assets/*.js` dan `assets/*.css`: bundle runtime hasil build.
- Nama folder `free/` dan `demo/`: sudah menggambarkan kategori.
- File legal dan halaman HTML: nama file URL publik; ubah hanya jika juga memperbarui semua link.
