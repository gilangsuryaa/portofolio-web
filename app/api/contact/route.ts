import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Endpoint pengiriman pesan kontak.
 *
 * Seluruh penulisan ke tabel contact_messages dialihkan ke sini supaya token
 * Cloudflare Turnstile bisa diverifikasi di server. Verifikasi di sisi klien
 * tidak ada gunanya — siapa pun bisa melewati halamannya dan menembak endpoint
 * langsung, jadi keputusan menerima atau menolak harus diambil di server.
 */

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;

type VerifyResult = { ok: boolean; reason?: string; skipped?: boolean };

async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<VerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Turnstile belum dikonfigurasi — lewati agar situs tetap berfungsi sebelum
  // kuncinya dipasang. Begitu TURNSTILE_SECRET_KEY diisi, verifikasi wajib.
  if (!secret) return { ok: true, skipped: true };

  if (!token) return { ok: false, reason: 'token-tidak-ada' };

  const form = new URLSearchParams();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: form });
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (data.success === true) return { ok: true };
    return { ok: false, reason: (data['error-codes'] || []).join(', ') || 'ditolak' };
  } catch (err) {
    console.error('Turnstile verify error:', err);
    // Cloudflare tidak terjangkau. Menolak pesan lebih aman daripada membuka
    // celah, tapi pengunjung diberi tahu agar bisa mencoba lagi.
    return { ok: false, reason: 'verifikasi-gagal' };
  }
}

function clientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip');
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'permintaan-tidak-valid' }, { status: 400 });
  }

  const name = String(body?.name ?? '').trim();
  const email = String(body?.email ?? '').trim();
  const message = String(body?.message ?? '').trim();
  const turnstileToken = body?.turnstileToken as string | undefined;

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: 'data-kurang' }, { status: 400 });
  }

  if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return NextResponse.json({ success: false, error: 'data-terlalu-panjang' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: 'email-tidak-valid' }, { status: 400 });
  }

  const verified = await verifyTurnstile(turnstileToken, clientIp(req));
  if (!verified.ok) {
    console.warn('Turnstile menolak pengiriman:', verified.reason);
    return NextResponse.json({ success: false, error: 'verifikasi-gagal' }, { status: 403 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.error('Supabase belum dikonfigurasi di server.');
    return NextResponse.json({ success: false, error: 'server-belum-siap' }, { status: 503 });
  }

  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message, is_read: false }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    // Detail galat sengaja tidak diteruskan ke pengunjung agar struktur
    // internal database tidak bocor.
    console.error('Gagal menyimpan pesan kontak:', err);
    return NextResponse.json({ success: false, error: 'gagal-menyimpan' }, { status: 500 });
  }
}
