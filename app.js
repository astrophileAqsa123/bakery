/* ═══════════════════════════════════════════════════════════
   MAISON DORÉE — JavaScript Engine
   GSAP · Lenis · Cursor · Particles · Interactions
═══════════════════════════════════════════════════════════ */

"use strict";

/* ─── UTILS ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/* ─── STATE ─────────────────────────────────────────────── */
let mouse = { x: 0, y: 0 };
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;
let scrollY = 0;
let testiIndex = 0;
let testiTimer = null;
let isMenuOpen = false;
let lenis = null;

/* ═══════════════════ 1. PRELOADER ═════════════════════════ */
function initPreloader() {
  const preloader = $('#preloader');
  if (!preloader) return;

  // After 2.2s, fade out and remove preloader
  setTimeout(() => {
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
        initHeroAnimations();
        initScrollAnimations();
      }
    });
  }, 2200);
}

/* ═══════════════════ 2. LENIS SMOOTH SCROLL ═══════════════ */
function initLenis() {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  lenis.on('scroll', ({ scroll }) => {
    scrollY = scroll;
    updateHeader(scroll);
    ScrollTrigger.update();
  });

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ═══════════════════ 3. HEADER ════════════════════════════ */
function updateHeader(scroll) {
  const header = $('#header');
  if (!header) return;
  if (scroll > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

function initHeader() {
  // GSAP fade in header
  gsap.fromTo('#header', 
    { y: -80, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 2.5 }
  );

  // Mobile hamburger
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      hamburger.classList.toggle('active', isMenuOpen);
      mobileNav.classList.toggle('open', isMenuOpen);
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    });

    $$('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ═══════════════════ 4. CURSOR ════════════════════════════ */
function initCursor() {
  const cursor = $('#cursor');
  const follower = $('#cursor-follower');
  if (!cursor || !follower) return;
  if ('ontouchstart' in window) { cursor.style.display = 'none'; follower.style.display = 'none'; return; }

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animateCursor() {
    cursorX = lerp(cursorX, mouse.x, 0.9);
    cursorY = lerp(cursorY, mouse.y, 0.9);
    followerX = lerp(followerX, mouse.x, 0.12);
    followerY = lerp(followerY, mouse.y, 0.12);

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover state
  const interactiveEls = $$('a, button, .magnetic, .nav-link, .dessert-card, .featured-item, .gallery-item');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      follower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      follower.classList.remove('hovered');
    });
  });
}

/* ═══════════════════ 5. MAGNETIC BUTTONS ══════════════════ */
function initMagnetic() {
  const magneticEls = $$('.magnetic');
  magneticEls.forEach(el => {
    const strength = 0.35;
    const boundEl = el;

    boundEl.addEventListener('mousemove', (e) => {
      const rect = boundEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(boundEl, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    });

    boundEl.addEventListener('mouseleave', () => {
      gsap.to(boundEl, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
    });
  });
}

/* ═══════════════════ 6. NOISE CANVAS ══════════════════════ */
function initNoise() {
  const canvas = $('#noise-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let frame = 0;
  function drawNoise() {
    frame++;
    if (frame % 3 !== 0) { requestAnimationFrame(drawNoise); return; }

    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() * 255) | 0;
      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(drawNoise);
  }
  drawNoise();
}

/* ═══════════════════ 7. PARTICLES ════════════════════════ */
function initParticles() {
  const canvas = $('#particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const COUNT = window.innerWidth < 768 ? 25 : 50;

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -Math.random() * 0.6 - 0.2;
      this.size = Math.random() * 2.5 + 0.5;
      this.opacity = Math.random() * 0.4 + 0.05;
      this.type = Math.random() < 0.3 ? 'sparkle' : 'dot';
      this.life = 1;
      this.decay = Math.random() * 0.003 + 0.001;
    }
    update() {
      this.x += this.vx + Math.sin(Date.now() * 0.0005 + this.y * 0.01) * 0.2;
      this.y += this.vy;
      this.life -= this.decay;
      if (this.y < -10 || this.life <= 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * this.life;
      if (this.type === 'sparkle') {
        ctx.strokeStyle = '#C9A66B';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        const s = this.size * 2;
        ctx.moveTo(this.x, this.y - s);
        ctx.lineTo(this.x, this.y + s);
        ctx.moveTo(this.x - s, this.y);
        ctx.lineTo(this.x + s, this.y);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#C9A66B';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < COUNT; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height; // distribute on start
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ═══════════════════ 8. HERO FLOATING CAKE ══════════════ */
function initHeroAnimations() {
  const cake = $('#hero-cake');
  if (!cake) return;

  // Floating animation
  gsap.to(cake, {
    y: -24,
    rotation: 1.5,
    duration: 3.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  // Mouse parallax on hero
  const heroSection = $('.hero');
  if (!heroSection) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) / cx;
    const dy = (e.clientY - rect.top - cy) / cy;

    gsap.to(cake, { x: dx * 18, y: dy * 10 + (-24 * Math.sin(Date.now() * 0.001)), duration: 0.8, ease: 'power2.out', overwrite: false });
    gsap.to('.hero-left', { x: dx * -8, y: dy * -4, duration: 0.8, ease: 'power2.out' });
    gsap.to('.blob-1', { x: dx * 30, y: dy * 20, duration: 1.2, ease: 'power2.out' });
    gsap.to('.blob-2', { x: dx * -20, y: dy * -15, duration: 1.2, ease: 'power2.out' });
  });

  heroSection.addEventListener('mouseleave', () => {
    gsap.to('.hero-left', { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1,0.5)' });
    gsap.to(['.blob-1', '.blob-2'], { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1,0.5)' });
  });
}

/* ═══════════════════ 9. SCROLL ANIMATIONS ════════════════ */
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Reveal up
  $$('.reveal-up').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        const delay = parseFloat(el.style.getPropertyValue('--delay') || '0');
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: delay,
          ease: 'power3.out',
        });
      },
      once: true,
    });
  });

  // Reveal left
  $$('.reveal-left').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(el, { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' });
      },
      once: true,
    });
  });

  // Reveal right
  $$('.reveal-right').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        const delay = parseFloat(el.style.getPropertyValue('--delay') || '0');
        gsap.to(el, { opacity: 1, x: 0, duration: 1.1, delay: delay, ease: 'power3.out' });
      },
      once: true,
    });
  });

  // Section title blur reveal
  $$('.section-title').forEach(el => {
    gsap.set(el, { filter: 'blur(12px)', opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(el, { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
      },
      once: true,
    });
  });

  // Marquee parallax
  ScrollTrigger.create({
    trigger: '.marquee-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
      const speed = self.getVelocity() / 80;
      gsap.to('.marquee-content', { skewX: clamp(speed * 0.05, -5, 5), duration: 0.5, ease: 'power2.out' });
    }
  });

  // Parallax images
  $$('[data-parallax]').forEach(el => {
    const strength = parseFloat(el.getAttribute('data-parallax')) || 0.2;
    gsap.to(el, {
      y: () => strength * 100 * (scrollY / window.innerHeight),
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  });

  // Ingredient items stagger
  initIngredientsStagger();

  // Editorial gold line
  ScrollTrigger.create({
    trigger: '.editorial-gold-line',
    start: 'top 85%',
    onEnter: () => {
      gsap.fromTo('.editorial-gold-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.out', transformOrigin: 'left' }
      );
    },
    once: true,
  });

  // Seasonal drips
  $$('.seasonal-drip').forEach((drip, i) => {
    ScrollTrigger.create({
      trigger: '.seasonal',
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo(drip,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.8, delay: i * 0.15, ease: 'power2.out', transformOrigin: 'top' }
        );
      },
      once: true,
    });
  });

  // Footer gold line animation
  ScrollTrigger.create({
    trigger: '.footer-gold-line',
    start: 'top 95%',
    onEnter: () => {
      gsap.fromTo('.footer-gold-line',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1.5, ease: 'power3.out', transformOrigin: 'left' }
      );
    },
    once: true,
  });
}

/* ═══════════════════ 10. INGREDIENTS STAGGER ════════════ */
function initIngredientsStagger() {
  const items = $$('.ingredient-item');
  ScrollTrigger.create({
    trigger: '#ingredients-list',
    start: 'top 80%',
    onEnter: () => {
      items.forEach((item, i) => {
        setTimeout(() => {
          item.classList.add('revealed-item');
        }, i * 120);
      });
    },
    once: true,
  });
}

/* ═══════════════════ 11. TILT EFFECT ═════════════════════ */
function initTilt() {
  const tiltCards = $$('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const maxRot = 8;
      gsap.to(card, {
        rotationY: dx * maxRot,
        rotationX: -dy * maxRot,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' });
    });
  });
}

/* ═══════════════════ 12. TESTIMONIALS ═══════════════════ */
function initTestimonials() {
  const cards = $$('.testimonial-card');
  const dots = $$('.testi-dot');
  const track = $('#testimonial-track');
  if (!cards.length) return;

  function goTo(index) {
    const old = testiIndex;
    testiIndex = (index + cards.length) % cards.length;

    cards[old].classList.remove('active');
    dots[old].classList.remove('active');

    if (track) {
      gsap.to(track, { x: `-${testiIndex * 100}%`, duration: 0.7, ease: 'power3.inOut' });
    }

    cards[testiIndex].classList.add('active');
    dots[testiIndex].classList.add('active');
  }

  const prevBtn = $('#testi-prev');
  const nextBtn = $('#testi-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(testiIndex - 1); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(testiIndex + 1); resetTimer(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      resetTimer();
    });
  });

  function startTimer() {
    testiTimer = setInterval(() => goTo(testiIndex + 1), 5000);
  }
  function resetTimer() {
    clearInterval(testiTimer);
    startTimer();
  }
  startTimer();
}

/* ═══════════════════ 13. GSAP CARD HOVERS ═══════════════ */
function initCardAnimations() {
  $$('.dessert-card').forEach(card => {
    const img = card.querySelector('.card-img');
    const glow = card.querySelector('.card-glow');
    const btn = card.querySelector('.card-btn');

    card.addEventListener('mouseenter', () => {
      if (btn) {
        gsap.fromTo(btn, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
      }
    });
  });
}

/* ═══════════════════ 14. TEXT MASK REVEAL ══════════════ */
function initTextMaskReveals() {
  $$('.hero-word').forEach((word) => {
    const delay = parseFloat(word.getAttribute('data-delay') || 0);
    // Already handled by CSS animations
  });
}

/* ═══════════════════ 15. GALLERY CURSOR ════════════════ */
function initGallery() {
  $$('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to('#cursor', { width: 60, height: 60, duration: 0.3, ease: 'power2.out' });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to('#cursor', { width: 12, height: 12, duration: 0.3, ease: 'power2.out' });
    });
  });
}

/* ═══════════════════ 16. SMOOTH NAV LINKS ══════════════ */
function initSmoothLinks() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = $(link.getAttribute('href'));
      if (target && lenis) {
        lenis.scrollTo(target, { duration: 1.8, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      }
    });
  });
}

/* ═══════════════════ 17. RESIZE HANDLER ════════════════ */
function initResize() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });
}

/* ═══════════════════ 18. SEASONAL CAKE GLOW ══════════ */
function initSeasonalAnimations() {
  ScrollTrigger.create({
    trigger: '.seasonal',
    start: 'top 60%',
    onEnter: () => {
      gsap.to('.seasonal-img-glow', {
        opacity: 1,
        scale: 1.2,
        duration: 2,
        ease: 'power2.out',
      });
    },
    once: true,
  });
}

/* ═══════════════════ 19. FEATURED HOVER PARALLAX ═══ */
function initFeaturedParallax() {
  $$('.featured-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      const img = item.querySelector('.featured-img');
      if (img) {
        gsap.to(img, { x: dx * 15, y: dy * 10, duration: 0.5, ease: 'power2.out' });
      }
    });
    item.addEventListener('mouseleave', () => {
      const img = item.querySelector('.featured-img');
      if (img) {
        gsap.to(img, { x: 0, y: 0, duration: 0.8, ease: 'power3.out' });
      }
    });
  });
}

/* ═══════════════════ 20. NEWSLETTER INTERACTION ════ */
function initNewsletter() {
  const input = $('.newsletter-input');
  const btn = $('.newsletter-btn');
  if (!input || !btn) return;

  btn.addEventListener('click', () => {
    const val = input.value.trim();
    if (val && val.includes('@')) {
      gsap.to(btn, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
      input.value = '';
      input.placeholder = 'Thank you! 🥐';
      setTimeout(() => { input.placeholder = 'your@email.com'; }, 3000);
    }
  });
}

/* ═══════════════════ 21. PAGE LOAD SEQUENCE ════════ */
function initPageLoadSequence() {
  // Initial body state
  gsap.set('body', { visibility: 'visible' });
}

/* ═══════════════════ MAIN INIT ══════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPageLoadSequence();
  initNoise();
  initParticles();
  initPreloader();
  initLenis();
  initHeader();
  initCursor();
  initMagnetic();
  initTilt();
  initTestimonials();
  initCardAnimations();
  initGallery();
  initSmoothLinks();
  initResize();
  initSeasonalAnimations();
  initFeaturedParallax();
  initNewsletter();
});

/* ═══════════════════ SCROLL PROGRESS ════════════════ */
window.addEventListener('scroll', () => {
  // handled by lenis
}, { passive: true });
