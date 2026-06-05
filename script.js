/**
 * EcoCycle Hub — script.js
 * Funcionalidades: navbar, scroll animations, counter, mobile menu, back-to-top
 */

/* ──────────────────────────────────────────────
   1. NAVBAR — scroll effect + menú móvil
────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.querySelector('.navbar');
  const toggle    = document.querySelector('.nav-toggle');
  const menu      = document.querySelector('.nav-menu');
  const navLinks  = document.querySelectorAll('.nav-link');

  // Crear overlay para el menú móvil
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  // Scroll: añadir clase "scrolled" al navbar
  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Ejecutar al cargar

  // Abrir / cerrar menú móvil
  function toggleMenu(open) {
    const isOpen = typeof open === 'boolean' ? open : !menu.classList.contains('open');
    menu.classList.toggle('open', isOpen);
    overlay.classList.toggle('open', isOpen);
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => toggleMenu());
  overlay.addEventListener('click', () => toggleMenu(false));

  // Cerrar menú al hacer clic en un enlace
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      toggleMenu(false);
      toggle.focus();
    }
  });
})();


/* ──────────────────────────────────────────────
   2. REVEAL ON SCROLL — Intersection Observer
────────────────────────────────────────────── */
(function initReveal() {
  const options = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animar solo una vez
      }
    });
  }, options);

  // Observar elementos con clase .reveal y .fade-in
  document.querySelectorAll('.reveal, .fade-in').forEach(el => {
    observer.observe(el);
  });
})();


/* ──────────────────────────────────────────────
   3. CONTADOR ANIMADO — estadísticas del hero
────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3); // Cubic ease-out
  const DURATION = 1800; // ms

  function animateCounter(el) {
    const target  = parseInt(el.getAttribute('data-target'), 10);
    const start   = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const value    = Math.round(easeOut(progress) * target);
      el.textContent = value.toLocaleString('es');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('es');
      }
    }

    requestAnimationFrame(step);
  }

  // Disparar cuando el hero sea visible
  const heroSection = document.querySelector('.hero');
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(animateCounter);
        heroObserver.disconnect(); // Solo una vez
      }
    });
  }, { threshold: 0.3 });

  if (heroSection) heroObserver.observe(heroSection);
})();


/* ──────────────────────────────────────────────
   4. SMOOTH SCROLL — anclas internas
────────────────────────────────────────────── */
(function initSmoothScroll() {
  const NAVBAR_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });

      // Actualizar foco para accesibilidad
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();


/* ──────────────────────────────────────────────
   5. BACK TO TOP — botón flotante
────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  function onScroll() {
    if (window.scrollY > 400) {
      btn.hidden = false;
      // Pequeño delay para la transición CSS
      requestAnimationFrame(() => btn.classList.add('visible'));
    } else {
      btn.classList.remove('visible');
      // Esperar a que la transición termine antes de ocultar
      btn.addEventListener('transitionend', () => {
        if (!btn.classList.contains('visible')) btn.hidden = true;
      }, { once: true });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ──────────────────────────────────────────────
   6. AÑO ACTUAL — footer copyright
────────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ──────────────────────────────────────────────
   7. ACTIVE NAV LINK — resaltar sección actual
────────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
          if (href === `#${id}`) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -50% 0px'
  });

  sections.forEach(section => observer.observe(section));
})();


/* ──────────────────────────────────────────────
   8. HOVER TILT — tarjetas ODS (efecto sutil)
────────────────────────────────────────────── */
(function initTiltEffect() {
  // Solo en dispositivos con puntero fino (mouse)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cards = document.querySelectorAll('.ods-card, .impacto-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const deltaX  = (e.clientX - centerX) / (rect.width  / 2);
      const deltaY  = (e.clientY - centerY) / (rect.height / 2);

      const tiltX = deltaY * -4; // Máximo 4° de inclinación
      const tiltY = deltaX *  4;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
