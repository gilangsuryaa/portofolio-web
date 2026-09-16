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
      // Check active Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email });
        } else {
          checkLocalSession();
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email });
        } else {
          checkLocalSession();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
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

    if (supabase && isSupabaseConfigured && password) {
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
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Default / Demo fallback login
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
