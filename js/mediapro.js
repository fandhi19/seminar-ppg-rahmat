/**
 * ============================================================================
 * MEDIAPRO THEME SCRIPT - E-PORTOFOLIO SEMINAR PENDIDIKAN
 * Rahmat Irnandi, S.Or. | PPG Calon Guru Universitas Negeri Yogyakarta
 * ============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initNavbarSticky();
    initMobileNav();
    initScrollReveal();
    initCounterAnimation();
    initVideoModal();
    initTestimonials();
    initBackToTop();
    init3DTilt();
  });

  /* 1. Scroll Progress Bar */
  function initScrollProgress() {
    const line = document.getElementById('scrollProgressLine');
    if (!line) return;

    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      line.style.width = progress + '%';
    }, { passive: true });
  }

  /* 2. Navbar Sticky */
  function initNavbarSticky() {
    const nav = document.getElementById('navbarMediaPro');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* 3. Mobile Navigation */
  function initMobileNav() {
    const btn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('mobileOverlay');
    const closeBtn = document.getElementById('mobileCloseBtn');

    if (!btn || !drawer) return;

    function openNav() {
      drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    if (overlay) overlay.addEventListener('click', closeNav);

    // Close on link click
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  /* 4. Scroll Reveal */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-init');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  /* 5. Animated Counter */
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const duration = 1600; // ms
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current);
            }
          }, stepTime);

          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(counter => observer.observe(counter));
  }

  /* 6. Video Modal */
  function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('modalVideoPlayer');
    const closeBtn = document.getElementById('videoModalClose');
    const titleEl = document.getElementById('videoModalTitle');
    const triggers = document.querySelectorAll('[data-video-src]');

    if (!modal || !player) return;

    function openModal(src, title) {
      player.src = src;
      if (titleEl && title) titleEl.textContent = title;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      player.play().catch(() => {});
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      player.pause();
      player.currentTime = 0;
      player.src = '';
    }

    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const src = btn.getAttribute('data-video-src');
        const title = btn.getAttribute('data-video-title') || 'Video Dokumentasi Karya';
        if (src) openModal(src, title);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  /* 7. Testimonials Carousel / Switcher */
  function initTestimonials() {
    const quotes = [
      {
        quote: "Penerapan media inovasi pembelajaran PJOK yang dirancang oleh Mas Rahmat Irnandi sangat efektif membangkitkan semangat berolahraga peserta didik. Siswa yang awalnya pasif menjadi sangat aktif bergerak, menjunjung sportivitas, dan memahami pentingnya menjaga kebugaran tubuh.",
        author: "Dra. Sri Wahyuni, M.Pd.",
        role: "Guru Pamong PJOK • SMK N 3 Kasihan Yogyakarta",
        stat1: "100%",
        stat2: "95%",
        stat3: "100%"
      },
      {
        quote: "Integrasi antara konsep filosofis Ki Hadjar Dewantara mengenai keselarasan Olah Raga dan inovasi pembelajaran gerak aktif menunjukkan kematangan pedagogik serta kompetensi profesional yang membanggakan dari mahasiswa PPG PJOK UNY.",
        author: "Dosen Pembimbing Lapangan, M.Or.",
        role: "Dosen Pembimbing Lapangan • FIKK Universitas Negeri Yogyakarta",
        stat1: "Unggul",
        stat2: "A",
        stat3: "100%"
      },
      {
        quote: "Pelajaran olahraga sama Pak Rahmat seru banget! Kami nggak cuma disuruh lari-lari biasa, tapi ada modifikasi permainan menarik yang bikin semua teman sekelas ikut aktif bergerak dan kompak saling bantu.",
        author: "Perwakilan Siswa Kelas X & Tim",
        role: "Peserta Didik • SMK N 3 Kasihan Yogyakarta",
        stat1: "Seru!",
        stat2: "100%",
        stat3: "Bugar"
      }
    ];

    let currentIndex = 0;
    const quoteEl = document.getElementById('testimonialQuote');
    const authorEl = document.getElementById('testimonialAuthor');
    const roleEl = document.getElementById('testimonialRole');
    const prevBtn = document.getElementById('tNavPrev');
    const nextBtn = document.getElementById('tNavNext');

    if (!quoteEl || !authorEl || !roleEl) return;

    function renderTestimonial(idx) {
      quoteEl.style.opacity = '0';
      authorEl.style.opacity = '0';
      roleEl.style.opacity = '0';

      setTimeout(() => {
        const item = quotes[idx];
        quoteEl.textContent = `"${item.quote}"`;
        authorEl.textContent = item.author;
        roleEl.textContent = item.role;

        quoteEl.style.opacity = '1';
        authorEl.style.opacity = '1';
        roleEl.style.opacity = '1';
      }, 250);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
        renderTestimonial(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % quotes.length;
        renderTestimonial(currentIndex);
      });
    }

    // Auto rotate every 8 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % quotes.length;
      renderTestimonial(currentIndex);
    }, 8000);
  }

  /* 8. Back to Top */
  function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* 9. Subtle 3D Card Tilt on Mouse Move */
  function init3DTilt() {
    const cards = document.querySelectorAll('.feature-strip-card, .service-white-card, .pricing-tier-card, .course-card-dark, .course-card-light');
    if (!cards.length) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

})();
