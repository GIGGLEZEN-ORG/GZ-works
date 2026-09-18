/**
 * Aurelia Grand Suites & Sanctuary
 * Module: Animations (Scroll Reveal, Counter Animation, FAQ Accordion, Back-to-Top, Toast)
 */

export function initAnimations() {
  // 1. Scroll Reveal Animations via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 2. Animated Number Counters
  const counterElements = document.querySelectorAll('.counter-anim');
  let hasAnimatedCounters = false;

  function runCounters() {
    if (hasAnimatedCounters) return;
    hasAnimatedCounters = true;

    counterElements.forEach(el => {
      const target = parseFloat(el.dataset.target || '0');
      const isDecimal = el.dataset.decimal === 'true';
      const suffix = el.dataset.suffix || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * easeOut;

        el.textContent = (isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)) + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const statsSection = document.querySelector('.hero-stats-bar');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  } else {
    setTimeout(runCounters, 500);
  }

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close other open FAQs for clean luxury feel
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          const otherContent = other.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        item.classList.add('is-open');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('is-open');
        content.style.maxHeight = null;
      }
    });
  });

  // 4. Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn?.classList.add('show');
    } else {
      backToTopBtn?.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 5. Global Toast Notification System
  const toastContainer = document.querySelector('.toast-container') || createToastContainer();

  function createToastContainer() {
    const container = document.createElement('div');
    container.classList.add('toast-container');
    document.body.appendChild(container);
    return container;
  }

  window.showToast = function(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-gold-400); flex-shrink: 0;">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4200);
  };

  // 6. Newsletter Subscription Handler
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    if (emailInput && emailInput.value) {
      window.showToast('You have been cordially subscribed to The Aurelia Gazette. Welcome to our inner circle.');
      emailInput.value = '';
    }
  });
}
