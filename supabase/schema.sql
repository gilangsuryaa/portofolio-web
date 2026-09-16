-- ==============================================================================
-- DATABASE SCHEMA: PORTFOLIO & CMS SYSTEM
-- Author: Gilang Surya Ramadhan
-- Database: Supabase (PostgreSQL)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABLE: PROFILE (Profile, Hero & About Settings)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile (
    id TEXT PRIMARY KEY DEFAULT '1',
    name TEXT NOT NULL,
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    tagline_id TEXT NOT NULL,
    tagline_en TEXT NOT NULL,
    about_id TEXT NOT NULL,
    about_en TEXT NOT NULL,
    avatar_url TEXT DEFAULT '/img/optimized/gw.webp',
    logo_url TEXT DEFAULT '/img/optimized/gw-bunder.webp',
    cv_url TEXT DEFAULT '/assests/CV.pdf',
    email TEXT DEFAULT 'gs7832583@gmail.com',
    github_url TEXT DEFAULT 'https://github.com/gilangsuryaa',
    linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/gilang-surya-ramadhan-781084391',
    instagram_url TEXT DEFAULT 'https://www.instagram.com/gilang.sra',
    location TEXT DEFAULT '',
    specialization TEXT DEFAULT '',
    current_school TEXT DEFAULT '',
    school_period TEXT DEFAULT '',
    specialization_1 TEXT DEFAULT '',
    specialization_2 TEXT DEFAULT '',
    specialization_3 TEXT DEFAULT '',
    philosophy_id TEXT DEFAULT '',
    philosophy_en TEXT DEFAULT '',
    philosophy_desc_id TEXT DEFAULT '',
    philosophy_desc_en TEXT DEFAULT '',
    motto TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migrasi untuk database yang sudah ada (aman dijalankan berulang kali)
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

-- ------------------------------------------------------------------------------
-- 2. TABLE: EDUCATION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution TEXT NOT NULL,
    period TEXT NOT NULL,
    description_id TEXT NOT NULL,
    description_en TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. TABLE: SKILLS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. TABLE: PROJECTS & CASE STUDIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category_id TEXT NOT NULL,
    category_en TEXT NOT NULL,
    description_id TEXT NOT NULL,
    description_en TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    overview_id TEXT,
    overview_en TEXT,
    role_id TEXT,
    role_en TEXT,
    tools TEXT,
    timeline_id TEXT,
    timeline_en TEXT,
    process_id TEXT,
    process_en TEXT,
    challenge_id TEXT,
    challenge_en TEXT,
    challenge_images JSONB DEFAULT '[]'::jsonb,
    github_url TEXT,
    live_url TEXT,
    order_index INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. TABLE: CONTACT MESSAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public READ policies for portfolio content
CREATE POLICY "Public Read Profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Public Read Education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);

-- Public INSERT for contact form
CREATE POLICY "Public Insert Messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Authenticated (Admin) FULL ACCESS
CREATE POLICY "Admin Full Access Profile" ON public.profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Education" ON public.education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Messages" ON public.contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- SUPABASE STORAGE BUCKET: PORTFOLIO
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Read Portfolio Storage" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated Upload Portfolio Storage" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Authenticated Update Portfolio Storage" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated Delete Portfolio Storage" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'portfolio');

-- ------------------------------------------------------------------------------
-- SEED INITIAL DATA
-- ------------------------------------------------------------------------------

-- Seed Profile
INSERT INTO public.profile (
    id, name, title_id, title_en, tagline_id, tagline_en, about_id, about_en,
    avatar_url, logo_url, cv_url, email, github_url, linkedin_url, instagram_url,
    location, specialization, current_school, school_period,
    specialization_1, specialization_2, specialization_3,
    philosophy_id, philosophy_en, philosophy_desc_id, philosophy_desc_en, motto
)
VALUES (
    '1',
    'Gilang Surya Ramadhan',
    'Gilang Surya Ramadhan - Specialist Programmer',
    'Gilang Surya Ramadhan - Specialist Programmer',
    'Bersemangat dalam bidang teknologi, selalu mengikuti perkembangan terbaru dan berusaha memberikan solusi terbaik melalui pemrograman.',
    'Passionate about technology, always keeping up with the latest developments and striving to provide the best solutions through programming.',
    'Saya adalah seorang siswa SMK Telkom Purwokerto, saya saat ini merupakan seorang siswa kelas 11. Di SMK Telkom Purwokerto saya belajar berbagai hal yang berkaitan dengan teknologi seperti mengembangkan website, aplikasi, dan mempelajari tentang machine learning. Pernah membuat website menggunakan HTML, CSS, dan JavaScript, serta mempelajari Laravel.',
    'I am a student at SMK Telkom Purwokerto, currently in 11th grade. At SMK Telkom Purwokerto, I learn various things related to technology such as developing websites, applications, and studying machine learning. I have created websites using HTML, CSS, and JavaScript, and have also studied Laravel.',
    '/img/optimized/gw.webp',
    '/img/optimized/gw-bunder.webp',
    '/assests/CV.pdf',
    'gs7832583@gmail.com',
    'https://github.com/gilangsuryaa',
    'https://www.linkedin.com/in/gilang-surya-ramadhan-781084391',
    'https://www.instagram.com/gilang.sra',
    'Purwokerto, Indonesia',
    'Rekayasa Perangkat Lunak',
    'SMK Telkom',
    '2024 - 2027',
    'Frontend & Web',
    'Next.js & Laravel',
    'Supabase & SQL',
    'Membangun aplikasi yang cepat, bersih, dan berorientasi pengguna.',
    'Building fast, clean, and user-centric applications.',
    'Selalu antusias mempelajari teknologi terdepan dan menyajikan arsitektur kode yang terstruktur.',
    'Passionate about exploring modern web technologies and engineering well-architected solutions.',
    'Clean Code & Architecture'
) ON CONFLICT (id) DO NOTHING;

-- Isi kolom baru untuk baris profil yang sudah ada (hanya jika masih kosong)
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

-- Seed Education
INSERT INTO public.education (institution, period, description_id, description_en, order_index)
VALUES 
('SD Negeri 2 Losari Kidul', '2015-2021', 'Pernah menempuh pendidikan dasar di SD Negeri 2 Losari Kidul', 'Completed elementary education at SD Negeri 2 Losari Kidul', 1),
('SMP Negeri 1 Losari', '2021-2024', 'Pernah menempuh pendidikan menengah tingkat awal di SMP Negeri 1 Losari', 'Completed junior high school education at SMP Negeri 1 Losari', 2),
('SMK Telkom Purwokerto', '2024-2027', 'Sedang menempuh pendidikan menengah di SMK Telkom Purwokerto, jurusan Rekayasa Perangkat Lunak dengan fokus pengembangan web.', 'Currently pursuing vocational education at SMK Telkom Purwokerto, majoring in Software Engineering with a focus on web development.', 3)
ON CONFLICT DO NOTHING;

-- Seed Skills
INSERT INTO public.skills (name, icon_url, category, order_index)
VALUES
('Figma', 'https://skillicons.dev/icons?i=figma', 'Design', 1),
('HTML5', 'https://skillicons.dev/icons?i=html', 'Frontend', 2),
('CSS3', 'https://skillicons.dev/icons?i=css', 'Frontend', 3),
('JavaScript', 'https://skillicons.dev/icons?i=js', 'Frontend', 4),
('PHP', 'https://skillicons.dev/icons?i=php', 'Backend', 5),
('MySQL', 'https://skillicons.dev/icons?i=mysql', 'Database', 6),
('Git', 'https://skillicons.dev/icons?i=git', 'Tools', 7),
('Python', 'https://skillicons.dev/icons?i=python', 'Language', 8)
ON CONFLICT DO NOTHING;

-- Seed Projects
INSERT INTO public.projects (
    slug, title, category_id, category_en, description_id, description_en,
    cover_image, overview_id, overview_en, role_id, role_en, tools,
    timeline_id, timeline_en, process_id, process_en, challenge_id, challenge_en,
    challenge_images, github_url, live_url, order_index, featured
) VALUES
(
    'cronela',
    'CRONELA',
    'Website Pendidikan',
    'Education Website',
    'Mengembangkan situs web pembelajaran daring menggunakan HTML, CSS, dan JavaScript, terintegrasi dengan video YouTube dan fitur interaktif untuk melibatkan pengguna.',
    'Developing an online learning website using HTML, CSS, and JavaScript, integrated with YouTube videos and interactive features to engage users.',
    '/img/optimized/cronela/home.webp',
    'Saya dan tim mengembangkan sebuah website pendidikan online yang berisi video-video pembelajaran dan juga kuis interaktif.',
    'My team and I developed an online education website featuring learning videos and interactive quizzes.',
    'Fullstack Developer',
    'Fullstack Developer',
    'PHP, CSS, JS, MySQL',
    '3 Bulan',
    '3 Months',
    'Proses pembuatan diawali dengan mencari ide website yang akan berguna bagi banyak orang. Jadi kami membuat website pendidikan, yang di dalamnya berisikan video-video pendidikan dan juga berisi kuis interaktif yang dapat menguji kemampuan pengguna.',
    'The development process began by brainstorming website ideas beneficial to many. We created an education website with instructional videos and interactive quizzes to test user skills.',
    'Bagian yang cukup menantang dari projek ini adalah ketika membuat section register dan login, selain itu, membuat bagian kuis agar bisa menyimpan skor user juga merupakan tugas yang cukup menantang.',
    'A challenging part of this project was implementing the register and login section, along with creating the quiz component to reliably store user scores.',
    '["/img/optimized/cronela/login.webp", "/img/optimized/cronela/quiz.webp"]'::jsonb,
    'https://github.com/gilangsuryaa/Cronela',
    '',
    1,
    true
),
(
    'vashion',
    'VASHION',
    'Website Ecommerce',
    'Ecommerce Website',
    'Mengembangkan platform belanja pakaian daring yang memanfaatkan komponen pengembangan web fundamental seperti HTML, CSS, dan JavaScript, terintegrasi dengan database menggunakan SQL dan PHP.',
    'Developing an online clothing shopping platform utilizing fundamental web development components such as HTML, CSS, and JavaScript, integrated with a database using SQL and PHP.',
    '/img/optimized/vashion/home.webp',
    'Saya dan tim mengembangkan sebuah website ecommerce pakaian online yang memungkinkan pengguna untuk mencari, melihat, dan membeli pakaian dengan mudah.',
    'My team and I developed an online clothing ecommerce website allowing users to search, view, and purchase apparel seamlessly.',
    'Frontend & Database Developer',
    'Frontend & Database Developer',
    'PHP, HTML, CSS, JS, MySQL',
    '2 Bulan',
    '2 Months',
    'Perancangan desain UI/UX di Figma, kemudian mengimplementasikannya ke HTML/CSS serta menghubungkan katalog produk dengan database MySQL menggunakan backend PHP.',
    'Designed UI/UX in Figma, then implemented it into HTML/CSS and connected product catalogs to a MySQL database using PHP backend.',
    'Membangun logika keranjang belanja dan manajemen inventaris stok produk yang responsif secara real-time.',
    'Building the shopping cart logic and inventory stock management that responds in real-time.',
    '["/img/optimized/vashion/home.webp"]'::jsonb,
    'https://github.com/gilangsuryaa',
    '',
    2,
    true
),
(
    'portfolio',
    'Website Portofolio',
    'Personal Website',
    'Personal Website',
    'Mengembangkan website portfolio yang berisi informasi tentang diri saya, dan projek-projek yang pernah saya buat dengan menggunakan HTML, CSS, dan JavaScript.',
    'Developing a portfolio website that contains information about myself and the projects I have created using HTML, CSS and JavaScript.',
    '/img/optimized/portfolio/home.webp',
    'Website portofolio interaktif untuk menampilkan karya, profil, skill, dan studi kasus pengembangan web.',
    'An interactive portfolio website to showcase work, profile, skills, and web development case studies.',
    'Solo Developer & Designer',
    'Solo Developer & Designer',
    'Next.js, Tailwind CSS, TypeScript, Supabase',
    '1 Bulan',
    '1 Month',
    'Merancang arsitektur web modern berbasis Next.js, membuat sistem tema gelap/terang, multi-bahasa, serta integrasi CMS Supabase untuk kemudahan update konten.',
    'Architected modern Next.js web application, implemented dark/light theme, bilingual support, and Supabase CMS integration for effortless content management.',
    'Menyusun CMS admin yang aman dan mudah digunakan tanpa mengorbankan performa kecepatan loading website publik.',
    'Structuring a secure, user-friendly CMS dashboard while maintaining optimal public loading performance.',
    '["/img/optimized/portfolio/home.webp"]'::jsonb,
    'https://github.com/gilangsuryaa',
    '',
    3,
    true
),
(
    'mycelengan',
    'My Celengan',
    'Aplikasi Android Mobile',
    'Android Mobile App',
    'Mengembangkan aplikasi mobile android berbasis kotlin yang berfungsi untuk mencatat pengeluaran dan pemasukan pengguna, serta dengan fitur target agar pengguna termotivasi untuk menabung.',
    'Developing a Kotlin-based Android mobile application that functions to record user expenses and income, as well as with a target feature to motivate users to save.',
    '/img/optimized/mycelengan/splashscreen.webp',
    'Aplikasi pencatatan keuangan pribadi dengan fitur manajemen tabungan dan target finansial.',
    'A personal finance tracking app featuring savings management and financial goals.',
    'Android Developer',
    'Android Developer',
    'Kotlin, Android Studio, SQLite / Room',
    '2 Bulan',
    '2 Months',
    'Membangun antarmuka mobile yang ramah pengguna menggunakan Kotlin, mengimplementasikan Room Database lokal, dan visualisasi grafik pemasukan/pengeluaran.',
    'Built a user-friendly mobile UI using Kotlin, implemented local Room Database, and income/expense visual charts.',
    'Mengatur alur perhitungan transaksi dan kalkulasi progres target tabungan secara akurat dan konsisten.',
    'Handling transaction calculation flows and savings target progress tracking accurately and consistently.',
    '["/img/optimized/mycelengan/splashscreen.webp"]'::jsonb,
    'https://github.com/gilangsuryaa',
    '',
    4,
    true
)
ON CONFLICT (slug) DO NOTHING;
