/**
 * Aurelia Grand Suites & Sanctuary
 * Module: Navigation (Sticky header, Mobile Drawer, Scrollspy)
 */

export function initNavigation() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // 1. Sticky Header with Glassmorphic Transition
  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 2. Mobile Drawer Open / Close
  function openMobileMenu() {
    hamburgerBtn?.classList.add('is-active');
    mobileDrawer?.classList.add('is-open');
    mobileOverlay?.classList.add('is-open');
    document.body.classList.add('no-scroll');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    hamburgerBtn?.classList.remove('is-active');
    mobileDrawer?.classList.remove('is-open');
    mobileOverlay?.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
  }

  hamburgerBtn?.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.contains('is-active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileOverlay?.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  // 3. Smooth Anchor Scrolling with Header Offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        const headerHeight = header?.offsetHeight || 80;
        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. ScrollSpy for Active Desktop Nav Links
  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
}
