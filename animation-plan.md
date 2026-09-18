# Rencana Animasi Transisi — Portfolio Next.js

Dokumen ini adalah spesifikasi kerja untuk menganimasikan seluruh transisi di website ini:
toggle bahasa, toggle tema gelap/terang, dan perpindahan halaman. Ditulis agar bisa langsung
dieksekusi tanpa perlu eksplorasi ulang.

---

## 0. Kondisi saat ini (hasil audit)

| Hal | Kondisi | Berkas |
|---|---|---|
| Toggle tema | Menukar class `.dark` di `<html>` secara instan | `context/ThemeContext.tsx:33-38` |
| Toggle bahasa | `setLangState` langsung, React re-render seketika | `context/LanguageContext.tsx:27-31` |
| Perpindahan halaman | Tidak ada `template.tsx`, tidak ada animasi apa pun | `app/` |
| Warna tema | Token CSS di `:root` dan `.dark` | `app/globals.css:5-33` |
| Transisi warna | Hanya `body` (bg + color, 300ms) | `app/globals.css:43` + `app/layout.tsx:35` |
| Kartu | `.bento-card` sudah punya `transition: all .3s` | `app/globals.css:52` |
| Menu mobile | **Sudah dianimasikan** — pakai pola ini sebagai acuan gaya | `components/Navbar.tsx` |

Rute yang ada: `/`, `/project/[slug]`, dan `/admin/*`.

---

## 1. ⚠️ Batasan teknis yang menentukan segalanya

**Proyek ini memakai React 18.3.1 dengan Next.js 16.3.0.**

Ini wajib diketahui sebelum memilih pendekatan, karena mematikan dua opsi yang biasanya
jadi jawaban pertama untuk animasi transisi halaman di Next.js modern:

- ❌ Komponen `<ViewTransition>` dari React — butuh React 19 channel experimental.
- ❌ Flag `experimental.viewTransition` di `next.config.mjs` — butuh React 19 experimental.

Yang **tetap bisa dipakai**: View Transitions API bawaan browser
(`document.startViewTransition`) dipanggil langsung. Ini API browser, bukan fitur React,
jadi tidak terpengaruh versi React.

> **Keputusan yang harus diambil di awal:** apakah React mau di-upgrade ke 19 atau tidak.
> Jika tidak (disarankan, karena upgrade React mayor berisiko menyentuh seluruh aplikasi
> yang sudah live), ikuti rencana ini apa adanya. Jika ya, kerjakan upgrade sebagai tugas
> terpisah dan tuntas dulu, jangan dicampur dengan pekerjaan animasi.

---

## 2. Fondasi — kerjakan paling awal

### 2a. Perbaiki flash tema saat halaman dimuat (prasyarat)

`ThemeContext` baru membaca `localStorage` di dalam `useEffect`, artinya **setelah** render
pertama. Akibatnya halaman sempat tampil terang sepersekian detik sebelum melompat ke gelap.

Ini harus dibereskan **sebelum** menganimasikan tema. Kalau tidak, animasi justru membuat
kedipan itu makin kentara — bukannya membaik, malah memburuk.

Perbaikannya: sisipkan script blocking di `<head>` pada `app/layout.tsx` yang memasang class
tema sebelum browser melukis frame pertama.

```tsx
// app/layout.tsx — di dalam <html>, sebelum <body>
<head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(){try{var t=localStorage.getItem('theme');
        if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
        document.documentElement.classList.toggle('dark',t==='dark');
        document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
    }}
  />
</head>
```

`suppressHydrationWarning` sudah terpasang di `<html>` (`app/layout.tsx:34`), jadi tidak
ada peringatan hidrasi. Setelah ini, `useEffect` di `ThemeContext` cukup menyelaraskan
state React dengan class yang sudah ada, bukan lagi yang menentukan tema.

### 2b. Token gerak terpusat

Tambahkan di `app/globals.css` (blok `:root`) supaya durasi dan easing konsisten,
tidak bertebaran sebagai angka acak:

```css
--ease-out-quint: cubic-bezier(0.16, 1, 0.3, 1);
--dur-fast: 150ms;
--dur-base: 300ms;
--dur-slow: 500ms;
```

Catatan: `cubic-bezier(0.16, 1, 0.3, 1)` sudah dipakai `.bento-card` (`globals.css:52`).
Jadikan itu easing default agar seluruh situs terasa satu bahasa.

### 2c. Hormati `prefers-reduced-motion`

Wajib, bukan opsional. Sebagian orang mengalami mual atau pusing karena animasi.
Tambahkan di `app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none !important; }
}
```

Untuk komponen individual, pakai varian Tailwind `motion-reduce:transition-none`
seperti yang sudah dipakai di `components/Navbar.tsx`.

---

## 3. Toggle tema gelap/terang

### Target
Tema menyapu masuk dari tombolnya sebagai lingkaran yang membesar, bukan berkedip berganti.

### Pendekatan: circular reveal via View Transitions API

**Langkah 1 —** `components/Navbar.tsx:69-75`: kirim koordinat klik ke `toggleTheme`,
karena lingkaran harus bermula tepat dari tombolnya.

```tsx
onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
```

**Langkah 2 —** `context/ThemeContext.tsx`: bungkus perubahan class di dalam
`document.startViewTransition`, lalu animasikan `clip-path`.

```tsx
const toggleTheme = async (origin?: { x: number; y: number }) => {
  const next = theme === 'light' ? 'dark' : 'light';

  // Fallback: browser tanpa View Transitions API tetap berfungsi, hanya tanpa efek.
  if (!document.startViewTransition || !origin) { setTheme(next); return; }

  const transition = document.startViewTransition(() => {
    flushSync(() => setTheme(next));   // flushSync WAJIB — lihat catatan di bawah
  });

  await transition.ready;

  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
    { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      pseudoElement: '::view-transition-new(root)' }
  );
};
```

> **Gotcha React 18:** `setTheme` di dalam callback `startViewTransition` bersifat asinkron,
> sehingga browser mengambil snapshot **sebelum** React sempat render. Hasilnya animasi
> tidak terjadi. Bungkus dengan `flushSync` dari `react-dom` agar render dipaksa sinkron.
> Ini penyebab kegagalan paling umum pada pola ini dan sulit didiagnosis.

**Langkah 3 —** `app/globals.css`: matikan crossfade bawaan agar tidak menumpuk
dengan clip-path.

```css
::view-transition-old(root),
::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
::view-transition-old(root) { z-index: 1; }
::view-transition-new(root) { z-index: 2; }
```

> **Gotcha konflik:** `body` sudah punya `transition: background-color .3s` (`globals.css:43`)
> dan `layout.tsx:35` punya `transition-colors duration-300`. Keduanya akan bertarung dengan
> circular reveal dan membuat hasilnya kotor. Pilih salah satu — kalau memakai reveal,
> hapus transisi warna pada `body`, dan hapus juga duplikasinya di `layout.tsx`
> (dua-duanya mengatur hal yang sama, memang sudah redundan sejak awal).

**Langkah 4 —** ikon Sun/Moon (`Navbar.tsx:74`) masih berganti mendadak. Pakai ulang pola
dua ikon ditumpuk yang sudah ada di tombol burger pada berkas yang sama — salah satu memudar
dan berputar keluar, satunya masuk.

### Kalau tidak memakai View Transitions
Alternatif sederhana: beri `transition-colors duration-300` pada komponen permukaan utama
(`Hero`, `About`, `Projects`, `Skills`, `Education`, `ContactForm`, `Footer`).

> **Jangan** memakai `* { transition: all 0.3s }`. Itu memaksa browser mengawasi setiap
> properti di setiap elemen, membuat scroll tersendat di ponsel, dan ikut menganimasikan
> hal-hal yang seharusnya instan seperti `transform` pada hover.

### Catatan penting
Sebagian besar komponen memakai class Tailwind `dark:` langsung dengan nilai hardcoded
(contoh: `dark:bg-[#141417]` di `components/Hero.tsx:33`), bukan token CSS var. Class seperti
itu **tidak ikut bertransisi** kecuali diberi `transition-colors` eksplisit. Inilah sebab
pergantian tema terasa patah walau `body` sudah punya transisi. Circular reveal menutupi
masalah ini sepenuhnya, dan itu alasan utama pendekatan tersebut direkomendasikan.

---

## 4. Toggle bahasa

### Target
Teks memudar halus saat berganti bahasa, tidak berkedip mengganti.

### Tantangan khusus
Panjang teks ID dan EN berbeda, jadi tinggi elemen bisa berubah. Animasi yang ikut
menganimasikan tinggi akan membuat seluruh halaman bergoyang. **Animasikan opacity saja**,
biarkan pergeseran tata letak terjadi di titik teks sudah transparan.

### Pendekatan A — crossfade global (disarankan, tanpa dependensi)

Di `context/LanguageContext.tsx`, tunda pergantian bahasa sampai fade-out selesai:

```tsx
const [fading, setFading] = useState(false);

const setLang = (newLang: Language) => {
  setFading(true);
  setTimeout(() => {
    setLangState(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.lang = newLang;
    setFading(false);
  }, 150);              // samakan dengan --dur-fast
};
```

Ekspos `fading` lewat context, lalu di `app/layout.tsx` (atau pembungkus client di dalamnya)
pasang pada wadah konten:

```tsx
className={`transition-opacity duration-150 motion-reduce:transition-none
  ${fading ? 'opacity-0' : 'opacity-100'}`}
```

Total terasa ~300ms: 150ms keluar, 150ms masuk.

> **Gotcha:** `setLang` dipanggil juga di `useEffect` awal saat memuat bahasa tersimpan
> (`LanguageContext.tsx:19-25`). Jangan sampai crossfade ikut berjalan saat halaman baru
> dibuka — di sana panggil `setLangState` langsung, bukan `setLang`.

### Pendekatan B — View Transitions API
Lebih ringkas jika langkah 3 sudah dikerjakan:

```tsx
document.startViewTransition(() => flushSync(() => setLangState(next)));
```

`flushSync` tetap wajib karena alasan yang sama seperti pada tema. Kekurangannya: efeknya
crossfade seluruh layar, kurang bisa diatur halus dibanding pendekatan A.

### Detail kecil
Label tombol `EN`/`ID` (`Navbar.tsx:83`) juga berganti mendadak — pakai pola dua elemen
ditumpuk yang saling memudar, konsisten dengan ikon lainnya.

---

## 5. Perpindahan halaman

Rute yang terlibat: `/` ↔ `/project/[slug]`, serta navigasi di dalam `/admin/*`.

### Opsi A — `app/template.tsx` (baseline, tanpa dependensi) ✅ mulai dari sini

Berbeda dari `layout.tsx`, berkas `template.tsx` **dibuat ulang setiap navigasi**, sehingga
animasi masuk otomatis berjalan tiap ganti halaman.

```tsx
// app/template.tsx
'use client';
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-enter">{children}</div>;
}
```

```css
/* app/globals.css */
@keyframes page-enter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-page-enter {
  animation: page-enter var(--dur-base) var(--ease-out-quint) both;
}
```

Keterbatasan yang harus diterima: **tidak ada animasi keluar.** Halaman lama hilang seketika,
lalu halaman baru masuk dengan halus. Ini konsekuensi arsitektur App Router, bukan bug.

### Opsi B — shared element antar halaman (hasil visual terbaik)

Gambar cover proyek di kartu (`components/Projects.tsx:58`) bisa dibuat seolah "terbang"
membesar menjadi gambar utama di halaman detail (`app/project/[slug]/page.tsx:143`).

Caranya: beri `view-transition-name` yang sama dan unik per proyek di kedua tempat, misalnya
`style={{ viewTransitionName: 'cover-' + project.slug }}`. Nama harus unik di satu halaman,
jadi gunakan slug — jangan nama statis, karena di homepage ada banyak kartu sekaligus.

Masalahnya, navigasi client-side App Router tidak otomatis membungkus dirinya dalam
`startViewTransition`. Karena React 19 tidak tersedia, jalurnya:

1. **Paket `next-view-transitions`** — membungkus `<Link>` dan memanggil `startViewTransition`
   di sekitar `router.push`. Paling sedikit kode. **Verifikasi dulu kompatibilitasnya dengan
   Next.js 16 + React 18** sebelum dipakai; kalau tidak cocok, jangan dipaksakan.
2. **Manual** — buat komponen `Link` sendiri yang mencegat `onClick`, memanggil
   `document.startViewTransition(() => router.push(href))`. Perlu penanganan ekstra untuk
   klik tengah, Ctrl+klik, dan navigasi tombol back browser.

Kerjakan opsi B **hanya setelah** opsi A stabil. Ini peningkatan, bukan fondasi.

### Opsi C — Framer Motion / `motion`
Hindari kecuali opsi A dan B gagal. Animasi keluar di App Router butuh trik `AnimatePresence`
dengan key `pathname` yang rapuh, dan menambah ukuran bundle pada situs yang saat ini
nol dependensi animasi.

### Gotcha navigasi
`html { scroll-behavior: smooth }` (`globals.css:36`) berlaku global. Saat pindah halaman,
Next.js memulihkan posisi scroll, dan perilaku smooth bisa memunculkan scroll beranimasi
yang tidak diinginkan di tengah transisi. Kalau muncul, batasi cakupannya — misalnya
terapkan smooth hanya lewat `:has()` atau pindahkan ke anchor link saja.

---

## 6. Sentuhan tambahan (opsional, rasio hasil/usaha tinggi)

- **Scroll reveal** — section bento memudar naik saat masuk viewport, pakai
  `IntersectionObserver`. Beri `threshold: 0.15` dan jalankan sekali saja (`unobserve`
  setelah terlihat) supaya tidak berulang mengganggu saat scroll naik-turun.
- **Stagger kartu proyek** — beri `animation-delay` bertingkat `index * 60ms`.
  Jangan lebih dari ~6 kartu agar yang terakhir tidak terasa lambat.
- **Hover kartu** sudah ada di `.bento-card:hover` (`globals.css:57`) — tidak perlu disentuh.

---

## 7. Urutan pengerjaan

Kerjakan berurutan; tiap langkah berdiri di atas langkah sebelumnya.

1. **Perbaiki flash tema** (§2a) — prasyarat mutlak
2. **Token gerak + `prefers-reduced-motion`** (§2b, §2c)
3. **Rapikan transisi warna ganda** di `globals.css:43` dan `layout.tsx:35` (§3)
4. **Toggle tema** (§3)
5. **Toggle bahasa** (§4)
6. **Perpindahan halaman, opsi A** (§5)
7. **Shared element, opsi B** (§5) — hanya jika 6 sudah mulus
8. **Sentuhan tambahan** (§6)

---

## 8. Cara memverifikasi

`npm run build` wajib lulus di tiap langkah.

**Untuk memeriksa animasi secara visual, ada jebakan yang perlu diketahui:** kalau
verifikasi dilakukan lewat browser otomatis yang panenya tersembunyi, browser membekukan
perhitungan style. `getComputedStyle` akan mengembalikan nilai basi dan animasi tampak
seolah tidak berjalan padahal baik-baik saja. Ini sudah pernah terjadi saat mengerjakan
menu mobile dan sempat menyesatkan diagnosis.

Cara andal: **perlambat transisi sementara** lewat CSS override
(`transition-duration: 3s !important`), lalu ambil beberapa screenshot berurutan. Kalau
tertangkap nilai antara — opacity separuh, ikon setengah berputar — animasinya berjalan.
Hapus override setelah selesai.

Uji juga:
- Mode gelap **dan** terang
- Viewport mobile (375px) dan desktop
- `prefers-reduced-motion: reduce` aktif — semua harus instan, tanpa rusak
- Browser tanpa View Transitions API — harus tetap berfungsi, sekadar tanpa efek

---

## 9. Ringkasan jebakan

| # | Jebakan | Akibat kalau terlewat |
|---|---|---|
| 1 | React 18, bukan 19 | `<ViewTransition>` dan `experimental.viewTransition` gagal |
| 2 | `flushSync` di dalam `startViewTransition` | Snapshot diambil sebelum render, animasi tidak muncul |
| 3 | Flash tema belum diperbaiki | Animasi justru membuat kedipan awal makin terlihat |
| 4 | Transisi `body` bertabrakan dengan reveal | Circular reveal tampak kotor |
| 5 | Class `dark:` hardcoded tidak bertransisi | Pergantian tema tetap patah di sebagian elemen |
| 6 | `* { transition: all }` | Scroll tersendat di ponsel |
| 7 | Tinggi teks ID vs EN berbeda | Halaman bergoyang saat ganti bahasa |
| 8 | `view-transition-name` tidak unik | Transisi gagal diam-diam saat ada banyak kartu |
| 9 | `prefers-reduced-motion` diabaikan | Masalah aksesibilitas nyata |

---

## 10. Batasan

- **Jangan** melakukan commit atau push — pemilik repositori menangani git sendiri.
- **Jangan** menyentuh `lib/`, `supabase/`, atau apa pun di `app/admin/` selain animasi
  navigasi, kecuali memang diperlukan.
- Situs ini **sudah live di Vercel** dari branch `new`. Setiap perubahan yang merusak
  langsung berdampak pada situs publik begitu di-push.
