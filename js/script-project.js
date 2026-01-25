const projectTranslations = {
    id: {
        // Umum untuk semua halaman proyek
        "name": "Gilang Surya Ramadhan",
        "back": "Kembali ke Portfolio",
        "overview-title": "Gambaran Proyek",
        "role-label": "PERAN SAYA",
        "tools-label": "ALAT",
        "timeline-label": "WAKTU",
        "process-title": "Proses Saya",
        "challenge-title": "Tantangan",
        "source-code": "Lihat Source Code",
        "view-live": "Lihat Live Demo",
        "prev-project": "Proyek Sebelumnya",
        "next-project": "Proyek Selanjutnya",
        
        // Spesifik CRONELA
        "cronela-title": "Website Pendidikan",
        "timeline-cronela": "3 Bulan",
        "role-cronela": "Fullstack Developer",
        "cronela-overview": "Saya dan tim mengembangkan sebuah website pendidikan online yang berisi video-video pembelajaran dan juga kuis interaktif.",
        "cronela-process": "Proses pembuatan diawali dengan mencari ide website yang akan berguna bagi banyak orang. Jadi kami membuat website pendidikan, yang di dalamnya berisikan video-video pendidikan dan juga berisi kuis interaktif yang dapat menguji kemampuan pengguna",
        "cronela-challenge": "Bagian yang cukup menantang dari projek ini adalah ketika membuat section register dan login, selain itu, membuat bagian kuis agar bisa menyimpan skor user juga merupakan tugas yang cukup menantang",
        
        // Spesifik VASHION
        "vashion-title": "Website E-Commerce",
        "timeline-vashion": "2 Bulan",
        "role-vashion": "Fullstack Developer",
        "vashion-overview": "Mengembangkan platform belanja pakaian daring yang memanfaatkan komponen pengembangan web fundamental seperti HTML, CSS, dan JavaScript, terintegrasi dengan database menggunakan SQL dan PHP.",
        "vashion-process": "Kami memulai dengan riset pasar dan analisis kompetitor untuk memahami kebutuhan pengguna. Kemudian merancang UI/UX yang modern dan user-friendly, serta mengimplementasikan fitur-fitur e-commerce seperti shopping cart, wishlist, dan payment gateway.",
        "vashion-challenge": "Tantangan terbesar adalah mengintegrasikan payment gateway dan membuat sistem inventory real-time yang dapat menangani banyak transaksi secara bersamaan. Selain itu, optimasi performa untuk loading time yang cepat juga menjadi fokus utama."
    },
    en: {
        "name": "Gilang Surya Ramadhan",
        "back": "Back to Portfolio",
        "overview-title": "Project Overview",
        "role-label": "MY ROLE",
        "role-value": "Fullstack Developer",
        "tools-label": "TOOLS",
        "timeline-label": "TIMELINE",
        "process-title": "My Process",
        "challenge-title": "The Challenge",
        "source-code": "View Source Code",
        "view-live": "View Live Demo",
        "prev-project": "Previous Project",
        "next-project": "Next Project",
        
        "cronela-title": "Education Website",
        "timeline-cronela": "3 Months",
        "role-cronela": "Fullstack Developer",
        "cronela-overview": "My team and I developed an online education website that contains learning videos and interactive quizzes.",
        "cronela-process": "The creation process began with finding a website idea that would be useful for many people. So we created an educational website, which contains educational videos and also contains interactive quizzes that can test users' abilities",
        "cronela-challenge": "The quite challenging part of this project was when creating the register and login section, besides that, making the quiz section able to save user scores was also a quite challenging task",
        
        "vashion-title": "E-Commerce Website",
        "timeline-vashion": "2 Months",
        "role-vashion": "Fullstack Developer",
        "vashion-overview": "Developing an online clothing shopping platform utilizing fundamental web development components such as HTML, CSS, and JavaScript, integrated with a database using SQL and PHP.",
        "vashion-process": "We started with market research and competitor analysis to understand user needs. Then designed a modern and user-friendly UI/UX, and implemented e-commerce features such as shopping cart, wishlist, and payment gateway.",
        "vashion-challenge": "The biggest challenge was integrating the payment gateway and creating a real-time inventory system that can handle many transactions simultaneously. In addition, performance optimization for fast loading times was also a major focus."
    }
};

let currentLang = localStorage.getItem('language') || 'id';

function initProjectLanguage() {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) return;
    
    // Set initial language
    document.documentElement.lang = currentLang;
    langToggle.textContent = currentLang === 'id' ? 'EN' : 'ID';
    updateProjectTranslations();
    
    // Event listener untuk toggle bahasa
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'id' ? 'en' : 'id';
        localStorage.setItem('language', currentLang);
        langToggle.textContent = currentLang === 'id' ? 'EN' : 'ID';
        document.documentElement.lang = currentLang;
        updateProjectTranslations();
    });
}

function updateProjectTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (projectTranslations[currentLang][key]) {
            element.textContent = projectTranslations[currentLang][key];
        }
    });
}

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

    document.querySelectorAll('.fade-in, .slide-up, .zoom-in').forEach(el => {
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
                    block: 'start'
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initProjectLanguage();
    initTheme();
    initScrollAnimations();
    initSmoothScroll();
});