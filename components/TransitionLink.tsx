'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerNavigationResolver, supportsViewTransition } from '@/lib/view-transition';

type TransitionLinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
  href: string;
};

/**
 * Pengganti next/link yang membungkus navigasi dalam View Transition,
 * sehingga shared element (cover proyek) bisa memuai ke halaman detail.
 *
 * Kalau browser tidak mendukung, atau pengguna menekan Ctrl/Cmd/Shift/Alt,
 * atau memakai klik tengah, komponen ini tidak ikut campur — Link biasa
 * menangani seperti biasa, termasuk membuka tab baru.
 */
export default function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!supportsViewTransition()) return;

    e.preventDefault();

    const root = document.documentElement;
    root.classList.add('vt-nav');

    const transition = (document as any).startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          // Jaring pengaman: kalau rute baru tak kunjung ter-commit (navigasi
          // gagal, atau template tidak dibuat ulang), transisi tetap dilepas
          // agar halaman tidak membeku.
          const timeout = setTimeout(resolve, 600);
          registerNavigationResolver(() => {
            clearTimeout(timeout);
            resolve();
          });
          router.push(href);
        })
    );

    transition.finished.finally(() => root.classList.remove('vt-nav'));
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
