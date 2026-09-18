/**
 * Perekat kecil untuk View Transitions API pada navigasi App Router.
 *
 * Kenapa perlu: React 19 dan flag `experimental.viewTransition` tidak tersedia di
 * proyek ini (React 18.3.1), jadi navigasi harus dibungkus manual.
 *
 * Masalah intinya, `router.push()` tidak sinkron. Kalau callback startViewTransition
 * langsung selesai, browser mengambil snapshot "sesudah" sebelum React sempat
 * me-render halaman baru — hasilnya tidak ada yang beranimasi.
 *
 * Solusinya: callback mengembalikan Promise yang baru diselesaikan oleh
 * `app/template.tsx`, yang memang dibuat ulang React setiap kali rute berganti.
 * Jadi Promise-nya selesai tepat setelah DOM rute baru ter-commit.
 */

type Resolver = () => void;

let pendingResolver: Resolver | null = null;

/** Dipanggil sesaat sebelum router.push, menyimpan penyelesai transisi. */
export function registerNavigationResolver(resolve: Resolver) {
  pendingResolver = resolve;
}

/** Dipanggil template.tsx saat rute baru selesai ter-commit. */
export function resolveNavigation() {
  if (pendingResolver) {
    const resolve = pendingResolver;
    pendingResolver = null;
    resolve();
  }
}

/**
 * Transisi hanya dijalankan bila browser mendukungnya dan pengguna tidak
 * meminta pengurangan animasi. Di luar itu navigasi berjalan seperti biasa.
 */
export function supportsViewTransition(): boolean {
  if (typeof document === 'undefined') return false;
  if (typeof (document as any).startViewTransition !== 'function') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Apakah saat ini sedang berlangsung transisi navigasi?
 *
 * Dibaca sekali saat sebuah elemen mount, untuk memutuskan apakah animasi masuk
 * perlu dipasang. Nilainya TIDAK boleh dibaca ulang pada render berikutnya:
 * setelah transisi selesai penandanya hilang, dan memasang kelas animasi pada
 * saat itu akan menjalankan animasinya dari awal — konten jadi terlihat seperti
 * habis dimuat ulang.
 */
export function isViewTransitionNavigation(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('vt-nav');
}

/** Nama shared element untuk cover sebuah proyek. Harus unik per halaman. */
export function coverTransitionName(slug: string): string {
  return `cover-${slug.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}
