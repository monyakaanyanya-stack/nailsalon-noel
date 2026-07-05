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

  // Interior click → lightbox
  document.querySelector('.interior-grid')?.addEventListener('click', (e) => {
    const item = e.target.closest('.interior-item');
    if (!item) return;
    const img = item.querySelector('img');
    if (!img) return;
    const allImgs = [...document.querySelectorAll('.interior-grid .interior-item img')];
    openLightbox(allImgs, allImgs.indexOf(img));
  });

  // ---- Stagger animations ----
  function staggerReveal(containerSel, childSel, step) {
    const container = document.querySelector(containerSel);
    if (!container) return;
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

  // ---- Staff designs modal ----
  const staffModal = document.getElementById('staff-modal');
  const smPhoto    = document.getElementById('sm-photo');
  const smName     = document.getElementById('sm-name');
  const smRole     = document.getElementById('sm-role');
  const smDesc     = document.getElementById('sm-desc');
  const smGrid     = document.getElementById('sm-grid');
  const smEmpty    = document.getElementById('sm-empty');

  function escAttr(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function openStaffModal(member) {
    if (!staffModal) return;
    smPhoto.innerHTML = member.photoUrl
      ? `<img src="${escAttr(member.photoUrl)}" alt="${escAttr(member.name)}">`
      : '<div class="staff-photo-placeholder">PHOTO</div>';
    smName.textContent = member.name;
    smRole.textContent = member.role;
    smDesc.textContent = member.desc;

    const designs = (member.designs || []).filter(d => d.url);
    smGrid.innerHTML = designs.map(d =>
      `<div class="staff-modal-grid-item"><img src="${escAttr(d.url)}" alt="${escAttr(d.label || '')}"></div>`
    ).join('');
    smEmpty.style.display = designs.length ? 'none' : '';
    smGrid.style.display  = designs.length ? ''     : 'none';

    smGrid.querySelectorAll('.staff-modal-grid-item img').forEach((img, idx) => {
      img.addEventListener('click', () => {
        const allImgs = [...smGrid.querySelectorAll('.staff-modal-grid-item img')];
        openLightbox(allImgs, idx);
      });
    });

    staffModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeStaffModal() {
    staffModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (staffModal) {
    staffModal.querySelector('.staff-modal-close')
      ?.addEventListener('click', closeStaffModal);
    staffModal.querySelector('.staff-modal-backdrop')
      ?.addEventListener('click', closeStaffModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && staffModal.classList.contains('open')) closeStaffModal();
    });
  }

  // Staff card click → open modal
  document.querySelector('.staff-grid')?.addEventListener('click', e => {
    const card = e.target.closest('.staff-card');
    if (!card) return;
    const idx = parseInt(card.dataset.memberIndex, 10);
    if (isNaN(idx)) return;
    const content = loadContent();
    const member  = content.staff.members[idx];
    if (member) openStaffModal(member);
  });
});
