document.addEventListener('DOMContentLoaded', () => {
  const content = loadContent();
  renderAll(content);
});

function renderAll(c) {
  renderHero(c.hero);
  renderConcept(c.concept);
  renderStaff(c.staff);
  renderMenu(c.menu);
  renderGallery(c.gallery);
  renderInterior(c.interior);
  renderFaq(c.faq);
  renderAccess(c.access);
  renderContact(c.contact);
}

function renderHero(h) {
  setText('.hero-subtitle-top', h.subtitleTop);
  setHTML('.hero-title', h.title);
  setText('.hero-subtitle', h.subtitle);
}

function renderConcept(c) {
  toggleSection('#concept', c.visible);
  const textEl = document.querySelector('.about-text h3');
  if (textEl) textEl.innerHTML = c.heading.replace(/\n/g, '<br>');
  const paras = document.querySelectorAll('.about-text > p');
  if (paras[0]) paras[0].textContent = c.paragraph1;
  if (paras[1]) paras[1].textContent = c.paragraph2;

  const img = document.querySelector('.about-image');
  if (img && c.imageUrl) {
    img.innerHTML = `<img src="${escapeAttr(c.imageUrl)}" alt="サロン写真">`;
  }

  const features = document.querySelectorAll('.about-feature');
  c.features.forEach((f, i) => {
    if (features[i]) {
      features[i].querySelector('.about-feature-icon').textContent = f.icon;
      features[i].querySelector('.about-feature-title').textContent = f.title;
    }
  });
}

function renderStaff(s) {
  toggleSection('#staff', s.visible);
  const grid = document.querySelector('.staff-grid');
  if (!grid || !s.members.length) return;

  grid.innerHTML = s.members.map(m => `
    <div class="staff-card fade-in">
      <div class="staff-photo">
        ${m.photoUrl
          ? `<img src="${escapeAttr(m.photoUrl)}" alt="${escapeAttr(m.name)}">`
          : '<div class="staff-photo-placeholder">PHOTO</div>'}
      </div>
      <h3 class="staff-name">${escapeHtml(m.name)}</h3>
      <p class="staff-role">${escapeHtml(m.role)}</p>
      <p class="staff-desc">${escapeHtml(m.desc)}</p>
    </div>
  `).join('');
}

function renderMenu(m) {
  toggleSection('#menu', m.visible);
  const tabsContainer = document.querySelector('.menu-categories');
  const listContainer = document.querySelector('.menu-list');
  if (!tabsContainer || !listContainer) return;

  tabsContainer.innerHTML = m.categories.map((cat, i) =>
    `<button class="menu-tab${i === 0 ? ' active' : ''}" data-category="cat-${i}">${escapeHtml(cat.name)}</button>`
  ).join('');

  listContainer.innerHTML = m.categories.map((cat, i) => `
    <div id="cat-${i}" class="menu-category${i === 0 ? ' active' : ''}">
      ${cat.items.map(item => `
        <div class="menu-item">
          <div class="menu-item-info">
            <p class="menu-item-name">${escapeHtml(item.name)}</p>
            <p class="menu-item-desc">${escapeHtml(item.desc)}</p>
          </div>
          <p class="menu-item-price">${escapeHtml(item.price)}</p>
        </div>
      `).join('')}
    </div>
  `).join('');

  const noteEl = document.querySelector('.menu-note');
  if (noteEl) noteEl.innerHTML = m.note.replace(/\n/g, '<br>');

  rebindMenuTabs();
}

function renderGallery(g) {
  toggleSection('#gallery', g.visible);
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  grid.innerHTML = g.images.map(img => `
    <div class="gallery-item">
      ${img.url
        ? `<img src="${escapeAttr(img.url)}" alt="${escapeAttr(img.label)}">`
        : `<div class="gallery-placeholder">${escapeHtml(img.label)}</div>`}
    </div>
  `).join('');
}

function renderInterior(int) {
  toggleSection('#interior', int.visible);
  const grid = document.querySelector('.interior-grid');
  if (!grid) return;

  grid.innerHTML = int.images.map((img, i) => `
    <div class="interior-item">
      ${img.url
        ? `<img src="${escapeAttr(img.url)}" alt="${escapeAttr(img.label)}">`
        : `<div class="interior-placeholder"><span>${escapeHtml(img.label)}</span></div>`}
      ${i === 0 ? `<div class="interior-caption">${escapeHtml(img.label)}</div>` : ''}
    </div>
  `).join('');
}

function renderFaq(f) {
  toggleSection('#faq', f.visible);
  const list = document.querySelector('.faq-list');
  if (!list) return;

  list.innerHTML = f.items.map(item => `
    <div class="faq-item">
      <button class="faq-question">
        <span>${escapeHtml(item.q)}</span>
        <div class="faq-icon"></div>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">${escapeHtml(item.a)}</div>
      </div>
    </div>
  `).join('');

  rebindFaq();
}

function renderAccess(a) {
  toggleSection('#access', a.visible);
  const info = document.querySelector('.access-info');
  if (!info) return;

  info.innerHTML = `
    <div class="access-info-item">
      <span class="access-info-label">サロン名</span>
      <span class="access-info-value">${escapeHtml(a.salonName)}</span>
    </div>
    ${a.address ? `
    <div class="access-info-item">
      <span class="access-info-label">住所</span>
      <span class="access-info-value">${escapeHtml(a.address).replace(/\n/g, '<br>')}</span>
    </div>` : ''}
    <div class="access-info-item">
      <span class="access-info-label">最寄り駅</span>
      <span class="access-info-value">${a.stations.split('\n').map(s => escapeHtml(s)).join('<br>')}</span>
    </div>
    <div class="access-info-item">
      <span class="access-info-label">営業時間</span>
      <span class="access-info-value">${escapeHtml(a.hours)}</span>
    </div>
    <div class="access-info-item">
      <span class="access-info-label">定休日</span>
      <span class="access-info-value">${escapeHtml(a.holidays)}</span>
    </div>
    <div class="access-info-item">
      <span class="access-info-label">対応</span>
      <span class="access-info-value">${escapeHtml(a.features)}</span>
    </div>
  `;

  const mapEl = document.querySelector('.access-map');
  if (mapEl && a.mapEmbedUrl) {
    mapEl.innerHTML = `<iframe src="${escapeAttr(a.mapEmbedUrl)}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }
}

function renderContact(c) {
  const lineBtn = document.querySelector('.contact-buttons .btn-primary');
  const hpbBtn = document.querySelector('.contact-buttons .btn-outline');
  if (lineBtn) lineBtn.href = c.lineUrl || '#';
  if (hpbBtn) hpbBtn.href = c.hpbUrl || '#';
}

// --- Helpers ---

function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function setHTML(selector, html) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = html;
}

function toggleSection(selector, visible) {
  const el = document.querySelector(selector);
  if (el) el.style.display = visible === false ? 'none' : '';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function escapeAttr(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function rebindMenuTabs() {
  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.menu-category').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.category);
      if (target) target.classList.add('active');
    });
  });
}

function rebindFaq() {
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
}
