-- ==============================================================================
-- MIGRASI: Kolom baru untuk konten Hero & About yang sebelumnya hardcoded
-- Jalankan di Supabase Dashboard → SQL Editor
-- Aman dijalankan berulang kali (idempotent)
-- ==============================================================================

ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS specialization TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS current_school TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS school_period TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS specialization_1 TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS specialization_2 TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS specialization_3 TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS philosophy_id TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS philosophy_en TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS philosophy_desc_id TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS philosophy_desc_en TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS motto TEXT DEFAULT '';

-- Isi nilai awal agar tampilan website tidak berubah setelah migrasi.
-- Kolom yang sudah terisi tidak akan ditimpa.
UPDATE public.profile SET
    location           = COALESCE(NULLIF(location, ''), 'Purwokerto, Indonesia'),
    specialization     = COALESCE(NULLIF(specialization, ''), 'Rekayasa Perangkat Lunak'),
    current_school     = COALESCE(NULLIF(current_school, ''), 'SMK Telkom'),
    school_period      = COALESCE(NULLIF(school_period, ''), '2024 - 2027'),
    specialization_1   = COALESCE(NULLIF(specialization_1, ''), 'Frontend & Web'),
    specialization_2   = COALESCE(NULLIF(specialization_2, ''), 'Next.js & Laravel'),
    specialization_3   = COALESCE(NULLIF(specialization_3, ''), 'Supabase & SQL'),
    philosophy_id      = COALESCE(NULLIF(philosophy_id, ''), 'Membangun aplikasi yang cepat, bersih, dan berorientasi pengguna.'),
    philosophy_en      = COALESCE(NULLIF(philosophy_en, ''), 'Building fast, clean, and user-centric applications.'),
    philosophy_desc_id = COALESCE(NULLIF(philosophy_desc_id, ''), 'Selalu antusias mempelajari teknologi terdepan dan menyajikan arsitektur kode yang terstruktur.'),
    philosophy_desc_en = COALESCE(NULLIF(philosophy_desc_en, ''), 'Passionate about exploring modern web technologies and engineering well-architected solutions.'),
    motto              = COALESCE(NULLIF(motto, ''), 'Clean Code & Architecture')
WHERE id = '1';
