/**
 * AURUM RESTAURANT — Bundle (sin módulos ES6)
 * Funciona abriendo index.html directamente desde el sistema de archivos.
 * ============================================================
 */

'use strict';

/* ============================================================
   UTILIDADES
   ============================================================ */

const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];


/* ============================================================
   PAGE LOADER
   ============================================================ */

const initLoader = () => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Ocultar loader cuando todo ha cargado
  const hide = () => setTimeout(() => loader.classList.add('hidden'), 500);

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide);
    // Fallback: ocultar tras 3s aunque no cargue todo
    setTimeout(() => loader.classList.add('hidden'), 3000);
  }
};


/* ============================================================
   NAVBAR
   ============================================================ */

const initNavbar = () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger / menú móvil
  const hamburger = $('.nav-hamburger');
  const mobileMenu = $('.nav-mobile');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar al hacer clic en un enlace del menú móvil
  $$('a', mobileMenu).forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
};


/* ============================================================
   SMOOTH SCROLL
   ============================================================ */

const initSmoothScroll = () => {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight ?? 80;
      window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });
    });
  });
};


/* ============================================================
   SCROLL REVEAL (Intersection Observer)
   ============================================================ */

const initScrollReveal = () => {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
};


/* ============================================================
   HERO PARALLAX & ZOOM
   ============================================================ */

const initHeroParallax = () => {
  const wrapper = $('.hero-bg');
  const heroBg  = $('.hero-bg img');
  if (!wrapper) return;

  // Slow zoom-out al cargar
  requestAnimationFrame(() => {
    setTimeout(() => wrapper.classList.add('loaded'), 200);
  });

  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const scrollY = window.scrollY;
    if (scrollY <= hero.offsetHeight) {
      heroBg.style.transform = `scale(1) translateY(${scrollY * 0.25}px)`;
    }
  }, { passive: true });
};


/* ============================================================
   COUNTER ANIMATION
   ============================================================ */

const animateCounter = (el, target, duration = 1800) => {
  const start     = performance.now();
  const isDecimal = String(target).includes('.');

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = eased * target;
    el.textContent = isDecimal
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString('es-ES');
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('es-ES');
  };
  requestAnimationFrame(tick);
};

const initCounters = () => {
  const counters = $$('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseFloat(entry.target.dataset.counter));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
};


/* ============================================================
   MENU TABS
   ============================================================ */

const initMenuTabs = () => {
  const tabs   = $$('.menu-tab');
  const panels = $$('.menu-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        if (panel.id === target) {
          panel.classList.add('active');
          panel.style.opacity = '0';
          requestAnimationFrame(() => {
            panel.style.transition = 'opacity 0.4s ease';
            panel.style.opacity    = '1';
          });
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
};


/* ============================================================
   TESTIMONIALS SLIDER
   ============================================================ */

const initSlider = () => {
  const slider  = $('.testimonios-slider');
  const cards   = $$('.testimonio-card');
  const dots    = $$('.slider-dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  if (!slider || !cards.length) return;

  let current      = 0;
  let autoplayTimer = null;

  const getVisible = () => {
    if (window.innerWidth <= 768)  return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const maxIndex = () => Math.max(0, cards.length - getVisible());

  const goTo = (index) => {
    current = Math.max(0, Math.min(index, maxIndex()));
    const gap    = 24;
    const width  = cards[0].offsetWidth + gap;
    slider.style.transform = `translateX(-${current * width}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const next = () => goTo(current >= maxIndex() ? 0 : current + 1);
  const prev = () => goTo(current <= 0 ? maxIndex() : current - 1);

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Autoplay
  const startAuto = () => { autoplayTimer = setInterval(next, 5000); };
  const stopAuto  = () => { clearInterval(autoplayTimer); };

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  // Touch swipe
  let touchX = 0;
  slider.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  slider.addEventListener('touchend',   e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    startAuto();
  }, { passive: true });

  window.addEventListener('resize', () => goTo(0), { passive: true });

  startAuto();
  goTo(0);
};


/* ============================================================
   RESERVATION FORM
   ============================================================ */

const validators = {
  nombre:     v => v.trim().length >= 2     ? null : 'Introduce tu nombre completo.',
  email:      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Correo electrónico no válido.',
  telefono:   v => /^[+]?[\d\s\-()\u00A0]{7,15}$/.test(v.trim()) ? null : 'Teléfono no válido.',
  comensales: v => (parseInt(v) >= 1 && parseInt(v) <= 20) ? null : 'Entre 1 y 20 comensales.',
  fecha: v => {
    if (!v) return 'Selecciona una fecha.';
    const chosen = new Date(v), today = new Date();
    today.setHours(0, 0, 0, 0);
    return chosen >= today ? null : 'La fecha debe ser hoy o posterior.';
  },
  hora: v => v ? null : 'Selecciona un horario.',
};

const showFieldError = (input, msg) => {
  input.classList.add('error');
  const err = input.closest('.form-group')?.querySelector('.form-error-msg');
  if (err) { err.textContent = msg; err.classList.add('visible'); }
};

const clearFieldError = (input) => {
  input.classList.remove('error');
  const err = input.closest('.form-group')?.querySelector('.form-error-msg');
  if (err) err.classList.remove('visible');
};

const validateField = (input) => {
  const fn = validators[input.name];
  if (!fn) return true;
  const error = fn(input.value);
  if (error) { showFieldError(input, error); return false; }
  clearFieldError(input);
  return true;
};

const initForm = () => {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  // Min date = today
  const dateInput = document.getElementById('fecha');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  // Live validation
  $$('input, select, textarea', form).forEach(el => {
    el.addEventListener('blur',  () => validateField(el));
    el.addEventListener('input', () => { if (el.classList.contains('error')) validateField(el); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    $$('[name]', form).forEach(f => { if (f.name in validators && !validateField(f)) valid = false; });
    if (!valid) return;

    const btn = form.querySelector('[type="submit"]');
    btn.disabled  = true;
    btn.innerHTML = '<span>Enviando…</span>';

    // Simular envío async
    setTimeout(() => {
      form.style.display = 'none';
      const ok = document.getElementById('form-success');
      if (ok) ok.classList.add('visible');
    }, 1400);
  });
};


/* ============================================================
   DISH MODAL
   ============================================================ */

const initDishModal = () => {
  const modal     = document.getElementById('dish-modal');
  const backdrop  = modal?.querySelector('.dish-modal-backdrop');
  const closeBtn  = document.getElementById('modal-close');
  const modalCta  = document.getElementById('modal-cta');
  if (!modal) return;

  // Fields to populate
  const fields = {
    img:         document.getElementById('modal-img'),
    badge:       document.getElementById('modal-badge'),
    category:    document.getElementById('modal-category'),
    name:        document.getElementById('modal-dish-name'),
    price:       document.getElementById('modal-price'),
    desc:        document.getElementById('modal-desc'),
    ingredients: document.getElementById('modal-ingredients'),
    wine:        document.getElementById('modal-wine'),
    time:        document.getElementById('modal-time'),
    allergens:   document.getElementById('modal-allergens'),
  };

  const openModal = (card) => {
    const d = card.dataset;
    fields.img.src            = d.dishImg || '';
    fields.img.alt            = d.dishName || '';
    fields.badge.textContent  = d.dishBadge || '';
    fields.category.textContent = d.dishCategory || '';
    fields.name.textContent   = d.dishName || '';
    fields.price.textContent  = d.dishPrice || '';
    fields.desc.textContent   = d.dishDesc || '';
    fields.ingredients.textContent = d.dishIngredients || '';
    fields.wine.textContent   = d.dishWine || '';
    fields.time.textContent   = d.dishTime || '';
    fields.allergens.textContent = d.dishAllergens || '';

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus the close button for accessibility
    setTimeout(() => closeBtn?.focus(), 100);
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Open on card click or Enter/Space key
  document.querySelectorAll('.dish-card[data-dish-name]').forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  // Close on backdrop, button, or Escape
  backdrop?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  modalCta?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
};


/* ============================================================
   COPYRIGHT YEAR
   ============================================================ */

const initYear = () => {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
};


/* ============================================================
   BOOT — esperar DOM listo
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initSmoothScroll();
  initScrollReveal();
  initHeroParallax();
  initCounters();
  initMenuTabs();
  initSlider();
  initForm();
  initDishModal();
  initYear();
});
