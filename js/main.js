/**
 * AURUM RESTAURANT — Main JS Entry Point
 * ========================================
 * Orchestrates:
 *   - Page loader
 *   - Navbar scroll behavior + mobile menu
 *   - Menu tabs
 *   - Testimonials slider
 *   - Smooth anchor scrolling
 *   - Imports & initialises all modules
 */

'use strict';

import { initAnimations } from './animations.js';
import { initForm }       from './form.js';


/* ---- Page Loader ---- */

const initLoader = () => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 600);
  });
};


/* ---- Navbar ---- */

const initNavbar = () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Scroll-triggered class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on init

  // Mobile hamburger
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (!hamburger || !mobileMenu) return;

  const toggleMenu = () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
};


/* ---- Menu Tabs ---- */

const initMenuTabs = () => {
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels with a quick fade
      panels.forEach(panel => {
        if (panel.id === target) {
          panel.classList.add('active');
          panel.style.opacity = '0';
          requestAnimationFrame(() => {
            panel.style.transition = 'opacity 0.4s ease';
            panel.style.opacity = '1';
          });
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
};


/* ---- Testimonials Slider ---- */

const initSlider = () => {
  const slider = document.querySelector('.testimonios-slider');
  const cards  = document.querySelectorAll('.testimonio-card');
  const dots   = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (!slider || !cards.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  const getVisible = () => {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const totalSlides = () => Math.max(0, cards.length - getVisible());

  const goTo = (index) => {
    currentIndex = Math.max(0, Math.min(index, totalSlides()));

    // Calculate offset
    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(getComputedStyle(slider).gap) || 24;
    const offset = currentIndex * (cardWidth + gap);
    slider.style.transform = `translateX(-${offset}px)`;

    // Update dots
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  };

  const next = () => goTo(currentIndex >= totalSlides() ? 0 : currentIndex + 1);
  const prev = () => goTo(currentIndex <= 0 ? totalSlides() : currentIndex - 1);

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Autoplay
  const startAutoplay = () => {
    autoplayTimer = setInterval(next, 5000);
  };

  const stopAutoplay = () => {
    clearInterval(autoplayTimer);
  };

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Touch / swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    startAutoplay();
  }, { passive: true });

  // Recalculate on resize
  window.addEventListener('resize', () => goTo(0), { passive: true });

  startAutoplay();
  goTo(0);
};


/* ---- Smooth Scroll ---- */

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight ?? 80;

      window.scrollTo({
        top: target.offsetTop - navHeight,
        behavior: 'smooth'
      });
    });
  });
};


/* ---- Boot ---- */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initMenuTabs();
  initSlider();
  initSmoothScroll();
  initAnimations();
  initForm();
});
