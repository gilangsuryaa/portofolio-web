// ============================================
// TRANSLATIONS - Halaman HOME
// ============================================
const homeTranslations = {
    id: {
        "name": "Gilang Surya Ramadhan",
        "nav-work": "Karya",
        "nav-about": "Tentang",
        "nav-education": "Pendidikan",
        "nav-contact": "Kontak",
        "get-in-touch": "Hubungi Saya",
        "hero-title": "Gilang Surya Ramadhan - Specialist Programmer",
        "hero-description": "Bersemangat dalam bidang teknologi, selalu mengikuti perkembangan terbaru dan berusaha memberikan solusi terbaik melalui pemrograman.",
        "download-cv": "Download CV",
        "about-title": "Tentang Saya",
        "about-description": "Saya adalah seorang siswa SMK Telkom Purwokerto, saya saat ini merupakan seorang siswa kelas 11. Di SMK Telkom Purwokerto saya belajar berbagai hal yang berkaitan dengan teknologi seperti mengembangkan website, aplikasi, dan mempelajari tentang machine learning. Pernah membuat website menggunakan HTML, CSS, dan JavaScript, serta mempelajari Laravel.",
        "education-title": "Pendidikan",
        "edu-sd": "Pernah menempuh pendidikan dasar di SD Negeri 2 Losari Kidul",
        "edu-smp": "Pernah menempuh pendidikan menengah tingkat awal di SMP Negeri 1 Losari",
        "edu-smk": "Sedang menempuh pendidikan menengah di SMK Telkom Purwokerto, jurusan Rekayasa Perangkat Lunak dengan fokus pengembangan web.",
        "projects-title": "Proyek Unggulan",
        "projects-subtitle": "Pilihan karya terbaik saya.",
        "project1-title": "CRONELA | WEBSITE PENDIDIKAN",
        "project1-desc": "Mengembangkan situs web pembelajaran daring menggunakan HTML, CSS, dan JavaScript, terintegrasi dengan video YouTube dan fitur interaktif untuk melibatkan pengguna.",
        "project2-title": "VASHION | WEBSITE ECOMMERCE",
        "project2-desc": "Mengembangkan platform belanja pakaian daring yang memanfaatkan komponen pengembangan web fundamental seperti HTML, CSS, dan JavaScript, terintegrasi dengan database menggunakan SQL dan PHP.",
        "view-case": "Lihat Studi Kasus →",
        "skills-title": "Keahlian",
        "footer-text": "© 2025 Gilang Surya Ramadhan. Hak Cipta Dilindungi."
    },
    en: {
        "name": "Gilang Surya Ramadhan",
        "nav-work": "Work",
        "nav-about": "About",
        "nav-education": "Education",
        "nav-contact": "Contact",
        "get-in-touch": "Get in Touch",
        "hero-title": "Gilang Surya Ramadhan - Specialist Programmer",
        "hero-description": "Passionate about technology, always keeping up with the latest developments and striving to provide the best solutions through programming.",
        "download-cv": "Download CV",
        "about-title": "About Me",
        "about-description": "I am a student at SMK Telkom Purwokerto, currently in 11th grade. At SMK Telkom Purwokerto, I learn various things related to technology such as developing websites, applications, and studying machine learning. I have created websites using HTML, CSS, and JavaScript, and have also studied Laravel.",
        "education-title": "Education",
        "edu-sd": "Completed elementary education at SD Negeri 2 Losari Kidul",
        "edu-smp": "Completed junior high school education at SMP Negeri 1 Losari",
        "edu-smk": "Currently pursuing vocational education at SMK Telkom Purwokerto, majoring in Software Engineering with a focus on web development.",
        "projects-title": "Featured Projects",
        "projects-subtitle": "A selection of my favorite work.",
        "project1-title": "CRONELA | EDUCATIONAL WEBSITE",
        "project1-desc": "Developing an online learning website using HTML, CSS, and JavaScript, integrated with YouTube videos and interactive features to engage users.",
        "project2-title": "VASHION | ECOMMERCE WEBSITE",
        "project2-desc": "Developing an online clothing shopping platform utilizing fundamental web development components such as HTML, CSS, and JavaScript, integrated with a database using SQL and PHP.",
        "view-case": "View Case Study →",
        "skills-title": "Skills",
        "footer-text": "© 2025 Gilang Surya Ramadhan. All Rights Reserved."
    }
};

// ============================================
// HAMBURGER MENU TOGGLE
// ============================================
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (!hamburger || !navMenu) return;

    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// ============================================
// LANGUAGE SWITCHER
// ============================================
let currentLang = localStorage.getItem('language') || 'id';

function initHomeLanguage() {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) return;
    
    // Set initial language
    document.documentElement.lang = currentLang;
    langToggle.textContent = currentLang === 'id' ? 'EN' : 'ID';
    updateHomeTranslations();
    
    // Event listener untuk toggle bahasa
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'id' ? 'en' : 'id';
        localStorage.setItem('language', currentLang);
        langToggle.textContent = currentLang === 'id' ? 'EN' : 'ID';
        document.documentElement.lang = currentLang;
        updateHomeTranslations();
    });
}

function updateHomeTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (homeTranslations[currentLang][key]) {
            element.textContent = homeTranslations[currentLang][key];
        }
    });
}

// ============================================
// THEME TOGGLE
// ============================================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    
    // Load saved theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Event listener untuk toggle theme
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-left, .slide-right').forEach(el => {
        observer.observe(el);
    });
}
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initHomeLanguage();
    initTheme();
    initScrollAnimations();
    initSmoothScroll();
});