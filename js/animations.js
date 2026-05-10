/**
 * AURUM RESTAURANT — Scroll Animations & Parallax
 * ================================================
 * Handles:
 *   - Intersection Observer scroll reveal
 *   - Hero image parallax on scroll
 *   - Section counter animations
 */

'use strict';

/* ---- Scroll Reveal ---- */

const initScrollReveal = () => {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve once revealed to save performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
};


/* ---- Hero Parallax ---- */

const initHeroParallax = () => {
  const heroBg = document.querySelector('.hero-bg img');
  if (!heroBg) return;

  // Trigger the slow zoom-out on page load
  const wrapper = document.querySelector('.hero-bg');
  if (wrapper) {
    requestAnimationFrame(() => {
      setTimeout(() => wrapper.classList.add('loaded'), 100);
    });
  }

  // Subtle parallax on scroll
  const onScroll = () => {
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('#hero').offsetHeight;

    if (scrollY <= heroHeight) {
      const offset = scrollY * 0.3;
      heroBg.style.transform = `scale(1) translateY(${offset}px)`;
    }
  };

  // Use passive listener for performance
  window.addEventListener('scroll', onScroll, { passive: true });
};


/* ---- Number Counter Animation ---- */

const animateCounter = (el, target, duration = 1800) => {
  const start = performance.now();
  const isDecimal = String(target).includes('.');

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    el.textContent = isDecimal
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString('es-ES');

    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('es-ES');
  };

  requestAnimationFrame(tick);
};

const initCounters = () => {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.dataset.counter);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
};


/* ---- Export / Init ---- */

export const initAnimations = () => {
  initScrollReveal();
  initHeroParallax();
  initCounters();
};
