/**
 * Aurelia Grand Suites & Sanctuary
 * Module: Gallery & Lightbox (Filterable Grid, Fullscreen Lightbox with Touch/Keyboard Navigation)
 */

export function initGallery() {
  const galleryFilterPills = document.querySelectorAll('.gallery-filter .filter-pill');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxInfo = document.querySelector('.lightbox-info');
  const closeBtn = document.querySelector('.lightbox-close-btn');
  const prevBtn = document.querySelector('.lightbox-arrow.prev');
  const nextBtn = document.querySelector('.lightbox-arrow.next');

  let activeImages = [];
  let currentIndex = 0;

  function updateActiveImagesList() {
    activeImages = [];
    galleryItems.forEach((item) => {
      if (item.style.display !== 'none') {
        const img = item.querySelector('.gallery-thumb');
        const title = item.querySelector('h5')?.textContent || 'Aurelia Experience';
        const category = item.querySelector('span')?.textContent || 'Gallery';
        activeImages.push({
          src: img?.src,
          alt: img?.alt || 'Aurelia Boutique Hotel',
          title: title,
          category: category
        });
      }
    });
  }

  // 1. Gallery Category Filtering
  galleryFilterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      galleryFilterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;

      galleryItems.forEach((item) => {
        const itemCat = item.dataset.category;
        if (filter === 'all' || itemCat === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 30);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });

      setTimeout(updateActiveImagesList, 300);
    });
  });

  updateActiveImagesList();

  // 2. Lightbox Open / Close / Navigation
  function showLightbox(index) {
    if (!activeImages.length) updateActiveImagesList();
    if (index < 0) index = activeImages.length - 1;
    if (index >= activeImages.length) index = 0;

    currentIndex = index;
    const currentItem = activeImages[currentIndex];

    if (!currentItem) return;

    if (lightboxImg) {
      lightboxImg.style.opacity = '0.3';
      setTimeout(() => {
        lightboxImg.src = currentItem.src;
        lightboxImg.alt = currentItem.alt;
        lightboxImg.style.opacity = '1';
      }, 150);
    }

    if (lightboxTitle) lightboxTitle.textContent = currentItem.title;
    if (lightboxInfo) {
      lightboxInfo.textContent = `${currentItem.category} • ${currentIndex + 1} of ${activeImages.length}`;
    }

    lightboxModal?.classList.add('is-active');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    lightboxModal?.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
  }

  // Click on gallery item to open
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      updateActiveImagesList();
      const clickedImg = item.querySelector('.gallery-thumb');
      const foundIdx = activeImages.findIndex((img) => img.src === clickedImg?.src);
      showLightbox(foundIdx !== -1 ? foundIdx : 0);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightbox(currentIndex - 1);
  });
  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightbox(currentIndex + 1);
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('is-active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(currentIndex + 1);
  });

  // Touch Swipe Support for mobile lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  lightboxModal?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxModal?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        showLightbox(currentIndex - 1); // Swiped right -> previous
      } else {
        showLightbox(currentIndex + 1); // Swiped left -> next
      }
    }
  }, { passive: true });
}
