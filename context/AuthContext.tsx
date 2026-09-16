'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface User {
  id: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSupabase: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (supabase && isSupabaseConfigured) {
      // Supabase aktif: hanya sesi Supabase yang diakui sebagai login sah.
      // Sisa sesi lokal dari mode development dibuang, agar tidak bisa dipakai
      // menembus halaman admin tanpa autentikasi.
      try {
        localStorage.removeItem('porto_admin_session');
      } catch {
        // localStorage tidak tersedia — abaikan
      }

      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Supabase belum dikonfigurasi — mode lokal untuk development.
      checkLocalSession();
      setLoading(false);
    }
  }, []);

  const checkLocalSession = () => {
    try {
      const stored = localStorage.getItem('porto_admin_session');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const signIn = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabaseBrowserClient();

    // Supabase aktif: autentikasi asli adalah satu-satunya jalur masuk.
    // Setiap cabang di bawah ini harus return, jangan sampai jatuh ke mode lokal.
    if (supabase && isSupabaseConfigured) {
      if (!password) {
        return { success: false, error: 'Kata sandi wajib diisi.' };
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email });
          return { success: true };
        }

        return { success: false, error: 'Login gagal. Coba lagi beberapa saat lagi.' };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Supabase belum dikonfigurasi — mode lokal untuk development.
    const adminUser = { id: 'admin-local-1', email: email || 'admin@porto.dev' };
    setUser(adminUser);
    localStorage.setItem('porto_admin_session', JSON.stringify(adminUser));
    return { success: true };
  };

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('porto_admin_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isSupabase: isSupabaseConfigured, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
