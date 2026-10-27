/**
 * ============================================================================
 * E-PORTFOLIO SEMINAR PENDIDIKAN - ILYAS FANDHI ANGGARA
 * INTERACTIVE APP SCRIPT (SHARED ACROSS ALL PAGES)
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==================== 1. SCROLL PROGRESS BAR ==================== */
  function initScrollProgress() {
    let bar = document.querySelector('.scroll-progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress-bar';
      document.body.prepend(bar);
    }

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      bar.style.width = scrolled + '%';
    }, { passive: true });
  }

  /* ==================== 2. THEME TOGGLE ==================== */
  function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    const label = document.getElementById('themeLabel');
    const body = document.body;

    const saved = localStorage.getItem('portfolio-theme');
    const preferLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initLight = saved === 'light' || (!saved && preferLight);

    if (initLight) {
      body.setAttribute('data-theme', 'light');
      if (label) label.textContent = 'GELAP';
    }

    if (btn) {
      btn.addEventListener('click', () => {
        const isLight = body.getAttribute('data-theme') === 'light';
        if (isLight) {
          body.removeAttribute('data-theme');
          if (label) label.textContent = 'TERANG';
          localStorage.setItem('portfolio-theme', 'dark');
          showToast('🌙 Mode Gelap diaktifkan');
        } else {
          body.setAttribute('data-theme', 'light');
          if (label) label.textContent = 'GELAP';
          localStorage.setItem('portfolio-theme', 'light');
          showToast('☀️ Mode Terang diaktifkan');
        }
      });
    }
  }

  /* ==================== 3. CUSTOM CURSOR & CLICK RIPPLE ==================== */
  function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(renderRing);
    }
    renderRing();

    // Click Ripple
    document.addEventListener('click', (e) => {
      // Don't ripple if clicking iframe
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });

    // Hover interactive state
    function attachCursorHovers() {
      const targets = document.querySelectorAll(
        'a, button, input, .course-btn, .dark-card, .reflection-card, .artifact-card, .vision-card, .action-card, .commitment-card, .gallery-item, .hero-image-wrapper, .about-image, .identity-figure, .filter-chip, .karya-card, .karya-btn'
      );

      targets.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          dot.classList.add('cursor-active');
          ring.classList.add('cursor-active');
        });
        el.addEventListener('mouseleave', () => {
          dot.classList.remove('cursor-active');
          ring.classList.remove('cursor-active');
        });
      });
    }

    attachCursorHovers();
    // Expose in case DOM updates dynamically
    window.attachCursorHovers = attachCursorHovers;
  }

  /* ==================== 4. CARD SPOTLIGHT & 3D TILT EFFECT ==================== */
  function initSpotlightAndTilt() {
    const cards = document.querySelectorAll(
      '.dark-card, .reflection-card, .vision-card, .action-card, .commitment-card, .artifact-card, .hero-code-card, .info-item, .journey-process-item, .hero-image-wrapper, .about-image, .identity-figure, .karya-card, .karya-stat-box'
    );

    cards.forEach((card) => {
      card.classList.add('spotlight-card');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Subtle 3D tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ==================== 5. ANIMATED STAT COUNTERS ==================== */
  function initAnimatedCounters() {
    const statCards = document.querySelectorAll('.stat-card');
    if (!statCards.length) return;

    let animated = false;

    function countUp() {
      statCards.forEach((card) => {
        const valueEl = card.querySelector('.stat-value');
        if (!valueEl) return;

        const rawText = valueEl.textContent.trim();
        let target = parseInt(valueEl.getAttribute('data-target') || rawText, 10);
        const suffix = valueEl.getAttribute('data-suffix') || (rawText.includes('%') ? '%' : rawText.includes('+') ? '+' : '');
        const padZero = valueEl.getAttribute('data-pad') === 'true' || (rawText.startsWith('0') && target < 10);

        if (isNaN(target)) return;

        let current = 0;
        const duration = 1600;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          let displayVal = Math.floor(current);
          if (padZero && displayVal < 10) displayVal = '0' + displayVal;
          valueEl.textContent = displayVal + suffix;
        }, stepTime);
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          countUp();
        }
      });
    }, { threshold: 0.3 });

    statCards.forEach((el) => observer.observe(el));
  }

  /* ==================== 6. BACK TO TOP BUTTON WITH PROGRESS RING ==================== */
  function initBackToTop() {
    let btn = document.querySelector('.back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Kembali ke atas');
      btn.innerHTML = `
        <svg viewBox="0 0 48 48">
          <circle class="progress-bg" cx="24" cy="24" r="21"></circle>
          <circle class="progress-bar" id="backToTopProgress" cx="24" cy="24" r="21"></circle>
        </svg>
        <i class="fa-solid fa-arrow-up"></i>
      `;
      document.body.appendChild(btn);
    }

    const circle = btn.querySelector('#backToTopProgress');
    const circumference = 2 * Math.PI * 21; // ~131.94

    if (circle) {
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = `${circumference}`;
    }

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollFraction = height > 0 ? winScroll / height : 0;

      if (winScroll > 250) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }

      if (circle) {
        const offset = circumference - scrollFraction * circumference;
        circle.style.strokeDashoffset = offset;
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==================== 7. IMAGE LIGHTBOX MODAL ==================== */
  function initLightbox() {
    let modal = document.querySelector('.lightbox-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'lightbox-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = `
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Tutup preview">×</button>
          <img src="" alt="Preview Gambar" class="lightbox-img" id="lightboxImg" />
          <div class="lightbox-caption" id="lightboxCaption"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const imgEl = modal.querySelector('#lightboxImg');
    const capEl = modal.querySelector('#lightboxCaption');
    const closeBtn = modal.querySelector('.lightbox-close');

    function openLightbox(src, caption) {
      imgEl.src = src;
      capEl.textContent = caption || '';
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      imgEl.src = '';
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeLightbox();
    });

    // Attach click to previewable images
    const previewTargets = document.querySelectorAll(
      '.hero-image-wrapper, .about-image, .identity-figure, .gallery-item, .doc-slide-photo'
    );

    previewTargets.forEach((target) => {
      target.addEventListener('click', () => {
        const img = target.querySelector('img');
        if (img) {
          const caption =
            target.closest('.doc-slide')?.getAttribute('data-title') ||
            target.closest('.doc-card')?.querySelector('.doc-card-title')?.textContent ||
            img.getAttribute('alt') ||
            target.querySelector('strong, h3, h4')?.textContent ||
            'Dokumentasi Seminar Pendidikan';
          openLightbox(img.src, caption);
        }
      });
    });
  }

  /* ==================== 8. TOAST NOTIFICATION SYSTEM ==================== */
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  }
  window.showToast = showToast;

  /* ==================== 9. SCROLL REVEAL OBSERVER ==================== */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    reveals.forEach((el) => observer.observe(el));
  }

  /* ==================== 10. BACKGROUND CANVAS ANIMATION ==================== */
  function initBackgroundCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 22;
    let mouse = { x: -1000, y: -1000, radius: 120 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function randBetween(a, b) {
      return a + Math.random() * (b - a);
    }

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init) {
        this.x = randBetween(0, width);
        this.y = randBetween(0, height);
        const angle = randBetween(0, Math.PI * 2);
        const speed = randBetween(0.12, 0.3);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.ax = randBetween(-0.002, 0.002);
        this.ay = randBetween(-0.002, 0.002);
        this.life = 0;
        this.maxLife = randBetween(240, 480);
        this.alpha = 0;
        this.r = randBetween(1.0, 1.8);
        this.trail = [];
        this.trailLen = Math.floor(randBetween(20, 50));
        if (init) this.life = randBetween(0, this.maxLife);
      }

      update() {
        // Mouse gentle repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.vx += (dx / dist) * force * 0.08;
          this.vy += (dy / dist) * force * 0.08;
        }

        this.vx += this.ax;
        this.vy += this.ay;
        const maxSpeed = 0.5;
        const spd = Math.hypot(this.vx, this.vy);
        if (spd > maxSpeed) {
          this.vx = (this.vx / spd) * maxSpeed;
          this.vy = (this.vy / spd) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLen) this.trail.shift();

        this.life++;
        if (this.life < 60) this.alpha = this.life / 60;
        else if (this.life > this.maxLife - 60) this.alpha = (this.maxLife - this.life) / 60;
        else this.alpha = 1;

        if (
          this.life >= this.maxLife ||
          this.x < -150 ||
          this.x > width + 150 ||
          this.y < -150 ||
          this.y > height + 150
        ) {
          this.reset(false);
        }
      }

      draw() {
        if (this.trail.length < 2) return;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < this.trail.length; i++) {
          const ratio = i / this.trail.length;
          const aLine = this.alpha * ratio * 0.12;
          ctx.globalAlpha = aLine;
          ctx.strokeStyle = `rgba(255,255,255,${aLine})`;
          ctx.lineWidth = ratio * this.r * 0.6;
          ctx.beginPath();
          ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
          ctx.lineTo(this.trail[i].x, this.trail[i].y);
          ctx.stroke();
        }

        const headAlpha = this.alpha * 0.35;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3.5);
        grad.addColorStop(0, `rgba(255,255,255,${headAlpha})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
    }

    const MAX_DIST = 110;
    function drawConnections(particles) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < MAX_DIST) {
            const ratio = 1 - dist / MAX_DIST;
            const a = ratio * 0.04 * Math.min(particles[i].alpha, particles[j].alpha);
            ctx.save();
            ctx.globalAlpha = a;
            ctx.strokeStyle = `rgba(255,255,255,${a})`;
            ctx.lineWidth = ratio * 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            const mx = (particles[i].x + particles[j].x) / 2 + dy * 0.2;
            const my = (particles[i].y + particles[j].y) / 2 - dx * 0.2;
            ctx.quadraticCurveTo(mx, my, particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    function loop() {
      ctx.clearRect(0, 0, width, height);
      drawConnections(particles);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ==================== 11. MATERIAL FILTER & SEARCH (INDEX) ==================== */
  function initMaterialFilter() {
    const searchInput = document.getElementById('materialSearch');
    const filterChips = document.querySelectorAll('.filter-chip');
    const items = document.querySelectorAll('.material-item');
    if (!items.length) return;

    let activeFilter = 'all';
    let searchQuery = '';

    function filterItems() {
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const sem = item.getAttribute('data-sem') || '';
        const tag = (item.getAttribute('data-tag') || item.querySelector('.material-tag')?.textContent || '').trim().toUpperCase();

        const matchesSearch = !searchQuery || text.includes(searchQuery);
        let matchesFilter = true;

        if (activeFilter === 'sem1') {
          matchesFilter = sem === 'sem1';
        } else if (activeFilter === 'sem2') {
          matchesFilter = sem === 'sem2';
        } else if (activeFilter !== 'all') {
          matchesFilter = tag === activeFilter;
        }

        if (matchesSearch && matchesFilter) {
          item.classList.remove('hidden-item');
        } else {
          item.classList.add('hidden-item');
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterItems();
      });
    }

    filterChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        filterChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = chip.getAttribute('data-filter') || 'all';
        filterItems();
      });
    });
  }

  /* ==================== 12. RESPONSIVE MOBILE & TABLET NAVIGATION ==================== */
  function initMobileNav() {
    let toggleBtn = document.getElementById('navToggleBtn');
    let drawer = document.getElementById('navMobileDrawer');

    // Self-healing: Ensure toggle button exists inside .nav-right if missing in HTML
    const navRight = document.querySelector('.nav-right');
    if (!toggleBtn && navRight) {
      toggleBtn = document.createElement('button');
      toggleBtn.className = 'nav-toggle-btn';
      toggleBtn.id = 'navToggleBtn';
      toggleBtn.setAttribute('aria-label', 'Buka menu navigasi');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = `
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      `;
      navRight.appendChild(toggleBtn);
    }

    // Self-healing: Ensure mobile drawer markup exists if missing in HTML
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.className = 'nav-mobile-drawer';
      drawer.id = 'navMobileDrawer';
      drawer.setAttribute('aria-hidden', 'true');
      drawer.innerHTML = `
        <div class="nav-mobile-backdrop" id="navMobileBackdrop"></div>
        <div class="nav-mobile-content">
          <div class="nav-mobile-header">
            <div class="nav-mobile-brand">
              <img src="images/Logo Uny outlitne.png" alt="Logo UNY" />
              <div>
                <div class="nav-mobile-title">E-PORTOFOLIO</div>
                <div class="nav-mobile-subtitle">Seminar Pendidikan PPG</div>
              </div>
            </div>
            <button class="nav-mobile-close" id="navMobileClose" aria-label="Tutup menu navigasi">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <nav class="nav-mobile-links">
            <a href="index.html" class="nav-mobile-link" data-page="index.html">
              <div class="nav-mobile-icon"><i class="fa-solid fa-house"></i></div>
              <div class="nav-mobile-text">
                <span class="link-title">BERANDA</span>
                <span class="link-desc">Halaman Utama E-Portofolio</span>
              </div>
              <i class="fa-solid fa-chevron-right link-arrow"></i>
            </a>

            <a href="identitas.html" class="nav-mobile-link" data-page="identitas.html">
              <div class="nav-mobile-icon"><i class="fa-solid fa-user-graduate"></i></div>
              <div class="nav-mobile-text">
                <span class="link-title">VISI PRIBADI</span>
                <span class="link-desc">Visi Guru & Profil Pengembang</span>
              </div>
              <i class="fa-solid fa-chevron-right link-arrow"></i>
            </a>

            <a href="refleksi-sem1.html" class="nav-mobile-link" data-page="refleksi-sem1.html">
              <div class="nav-mobile-icon"><i class="fa-solid fa-book-bookmark"></i></div>
              <div class="nav-mobile-text">
                <span class="link-title">SEMESTER 1</span>
                <span class="link-desc">Refleksi Pembelajaran Sem 1</span>
              </div>
              <i class="fa-solid fa-chevron-right link-arrow"></i>
            </a>

            <a href="refleksi-sem2.html" class="nav-mobile-link" data-page="refleksi-sem2.html">
              <div class="nav-mobile-icon"><i class="fa-solid fa-graduation-cap"></i></div>
              <div class="nav-mobile-text">
                <span class="link-title">SEMESTER 2</span>
                <span class="link-desc">Refleksi Pembelajaran Sem 2</span>
              </div>
              <i class="fa-solid fa-chevron-right link-arrow"></i>
            </a>

            <a href="refleksi-ppg.html" class="nav-mobile-link" data-page="refleksi-ppg.html">
              <div class="nav-mobile-icon"><i class="fa-solid fa-brain"></i></div>
              <div class="nav-mobile-text">
                <span class="link-title">REFLEKSI PPG</span>
                <span class="link-desc">Refleksi Menyeluruh PPG</span>
              </div>
              <i class="fa-solid fa-chevron-right link-arrow"></i>
            </a>

            <a href="karya.html" class="nav-mobile-link" data-page="karya.html">
              <div class="nav-mobile-icon"><i class="fa-solid fa-gamepad"></i></div>
              <div class="nav-mobile-text">
                <span class="link-title">KARYA INOVATIF</span>
                <span class="link-desc">Desain Karya & Prototipe Gim</span>
              </div>
              <i class="fa-solid fa-chevron-right link-arrow"></i>
            </a>
          </nav>

          <div class="nav-mobile-footer">
            <div class="nav-mobile-user">
              <i class="fa-solid fa-id-badge"></i>
              <div>
                <strong>Ilyas Fadilah, S.Pd.</strong>
                <span>PPG Prajabatan Informatika UNY</span>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);
    }

    if (!toggleBtn || !drawer) return;

    const closeBtn = drawer.querySelector('#navMobileClose') || drawer.querySelector('.nav-mobile-close');
    const backdrop = drawer.querySelector('#navMobileBackdrop') || drawer.querySelector('.nav-mobile-backdrop');
    const mobileLinks = drawer.querySelectorAll('.nav-mobile-link');

    // Auto-highlight active link based on current page URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    mobileLinks.forEach((link) => {
      const page = link.getAttribute('data-page') || link.getAttribute('href');
      if (page === currentPath || (currentPath === '' && page === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    function openDrawer() {
      drawer.classList.add('active');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-drawer-open');
    }

    function closeDrawer() {
      drawer.classList.remove('active');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-drawer-open');
    }

    function toggleDrawer(e) {
      if (e) e.stopPropagation();
      if (drawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    }

    toggleBtn.addEventListener('click', toggleDrawer);

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeDrawer();
      }
    });
  }

  /* ==================== 13. DOKUMENTASI 3 SUB-MENU & SLIDER FRAME ==================== */
  function initDocSlider() {
    const tabBtns = document.querySelectorAll('.doc-tab-btn');
    const panes = document.querySelectorAll('.doc-slider-pane');
    if (!tabBtns.length || !panes.length) return;

    // Helper: Pause all videos
    function pauseAllVideos() {
      document.querySelectorAll('.doc-slide video').forEach((v) => {
        try {
          v.pause();
        } catch (e) {}
      });
    }

    // Initialize each slider pane independently
    panes.forEach((pane) => {
      const slides = pane.querySelectorAll('.doc-slide');
      const prevBtn = pane.querySelector('.doc-nav-arrow.prev');
      const nextBtn = pane.querySelector('.doc-nav-arrow.next');
      const counterEl = pane.querySelector('.doc-stage-counter');
      const titleEl = pane.querySelector('.doc-slide-title');
      const descEl = pane.querySelector('.doc-slide-desc');
      const tagsEl = pane.querySelector('.doc-slide-tags');
      const infoPanel = pane.querySelector('.doc-slide-info');

      let currentIdx = 0;
      const total = slides.length;

      // Create slide dots & nav buttons container in info panel (no thumbnails)
      let slideNav = pane.querySelector('.doc-slide-nav');
      if (!slideNav && infoPanel) {
        slideNav = document.createElement('div');
        slideNav.className = 'doc-slide-nav';

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'doc-slide-dots';

        for (let i = 0; i < total; i++) {
          const dot = document.createElement('button');
          dot.className = 'doc-dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', `Pindah ke slide ${i + 1}`);
          dot.addEventListener('click', () => renderSlide(i));
          dotsContainer.appendChild(dot);
        }

        const btnPair = document.createElement('div');
        btnPair.className = 'doc-nav-btn-pair';
        btnPair.innerHTML = `
          <button class="doc-ctrl-btn prev" aria-label="Slide sebelumnya"><i class="fa-solid fa-arrow-left"></i></button>
          <button class="doc-ctrl-btn next" aria-label="Slide berikutnya"><i class="fa-solid fa-arrow-right"></i></button>
        `;

        btnPair.querySelector('.prev').addEventListener('click', (e) => {
          e.preventDefault();
          renderSlide(currentIdx - 1);
        });
        btnPair.querySelector('.next').addEventListener('click', (e) => {
          e.preventDefault();
          renderSlide(currentIdx + 1);
        });

        slideNav.appendChild(dotsContainer);
        slideNav.appendChild(btnPair);
        infoPanel.appendChild(slideNav);
      }

      function renderSlide(idx) {
        if (total === 0) return;
        // Pause any video in currently active slide
        const currentActiveSlide = pane.querySelector('.doc-slide.active');
        if (currentActiveSlide) {
          const vid = currentActiveSlide.querySelector('video');
          if (vid) vid.pause();
        }

        currentIdx = (idx + total) % total;

        slides.forEach((s, i) => {
          if (i === currentIdx) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });

        // Update Dots
        if (slideNav) {
          const dots = slideNav.querySelectorAll('.doc-dot');
          dots.forEach((d, i) => {
            if (i === currentIdx) {
              d.classList.add('active');
            } else {
              d.classList.remove('active');
            }
          });
        }

        // Update Counter
        if (counterEl) {
          const num = String(currentIdx + 1).padStart(2, '0');
          const tot = String(total).padStart(2, '0');
          counterEl.textContent = `SLIDE ${num} / ${tot}`;
        }

        // Update Info Panel
        const activeSlide = slides[currentIdx];
        if (activeSlide) {
          const title = activeSlide.getAttribute('data-title') || '';
          const desc = activeSlide.getAttribute('data-desc') || '';
          const tagsStr = activeSlide.getAttribute('data-tags') || '';

          if (titleEl) titleEl.innerHTML = title;
          if (descEl) descEl.textContent = desc;

          if (tagsEl && tagsStr) {
            const tags = tagsStr.split(',').map((t) => t.trim());
            tagsEl.innerHTML = tags.map((t) => `<span class="doc-slide-tag">${t}</span>`).join('');
          }
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          renderSlide(currentIdx - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          renderSlide(currentIdx + 1);
        });
      }

      // Initial render for pane
      renderSlide(0);
    });

    // Tab buttons switching
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const targetId = btn.getAttribute('data-tab');

        pauseAllVideos();

        panes.forEach((pane) => {
          if (pane.id === targetId) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });
      });
    });
  }

  /* ==================== INITIALIZE ALL ON DOM READY ==================== */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initThemeToggle();
    initMobileNav();
    initCustomCursor();
    initSpotlightAndTilt();
    initAnimatedCounters();
    initBackToTop();
    initLightbox();
    initScrollReveal();
    initBackgroundCanvas();
    initMaterialFilter();
    initDocSlider();
  });
})();

