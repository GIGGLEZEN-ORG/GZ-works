/**
 * Aurelia Grand Suites & Sanctuary
 * Main Entry Point
 */

import { initNavigation } from './modules/navigation.js';
import { initBooking } from './modules/booking.js';
import { initRooms } from './modules/rooms.js';
import { initGallery } from './modules/gallery.js';
import { initDining } from './modules/dining.js';
import { initTestimonials } from './modules/testimonials.js';
import { initAnimations } from './modules/animations.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBooking();
  initRooms();
  initGallery();
  initDining();
  initTestimonials();
  initAnimations();

  console.log('%c AURELIA GRAND SUITES & SANCTUARY %c Website Initialized Successfully ',
    'background: #121316; color: #C5A880; font-weight: bold; padding: 4px 8px; border: 1px solid #C5A880;',
    'background: #FDFBF7; color: #17181C; padding: 4px 8px;'
  );
});
