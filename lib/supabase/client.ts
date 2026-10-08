import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey.length > 20
);

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
  }
  
  return supabaseInstance;
}

export function subscribeToRealtime(
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  onData: (payload: any) => void,
  onError?: (error: Error) => void
): () => void {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    console.warn('Supabase not configured for realtime');
    return () => {};
  }

  const channel = supabase.channel(`realtime:${table}:${event}`, {
    config: {
      broadcast: { self: false }
    }
  });
  
  channel
    .on(
      'postgres_changes',
      {
        event,
        schema: 'public',
        table,
      },
      (payload) => {
        console.log(`Realtime event: ${table} ${event}`, payload);
        onData(payload);
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✓ Realtime active: ${table}`);
      }
      if (status === 'CHANNEL_ERROR') {
        console.error(`✗ Realtime error: ${table}`);
        onError?.(new Error(`Channel error`));
      }
      if (status === 'CLOSED') {
        console.log(`○ Realtime closed: ${table}`);
      }
    });

  return () => {
    console.log(`Cleaning up realtime subscription for ${table}`);
    supabase.removeChannel(channel);
  };
}
