'use client';

import { useLayoutEffect, useState } from 'react';
import { resolveNavigation, isViewTransitionNavigation } from '@/lib/view-transition';

/**
 * Berkas template dibuat ulang React setiap kali rute berganti — berbeda dari
 * layout yang dipertahankan. Sifat itu dipakai untuk dua hal:
 *
 * 1. Menjalankan animasi masuk pada setiap navigasi.
 * 2. Memberi tahu View Transition bahwa DOM rute baru sudah ter-commit.
 *    useLayoutEffect dipakai, bukan useEffect, agar sinyalnya dikirim segera
 *    setelah DOM berubah dan sebelum browser melukis.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  // Diputuskan sekali saat mount dan tidak pernah dihitung ulang. Kalau navigasi
  // berjalan lewat View Transition, transisi itu sendiri yang menganimasikan
  // perpindahan, jadi animasi masuk tidak dipasang sama sekali.
  const [enterClass] = useState(() => (isViewTransitionNavigation() ? '' : 'animate-page-enter'));

  useLayoutEffect(() => {
    resolveNavigation();
  }, []);

  return <div className={enterClass}>{children}</div>;
}
