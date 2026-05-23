document.addEventListener('DOMContentLoaded', () => {
  // Copyright year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Navbar scroll effect + Floating LINE button
  const navbar = document.querySelector('.navbar');
  const floatLineBtn = document.querySelector('.float-line-btn');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (floatLineBtn) {
      floatLineBtn.classList.toggle('visible', window.scrollY > 400);
    }
  });

  // Mobile navigation
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay = document.querySelector('.nav-overlay');
  const navClose = document.querySelector('.nav-close');
  const overlayLinks = document.querySelectorAll('.nav-overlay-links a');

  hamburger?.addEventListener('click', () => overlay.classList.add('open'));
  navClose?.addEventListener('click', () => overlay.classList.remove('open'));
  overlayLinks.forEach(link =>
    link.addEventListener('click', () => overlay.classList.remove('open'))
  );

  // Menu tabs
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuCategories = document.querySelectorAll('.menu-category');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.category;
      menuTabs.forEach(t => t.classList.remove('active'));
      menuCategories.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Scroll animations
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-img');
  let lbImages = [];
  let lbIndex = 0;

  function openLightbox(imgs, idx) {
    lbImages = imgs;
    lbIndex = idx;
    lightboxImg.src = imgs[idx].src;
    lightboxImg.alt = imgs[idx].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateLbNav();
  }

  function closeLightbox() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function lbNav(dir) {
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    lightboxImg.src = lbImages[lbIndex].src;
    lightboxImg.alt = lbImages[lbIndex].alt;
  }

  function updateLbNav() {
    const prev = lightbox?.querySelector('.lightbox-prev');
    const next = lightbox?.querySelector('.lightbox-next');
    const show = lbImages.length > 1;
    if (prev) prev.style.display = show ? '' : 'none';
    if (next) next.style.display = show ? '' : 'none';
  }

  if (lightbox) {
    lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev')?.addEventListener('click', () => lbNav(-1));
    lightbox.querySelector('.lightbox-next')?.addEventListener('click', () => lbNav(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbNav(-1);
      if (e.key === 'ArrowRight') lbNav(1);
    });
  }

  // Gallery click → lightbox (event delegation for dynamic content)
  document.querySelector('.gallery-grid')?.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    const img = item.querySelector('img');
    if (!img) return;
    const allImgs = [...document.querySelectorAll('.gallery-grid .gallery-item img')];
    openLightbox(allImgs, allImgs.indexOf(img));
  });

  // ---- Stagger animations ----
  // グリッド内の子要素を順番に表示
  function staggerReveal(containerSel, childSel, step) {
    const container = document.querySelector(containerSel);
    if (!container) return;
    // fade-in は stagger で代替するので外す
    container.querySelectorAll(childSel).forEach(el => el.classList.remove('fade-in'));

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      container.querySelectorAll(childSel).forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * step);
      });
      obs.unobserve(container);
    }, { threshold: 0.08 });
    obs.observe(container);
  }

  staggerReveal('.staff-grid',   '.staff-card',  110);
  staggerReveal('.reviews-grid', '.review-card',  90);
  staggerReveal('.faq-list',     '.faq-item',     65);
});
