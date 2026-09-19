import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * ⚠️ KHUSUS SERVER — JANGAN PERNAH diimpor dari komponen client.
 *
 * Berkas ini memakai SUPABASE_SERVICE_ROLE_KEY, yang sengaja TIDAK berawalan
 * NEXT_PUBLIC_ agar tidak ikut dibundel ke browser. Kunci itu melewati seluruh
 * aturan RLS, jadi kalau sampai bocor ke sisi klien, siapa pun bisa membaca dan
 * mengubah seluruh isi database.
 *
 * Satu-satunya pemakainya saat ini adalah app/api/contact/route.ts.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True bila service role tersedia, sehingga RLS publik boleh ditutup. */
export const hasServiceRole = Boolean(serviceRoleKey && serviceRoleKey.length > 20);

export function getSupabaseServerClient(): SupabaseClient | null {
  if (!url) return null;

  // Selama service role belum dipasang, jatuh ke anon key supaya form tetap
  // berfungsi. Perlu diingat: dengan anon key, penulisan hanya berhasil selama
  // policy insert publik masih ada di database.
  const key = serviceRoleKey || anonKey;
  if (!key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
