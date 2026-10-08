-- ==============================================================================
-- MIGRASI: Enable Realtime dengan REPLICA IDENTITY FULL
-- Jalankan di Supabase Dashboard → SQL Editor
-- ==============================================================================
-- 
-- Realtime Supabase perlu REPLICA IDENTITY FULL untuk mendeteksi UPDATE/DELETE
-- Tanpa ini, perubahan data hanya terdeteksi sekali, update berikutnya tidak trigger
--
-- ==============================================================================

ALTER TABLE public.profile REPLICA IDENTITY FULL;
ALTER TABLE public.education REPLICA IDENTITY FULL;
ALTER TABLE public.skills REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.certificates REPLICA IDENTITY FULL;
ALTER TABLE public.contact_messages REPLICA IDENTITY FULL;
