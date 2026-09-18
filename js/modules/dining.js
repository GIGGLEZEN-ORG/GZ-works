/**
 * Aurelia Grand Suites & Sanctuary
 * Module: Dining (Tasting Menu Modal & Table Reservation)
 */

export function initDining() {
  const menuModal = document.getElementById('menu-modal');
  const tableModal = document.getElementById('table-modal');
  const modalOverlay = document.querySelector('.modal-overlay');
  const menuTriggers = document.querySelectorAll('.js-view-menu');
  const tableTriggers = document.querySelectorAll('.js-reserve-table');
  const menuCloseBtn = document.getElementById('menu-modal-close');
  const tableCloseBtn = document.getElementById('table-modal-close');

  const diningMenus = {
    'latelier': {
      title: "L'Atelier Aurelia — 7-Course Degustation",
      chef: 'Executive Chef Jean-Luc Moreau (2 Michelin Stars)',
      courses: [
        {
          name: 'Amuse-Bouche: Truffle Royale & Oscietra Caviar',
          desc: 'Velvety Jerusalem artichoke foam, Périgord black truffle essence, crisp gold leaf.',
          pairing: 'Dom Pérignon Vintage Champagne 2013'
        },
        {
          name: 'Premier: Carpaccio of Brittany Scallops',
          desc: 'Citrus reduction, compressed finger lime, sea urchin emulsion, sea herbs.',
          pairing: 'Chablis Grand Cru Les Clos 2020'
        },
        {
          name: 'Deuxième: Smoked Foie Gras & Quince Tart',
          desc: 'Caramelized heirloom quince, spiced brioche crisp, elderberry glaze.',
          pairing: 'Château d’Yquem Sauternes 2011'
        },
        {
          name: 'Poisson: Wild Turbot Poached in Champagne Butter',
          desc: 'Braised baby leeks, saffron broth, Oscietra caviar velouté.',
          pairing: 'Puligny-Montrachet 1er Cru 2019'
        },
        {
          name: 'Viande: Dry-Aged A5 Miyazaki Wagyu Tenderloin',
          desc: 'Bone marrow jus, smoked morel mushrooms, Robuchon-style pomme purée.',
          pairing: 'Château Margaux 1er Grand Cru Classé 2010'
        },
        {
          name: 'Pré-Dessert: Bergamot & White Peach Granite',
          desc: 'Champagne bubbles, infused lemon thyme pearls.',
          pairing: 'Palate cleanser'
        },
        {
          name: 'Final: Valrhona 72% Smoked Dark Chocolate Sphere',
          desc: 'Warm salted butter caramel drizzle, tonka bean gelato, candied hazelnut.',
          pairing: 'Taylor’s 30 Year Old Tawny Port'
        }
      ]
    },
    'glasshouse': {
      title: 'The Glasshouse Orangery — Royal Botanique Tea',
      chef: 'Master Pâtissier Claire Fontaine',
      courses: [
        {
          name: 'Savory: Smoked Scottish Salmon & Dill Mascarpone',
          desc: 'Brioche tartlet, trout roe, micro borage blossoms.',
          pairing: 'Silver Needle White Tea, Fujian'
        },
        {
          name: 'Savory: Truffled Free-Range Egg & Cornichon',
          desc: 'Pain de mie, quail yolk, chive blossoms.',
          pairing: 'Darjeeling First Flush Margaret’s Hope'
        },
        {
          name: 'Pâtisserie: Lavender-Infused Warm Scones',
          desc: 'Devonshire clotted cream, homemade wild raspberry & rose petal jam.',
          pairing: 'Earl Grey Reserve Imperial'
        },
        {
          name: 'Sweet: Pistachio & Sour Cherry Religieuse',
          desc: 'Choux pastry, Sicilian pistachio cream, griottine coulis.',
          pairing: 'Ruinart Blanc de Blancs Champagne'
        }
      ]
    },
    'nocturne': {
      title: 'The Nocturne Speakeasy — Mixology & Rare Reserves',
      chef: 'Head Mixologist Alessandro Vanni',
      courses: [
        {
          name: 'Signature: The Aurelia Elixir',
          desc: 'The Macallan 18, antique vermouth, smoked cherry bark, edible 24k gold leaf.',
          pairing: 'Presented under a crystal cloche of hickory smoke'
        },
        {
          name: 'Signature: Alabaster Boulevardier',
          desc: 'Michter’s 10 Year Rye, Campari infused with raw cacao nibs, Punt e Mes.',
          pairing: 'Accompanied by dark chocolate truffles'
        },
        {
          name: 'Reserve Flight: Japanese Rare Whiskies',
          desc: 'Yamazaki 18, Hakushu 18, and Hibiki 21 curated pour.',
          pairing: 'Hand-carved crystalline ice sphere'
        }
      ]
    }
  };

  function openMenuModal(venueKey) {
    const menuData = diningMenus[venueKey] || diningMenus['latelier'];
    const titleEl = document.getElementById('menu-modal-title');
    const chefEl = document.getElementById('menu-modal-chef');
    const listEl = document.getElementById('menu-courses-list');

    if (titleEl) titleEl.textContent = menuData.title;
    if (chefEl) chefEl.textContent = menuData.chef;

    if (listEl) {
      listEl.innerHTML = menuData.courses.map((c, i) => `
        <div class="menu-course-item" style="border-bottom: 1px solid var(--border-light); padding: 1.25rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
            <h5 style="font-family: var(--font-serif); font-size: 1.25rem; margin: 0; color: var(--color-charcoal-900);">${c.name}</h5>
          </div>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: 0 0 0.4rem;">${c.desc}</p>
          <span style="font-size: var(--font-size-2xs); text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-gold-600); font-weight: 600;">Sommelier Note: ${c.pairing}</span>
        </div>
      `).join('');
    }

    modalOverlay?.classList.add('is-active');
    menuModal?.classList.add('is-active');
    document.body.classList.add('no-scroll');
  }

  function closeMenuModal() {
    modalOverlay?.classList.remove('is-active');
    menuModal?.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
  }

  menuTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const venue = btn.dataset.venue || 'latelier';
      openMenuModal(venue);
    });
  });

  menuCloseBtn?.addEventListener('click', closeMenuModal);

  // Table reservation modal
  function openTableModal(venueKey) {
    const venueSelect = document.getElementById('table-venue-select');
    if (venueSelect && venueKey) {
      venueSelect.value = venueKey;
    }
    modalOverlay?.classList.add('is-active');
    tableModal?.classList.add('is-active');
    document.body.classList.add('no-scroll');
  }

  function closeTableModal() {
    modalOverlay?.classList.remove('is-active');
    tableModal?.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
  }

  tableTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const venue = btn.dataset.venue || 'latelier';
      openTableModal(venue);
    });
  });

  tableCloseBtn?.addEventListener('click', closeTableModal);

  const tableForm = document.getElementById('table-reservation-form');
  tableForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    closeTableModal();
    if (window.showToast) {
      window.showToast('Your dining table reservation inquiry has been confirmed. Our maître d’ will confirm your seating.');
    }
    tableForm.reset();
  });
}
