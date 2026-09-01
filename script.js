/* ============================================================
   PORTFOLIO — IGO NUR CAHYO
   script.js
   ============================================================ */

'use strict';

/* ─── 1. NAVBAR — scroll state & active link ────────────────── */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

function onScroll() {
  /* Sticky background */
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  /* Active nav link highlight */
  let currentId = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) {
      currentId = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load


/* ─── 2. HAMBURGER MENU ─────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

function toggleMenu(open) {
  hamburger.classList.toggle('open', open);
  navMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.contains('open');
  toggleMenu(!isOpen);
});

/* Close menu when a nav link is clicked */
navLinks.forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

/* Close menu on Escape key */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') toggleMenu(false);
});


/* ─── 3. SMOOTH SCROLL (with offset for fixed nav) ─────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetY   = target.getBoundingClientRect().top + window.scrollY - navHeight - 24;

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});


/* ─── 4. SCROLL-REVEAL (fade-up) ────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-up');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

fadeEls.forEach(el => revealObserver.observe(el));




/* ─── 6. SKILL CARD — stagger entrance on scroll ───────────── */
(function staggerSkillCards() {
  const cards = document.querySelectorAll('.skill-category');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });
})();


/* ─── 7. PROJECT CARD — tilt micro-interaction ─────────────── */
function initTilt() {
  const cards = document.querySelectorAll('.project-card');
  const MAX_TILT = 4; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotateX = -dy * MAX_TILT;
      const rotateY =  dx * MAX_TILT;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

initTilt();


/* ─── 8. NAV ACTIVE LINK — CSS class for styling ───────────── */
/* (Added via CSS — style the active nav link) */
const styleEl = document.createElement('style');
styleEl.textContent = `
  .nav-link.active {
    color: var(--text);
  }
  .nav-link.active::after {
    width: 100%;
  }
`;
document.head.appendChild(styleEl);


/* ─── 9. HERO — staggered entrance on page load ────────────── */
(function heroEntrance() {
  const heroEls = document.querySelectorAll('.hero .fade-up');
  heroEls.forEach((el, i) => {
    // Override transition delay for hero specifically
    el.style.transitionDelay = `${0.1 + i * 0.12}s`;
    // Trigger immediately
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('visible');
      });
    });
  });
})();


/* ─── 10. STAT COUNTER ANIMATION ────────────────────────────── */
function animateCounter(el, target, decimals = 0, suffix = '') {
  const duration = 1400;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = eased * target;

    el.textContent = current.toFixed(decimals) + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Observe stat numbers
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el   = entry.target;
      const text = el.textContent.trim();

      // Parse target value
      const hasPlus    = text.includes('+');
      const hasDecimal = text.includes('.');
      const raw        = parseFloat(text.replace(/[^0-9.]/g, ''));
      const decimals   = hasDecimal ? 2 : 0;
      const suffix     = hasPlus ? '+' : '';

      animateCounter(el, raw, decimals, suffix);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);

statNumbers.forEach(el => counterObserver.observe(el));


/* ─── 11. SCROLL INDICATOR — hide after first scroll ────────── */
(function hideScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;

  const hide = () => {
    if (window.scrollY > 100) {
      indicator.style.opacity = '0';
      indicator.style.pointerEvents = 'none';
      window.removeEventListener('scroll', hide);
    }
  };

  window.addEventListener('scroll', hide, { passive: true });
})();


/* ─── 12. TIMELINE ITEM — stagger on scroll ─────────────────── */
(function staggerTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.1}s`;
  });
})();


/* ─── 13. COPY EMAIL ON CLICK (optional UX) ─────────────────── */
(function copyEmail() {
  const emailLinks = document.querySelectorAll('a[href^="mailto"]');
  const original   = {};

  emailLinks.forEach(link => {
    link.addEventListener('click', e => {
      // Don't override mailto behaviour — just add a tooltip flash
      const span = link.querySelector('.contact-link') || link;

      if (link.dataset.copied) return;
      link.dataset.copied = '1';

      setTimeout(() => {
        delete link.dataset.copied;
      }, 2000);
    });
  });
})();


/* ─── 14. REDUCED MOTION — respect prefers-reduced-motion ───── */
(function respectReducedMotion() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (mediaQuery.matches) {
    // Immediately show all fade-up elements
    document.querySelectorAll('.fade-up').forEach(el => {
      el.style.transition = 'none';
      el.classList.add('visible');
    });

    // Stop float animations
    document.querySelectorAll('.stat-chip').forEach(chip => {
      chip.style.animation = 'none';
    });

    // Stop scroll indicator animation
    const scrollInd = document.querySelector('.scroll-indicator');
    if (scrollInd) scrollInd.style.animation = 'none';
  }
})();
