// Active nav link detection
function setActiveNav() {
  const filename = window.location.pathname.split('/').pop() || 'index.html';
  const current = filename === '' ? 'index.html' : filename;

  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// Scroll reveal via IntersectionObserver
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Mobile nav toggle
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  // Close when clicking outside nav
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Click-to-expand cards (assignment and exploration)
function initExpandableCards() {
  document.querySelectorAll('.assignment-card, .exploration-card').forEach(card => {
    const toggle = card.querySelector('.assignment-toggle, .exploration-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const isExpanded = card.classList.toggle('is-expanded');
      toggle.setAttribute('aria-expanded', String(isExpanded));
    });
  });
}

// Image lightbox with zoom
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const imgWrap = lightbox.querySelector('.lightbox-img-wrap');
  const lightboxImg = imgWrap.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    imgWrap.classList.remove('is-zoomed');
    document.body.style.overflow = '';
    // Clear src after transition so image doesn't flash on reopen
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  // Open on any .exploration-figure click
  document.querySelectorAll('.exploration-figure').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  // Toggle zoom on image click
  imgWrap.addEventListener('click', () => {
    imgWrap.classList.toggle('is-zoomed');
  });

  closeBtn.addEventListener('click', closeLightbox);

  // Click on dark backdrop (not the image) closes
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initScrollReveal();
  initMobileNav();
  initExpandableCards();
  initLightbox();
});
