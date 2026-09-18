/**
 * Aurelia Grand Suites & Sanctuary
 * Module: Testimonials Carousel (Vanilla JS slider with autoplay, gestures, and dots)
 */

export function initTestimonials() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.slider-arrow-btn.prev');
  const nextBtn = document.querySelector('.slider-arrow-btn.next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoplayInterval = null;
  const totalSlides = slides.length;

  // Build Pagination Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(idx);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll('.slider-dot');

  function updateSlidePosition() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateSlidePosition();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    restartAutoplay();
  });

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    restartAutoplay();
  });

  // Autoplay Logic
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  const sliderWrap = document.querySelector('.testimonials-slider-wrap');
  sliderWrap?.addEventListener('mouseenter', stopAutoplay);
  sliderWrap?.addEventListener('mouseleave', startAutoplay);

  // Touch Swipe gestures
  let touchStartX = 0;
  let touchEndX = 0;

  sliderWrap?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  sliderWrap?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    startAutoplay();
  }, { passive: true });

  startAutoplay();
}
