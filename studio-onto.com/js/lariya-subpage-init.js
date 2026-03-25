/**
 * lariya-subpage-init.js
 * Script d'animation pour les sous-pages de Lariya (creative, exploration, growth, etc.)
 * Recrée les animations du site original layrid.tomoyaokada.com
 */
(function () {
  'use strict';

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function waitForGSAP(cb) {
    if (typeof gsap !== 'undefined') { cb(); return; }
    var tries = 0;
    var check = setInterval(function () {
      tries++;
      if (typeof gsap !== 'undefined') { clearInterval(check); cb(); }
      if (tries > 30) { clearInterval(check); fallbackReveal(); }
    }, 100);
  }

  function fallbackReveal() {
    var header = qs('.header');
    if (header) { header.style.opacity = '1'; header.style.pointerEvents = 'auto'; }
    var contents = qs('.single-mv__contents');
    if (contents) { contents.style.opacity = '1'; }
  }

  function init() {
    animateHeader();
    animateHeroImage();
    animateHeroContent();
    setupMenu();
    setupScrollAnimations();
    setupNextSection();
  }

  // 1. Afficher le header
  function animateHeader() {
    var header = qs('.header');
    if (!header) return;
    gsap.to(header, { opacity: 1, pointerEvents: 'auto', duration: 0.6, delay: 0.8, ease: 'power2.out' });
  }

  // 2. Image hero : ouvrir le clip-path
  function animateHeroImage() {
    var coverImg = qs('.single-mv__image-cover img, .single-mv__image img');
    var imgWrap = qs('.single-mv__image');
    if (!imgWrap) return;

    // L'image est déjà présente, on l'anime avec clip-path
    gsap.fromTo(imgWrap,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.out', delay: 0.1 }
    );
  }

  // 3. Contenu du hero : titre, sous-titres
  function animateHeroContent() {
    var contents = qs('.single-mv__contents');
    if (!contents) return;

    // Rendre visible d'abord
    gsap.to(contents, { opacity: 1, duration: 0.01 });

    var title = qs('h1', contents);
    var subtitle = qs('p.u-ja', contents);
    var enText = qs('.single-mv__en p', contents);
    var jaText = qs('.single-mv__ja p', contents);
    var scroll = qs('.single-mv__scroll', contents);

    var elements = [title, subtitle, enText, jaText, scroll].filter(Boolean);

    gsap.fromTo(elements,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.9 }
    );
  }

  // 4. Menu hamburger
  function setupMenu() {
    var menuBtn = qs('#menu-btn') || qs('.header__menu-button');
    var menu = qs('#site-menu') || qs('.menu');
    if (!menuBtn || !menu) return;

    var textInners = qsa('.menu__li-text-inner, .menu__li-text', menu);
    var menuImages = qsa('.menu__li-image', menu);

    menuBtn.addEventListener('click', function () {
      var isOpen = menuBtn.classList.toggle('is-open');
      menu.classList.toggle('is-open', isOpen);
      menuBtn.setAttribute('aria-label', isOpen ? 'fermer menu' : 'ouvrir menu');

      if (isOpen) {
        gsap.to(menu, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.out' });
        gsap.fromTo(textInners,
          { y: '-100%' },
          { y: '0%', duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.15 }
        );
        gsap.to(menuImages, { clipPath: 'inset(0%)', duration: 0.4, stagger: 0.06, delay: 0.15 });
      } else {
        gsap.to(textInners, { y: '-100%', duration: 0.3, stagger: 0.04, ease: 'power2.in' });
        gsap.to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.45, ease: 'power3.in', delay: 0.1 });
      }
    });
  }

  // 5. Scroll : animer les liens de la liste
  function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var links = qsa('.single-contents__link');
    if (!links.length) return;

    gsap.set(links, { opacity: 0, y: 20 });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        gsap.to(entry.target, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    links.forEach(function (link) { observer.observe(link); });
  }

  // 6. Section "Next" avec barre de progression au scroll
  function setupNextSection() {
    var nextArea = qs('.single-next__area');
    var progressBar = qs('.single-next__progress-inner');
    var nextTitle = qs('.single-next__title span');
    var nextSection = qs('.single-next');
    if (!nextArea || !nextSection) return;

    // Lire l'URL relative directe — ex: "../exploration/index.html"
    var nextHref = nextArea.getAttribute('data-next');
    var navigated = false;

    if (progressBar && nextSection && nextHref) {
      window.addEventListener('scroll', function () {
        if (navigated) return;
        var rect = nextSection.getBoundingClientRect();
        var sectionHeight = nextSection.offsetHeight;
        var viewH = window.innerHeight;

        // Visual progress relative to viewport (0 to 1)
        var visualProgress = Math.max(0, Math.min(1, (viewH - rect.top) / sectionHeight));
        progressBar.style.width = (visualProgress * 100) + '%';

        // Scroll Zoom effect for the image
        var nextImg = qs('.single-next__image img', nextSection);
        if (nextImg) {
          // Progressively zoom from 1.0 to 1.15
          nextImg.style.transform = 'scale(' + (1 + (visualProgress * 0.15)) + ')';
        }

        // Trigger Navigation when user hits the absolute bottom of the document
        // Using a 5px threshold to account for rounding errors on some screens
        var isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 5;
        
        if (isAtBottom) {
          navigated = true;
          progressBar.style.width = '100%';
          window.location.href = nextHref;
        }
      }, { passive: true });
    }

    // Animate more elements for responsiveness (subpages)
    qsa('.rx-config, .single-overview, .single-info').forEach(function(el) {
      if(!el.hasAttribute('data-split-target')) el.setAttribute('data-split-target', 'true');
    });

    // Animer le titre quand visible
    if (nextTitle) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          gsap.fromTo(nextTitle,
            { y: '100%' },
            { y: '0%', duration: 0.7, ease: 'power3.out' }
          );
          obs.unobserve(e.target);
        });
      }, { threshold: 0.3 });
      obs.observe(nextArea);
    }
  }


  // ——— DÉMARRAGE ———
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { waitForGSAP(init); });
  } else {
    waitForGSAP(init);
  }

})();
