'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Code2,
  Briefcase,
  Mail,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
  Database
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut, isSupabase } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // If on login page, render children directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121214]">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Profil & Hero', href: '/admin/profile', icon: User },
    { label: 'Pendidikan', href: '/admin/education', icon: GraduationCap },
    { label: 'Keahlian (Skills)', href: '/admin/skills', icon: Code2 },
    { label: 'Portofolio', href: '/admin/projects', icon: Briefcase },
    { label: 'Pesan Masuk', href: '/admin/messages', icon: Mail },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#121214] text-gray-900 dark:text-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a20] flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-red-500/30">
                G
              </div>
              <div>
                <h2 className="font-bold text-sm tracking-tight text-gray-900 dark:text-white">Admin Portal</h2>
                <p className="text-[11px] text-gray-400">Gilang Portfolio CMS</p>
              </div>
            </div>
          </div>

          {/* Database indicator */}
          <div className="px-4 py-3 m-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Database className={`w-3.5 h-3.5 ${isSupabase ? 'text-emerald-500' : 'text-amber-500'}`} />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {isSupabase ? 'Supabase Connected' : 'Local Storage Mode'}
            </span>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <span>Buka Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top bar */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#1a1a20]/80 backdrop-blur px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          
          {/* Mobile links scroll */}
          <div className="flex md:hidden items-center gap-2 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`p-2 rounded-lg text-xs flex items-center gap-1.5 whitespace-nowrap ${
                    isActive ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:block">
            <span className="text-xs text-gray-400 font-medium">
              Logged in as: <span className="text-gray-800 dark:text-gray-200 font-semibold">{user.email || 'Admin'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-1.5"
            >
              <span>Live Web</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Content area */}
        <main className="p-4 sm:p-8 flex-grow overflow-auto max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
