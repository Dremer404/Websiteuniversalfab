/*
 * lariya-init.js
 * Ce script est déclenché par Barba.js quand on arrive sur la vue Lariya, 
 * ou au chargement initial de la page Lariya.
 * 1. Animation d'intro (clipPath)
 * 2. Menu Hamburger
 * 3. Animations au scroll
 */

function LariyaInit() {

  function qs(s, parent) {
    return (parent || document).querySelector(s);
  }
  function qsa(s, parent) {
    return (parent || document).querySelectorAll(s);
  }

  function waitForGSAP(callback) {
    if (typeof gsap !== 'undefined') {
      callback();
    } else {
      setTimeout(function () { waitForGSAP(callback); }, 50);
    }
  }

  function init() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Smooth scroll (Lenis) s'il existe
    if (typeof Lenis !== 'undefined') {
      window.lenis = new Lenis({ duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, direction: 'vertical', gestureDirection: 'vertical', smooth: true, mouseMultiplier: 1, smoothTouch: false, touchMultiplier: 2, infinite: false });
      function raf(time) { window.lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }

    introAnimation();
    setupMenu();
    setupScrollAnimations();
    setupCategoryTransitions();
  }

  //  1. INTRO ANIMATION 
  function introAnimation() {
    var header = qs('.header');
    var titleSpans = qsa('.home-mv__title span');
    var subSpans = qsa('.home-mv__sub span');
    var detailSpans = qsa('.home-mv__detail-text span');
    var bgImg0 = qs('.home-mv__background [data-mv-image="0"]');
    var bgInner = qs('.home-mv__background-inner');

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Image de fond : clip-path s'ouvre de bas en haut
    if (bgImg0) {
      tl.fromTo(bgImg0,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4 },
        0
      );
    }
    // Légère dézoome du background-inner
    if (bgInner) {
      tl.fromTo(bgInner,
        { scale: 1.3 },
        { scale: 1.0, duration: 2.0, ease: 'power1.out' },
        0
      );
    }
    // Header fade in
    if (header) {
      tl.to(header, { opacity: 1, pointerEvents: 'auto', duration: 0.6 }, 0.5);
    }
    // Lettres du titre montent
    if (titleSpans.length) {
      tl.to(titleSpans, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.04
      }, 0.6);
    }
    // Lettres du sous-titre
    if (subSpans.length) {
      tl.to(subSpans, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.025
      }, 1.0);
    }
    // Détail WORK / FROM / (2020) / TO / (2025)
    if (detailSpans.length) {
      tl.to(detailSpans, {
        y: 0, duration: 0.5, stagger: 0.08
      }, 0.8);
    }
  }

  //  2. MENU HAMBURGER 
  function setupMenu() {
    var menuBtn = qs('#menu-btn');
    var menu = qs('#site-menu');
    if (!menuBtn || !menu) return;

    var textInners = qsa('.menu__li-text-inner', menu);
    var menuImages = qsa('.menu__li-image', menu);

    // Suppression des anciens écouteurs pour éviter les doublons avec barba
    var newMenuBtn = menuBtn.cloneNode(true);
    menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);
    menuBtn = newMenuBtn;

    menuBtn.addEventListener('click', function () {
      var isOpen = menuBtn.classList.toggle('is-open');
      menu.classList.toggle('is-open', isOpen);
      menuBtn.setAttribute('aria-label', isOpen ? 'fermer menu' : 'ouvrir menu');
      menu.setAttribute('aria-hidden', String(!isOpen));

      if (isOpen) {
        gsap.to(menu, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.out' });
        gsap.to(textInners, { y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.15 });
        gsap.to(menuImages, { clipPath: 'inset(0%)', duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.15 });
      } else {
        gsap.to(textInners, { y: '-100%', duration: 0.3, stagger: 0.04, ease: 'power2.in' });
        gsap.to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.45, ease: 'power3.in', delay: 0.1 });
      }
    });
  }

  //  3. SCROLL ANIMATIONS 
  function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;

        if (el.classList.contains('home-overview__title') ||
            el.tagName === 'H2' ||
            el.getAttribute('data-split-target') !== null) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        }
        observer.unobserve(el);
      });
    }, { threshold: 0.2 });

    qsa('[data-split-target]').forEach(function (el) {
      if (el.closest('.home-mv')) return;
      gsap.set(el, { opacity: 0, y: 30 });
      observer.observe(el);
    });

    var mvBg = qs('.home-mv__background');
    if (mvBg) {
      gsap.to(mvBg, {
        y: '300px', ease: 'none',
        scrollTrigger: { trigger: document.body, start: '10px top', end: '+=2000px', scrub: true }
      });
    }

    var catBgInner = qs('.home-category__background-inner');
    if (catBgInner) {
      gsap.fromTo(catBgInner,
        { y: '-200px' },
        { y: '0px', ease: 'none', scrollTrigger: { trigger: '.home-category__background', start: 'top bottom', end: '+=700px', scrub: true } }
      );
    }
  }

  //  4. CATEGORY TRANSITIONS (CROSSFADE EMULATING WEBGL) 
  function setupCategoryTransitions() {
    var catSections = qsa('.home-category-main');
    var bgs = qsa('.home-category__background-inner img[data-cat-bg]');
    if (!catSections.length || !bgs.length) return;

    function activateBg(index) {
      bgs.forEach(function(bg, i) {
        bg.style.opacity = (i === index) ? '1' : '0';
      });
    }

    catSections.forEach(function(sec) {
      var id = parseInt(sec.getAttribute('data-section'), 10);
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: function() { activateBg(id); },
        onEnterBack: function() { activateBg(id); }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { waitForGSAP(init); });
  } else {
    waitForGSAP(init);
  }
}

// Lancement automatique
LariyaInit();
