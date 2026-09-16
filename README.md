# Portfolio Gilang Surya Ramadhan (Next.js + Tailwind CSS + Supabase CMS)

Website portofolio modern berbasis **Next.js**, **Tailwind CSS**, dan **Supabase Database & Auth**, dilengkapi dengan **Admin CMS Dashboard** untuk mengelola seluruh konten secara dinamis.

---

## 🚀 Fitur Utama

- ⚡ **Next.js (App Router)** & **TypeScript**: Performa cepat, SSR & SEO friendly.
- 🎨 **Tailwind CSS & Glassmorphism UI**: Desain clean, interaktif, dan modern.
- 🌗 **Dark / Light Mode Toggle**: Pengaturan tema otomatis dan manual.
- 🌐 **Bilingual (ID / EN)**: Mendukung Bahasa Indonesia dan Bahasa Inggris secara dinamis.
- 📂 **Studi Kasus Detail (`/project/[slug]`)**: Halaman case study lengkap untuk setiap karya (CRONELA, VASHION, Portfolio, My Celengan).
- 🛠️ **Admin CMS Dashboard (`/admin`)**:
  - **Dashboard Overview**: Ringkasan data & statistik real-time.
  - **Profil & Hero**: Edit nama, headline, bio (ID/EN), sosial media, dan CV.
  - **Pendidikan**: Tambah, edit, dan hapus riwayat pendidikan.
  - **Keahlian (Skills)**: Kelola badge icon & nama keahlian teknis.
  - **Portofolio & Studi Kasus**: Editor case study lengkap (tools, proses, tantangan, screenshot, live demo & repo links).
  - **Pesan Masuk (Inbox)**: Lihat pesan dari pengunjung melalui formulir kontak.
- 🗄️ **Supabase Database & Auth**:
  - Script SQL migrasi & seeding otomatis (`supabase/schema.sql`).
  - Dual Mode: Otomatis memakai Supabase Cloud saat env terisi, atau fallback local storage jika offline.

---

## 💻 Cara Menjalankan Proyek

### 1. Menjalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser.

### 2. Membuka Admin Dashboard
Akses halaman admin di [http://localhost:3000/admin](http://localhost:3000/admin).
- Jika belum menghubungkan Supabase, Anda dapat mengklik tombol **"Masuk Cepat Mode Administrator (Demo)"** untuk langsung mengakses dashboard dan mencoba semua fitur CRUD.

---

## 🗄️ Menghubungkan ke Supabase (Langkah demi Langkah)

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor** di dashboard Supabase Anda.
3. Buka file `supabase/schema.sql` di project ini, copy seluruh kodenya, paste ke SQL Editor Supabase, lalu klik **Run**.
4. Buka menu **Project Settings -> API** di Supabase, lalu salin:
   - `Project URL`
   - `anon / public key`
5. Buka file `.env.local` di folder project ini dan masukkan credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh......
   ```
6. Buka menu **Authentication -> Users** di Supabase dan buat akun admin untuk login ke CMS, atau gunakan menu Signup.
7. Restart server Next.js (`npm run dev`), dan website Anda kini 100% terhubung secara live ke Supabase!

---

## 📁 Struktur Folder

```
├── app/
│   ├── admin/               # Panel Admin CMS
│   │   ├── education/       # Kelola Pendidikan
│   │   ├── login/           # Login Admin
│   │   ├── messages/        # Kotak Masuk Pesan
│   │   ├── profile/         # Kelola Profil & Hero
│   │   ├── projects/        # Kelola Portofolio & Case Studies
│   │   └── skills/          # Kelola Keahlian
│   ├── project/[slug]/      # Halaman Dinamis Studi Kasus
│   ├── globals.css          # Tailwind & Theme Styles
│   ├── layout.tsx           # Providers (Theme, Lang, Auth)
│   └── page.tsx             # Halaman Utama Portofolio
├── components/              # UI Components (Navbar, Hero, Projects, dll)
├── context/                 # React Contexts (Theme, Language, Auth)
├── lib/                     # Data Service & Supabase Clients
│   ├── supabase/            # Client & Fallback seed
│   ├── data-service.ts      # Abstraction CRUD layer
│   └── types.ts             # TypeScript definitions
├── public/                  # Static assets (img, pdf, favicon)
└── supabase/
    └── schema.sql           # Skema Database & Seed Data
```