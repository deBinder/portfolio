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

// Document modal for assignment cards
function initDocumentModals() {
  const modal = document.getElementById('doc-modal');
  if (!modal) return;

  const frame = document.getElementById('doc-modal-frame');
  const titleEl = modal.querySelector('.doc-modal-title');
  const closeBtn = modal.querySelector('.doc-modal-close');

  // Open modal on card click
  document.querySelectorAll('.assignment-card[data-pdf]').forEach(card => {
    card.addEventListener('click', () => {
      frame.src = card.dataset.pdf;
      if (titleEl) titleEl.textContent = card.dataset.title || '';
      modal.showModal();
    });
  });

  // Close on × button
  closeBtn.addEventListener('click', () => {
    modal.close();
  });

  // Close on backdrop click (click outside the dialog box)
  modal.addEventListener('click', e => {
    const rect = modal.getBoundingClientRect();
    if (
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom
    ) {
      modal.close();
    }
  });

  // Clear iframe src on close (handles Escape key too)
  modal.addEventListener('close', () => {
    frame.src = '';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initScrollReveal();
  initMobileNav();
  initDocumentModals();
});
