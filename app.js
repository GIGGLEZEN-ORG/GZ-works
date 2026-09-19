const components = ["header","hero","features","architecture","rooms","dining","offers","reviews","location","footer"];

async function loadComponent(name) {
  const target = document.getElementById(`component-${name}`);
  if (!target) return;
  const response = await fetch(`./components/${name}/${name}.html`);
  if (!response.ok) throw new Error(`Could not load ${name}.html`);
  target.innerHTML = await response.text();
}

async function startApp() {
  for (const name of components) await loadComponent(name);
  setupLinks();
  setupTheme();
  setupGuestSelector();
  setupDateInputs();
  setupAvailabilityCheck();
}

function setupLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href");
      const target = id && id !== "#" ? document.querySelector(id) : null;
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function setupTheme() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;
  button.addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark-luxury");
    const icon = document.getElementById("theme-icon");
    const text = document.getElementById("theme-text");
    if (icon) icon.textContent = dark ? "light_mode" : "dark_mode";
    if (text) text.textContent = dark ? "Light" : "Dark";
  });
}

function setupGuestSelector() {
  const selector = document.querySelector("[data-guest-selector]");
  if (!selector) return;

  const summary = document.getElementById("guest-summary");
  const details = document.getElementById("guest-details");
  const adults = selector.querySelector("[data-guest-adults]");
  const children = selector.querySelector("[data-guest-children]");
  const rooms = selector.querySelector("[data-guest-rooms]");
  if (!summary || !details || !adults || !children || !rooms) return;

  const updateSummary = () => {
    const adultCount = Number(adults.value);
    const childCount = Number(children.value);
    const roomCount = Number(rooms.value);
    const guestCount = adultCount + childCount;
    summary.textContent = `${roomCount} ${roomCount === 1 ? "Room" : "Rooms"}, ${guestCount} ${guestCount === 1 ? "Guest" : "Guests"}`;
    details.textContent = `${adultCount} ${adultCount === 1 ? "Adult" : "Adults"}, ${childCount} ${childCount === 1 ? "Child" : "Children"}`;
  };

  [adults, children, rooms].forEach(input => input.addEventListener("change", updateSummary));
}

function setupAvailabilityCheck() {
  const button = document.getElementById("availability-button");
  const dialog = document.getElementById("availability-dialog");
  const title = document.getElementById("availability-title");
  const message = document.getElementById("availability-message");
  const close = document.getElementById("availability-close");
  const checkIn = document.querySelector('input[title="Select Check-in Date"]');
  const checkOut = document.querySelector('input[title="Select Check-out Date"]');
  if (!button || !dialog || !title || !message || !close || !checkIn || !checkOut) return;

  button.addEventListener("click", () => {
    title.textContent = "Checking resources...";
    message.textContent = "Please wait while we check the selected dates.";
    dialog.showModal();

    window.setTimeout(() => {
      const available = checkIn.value && checkOut.value && checkOut.value > checkIn.value;
      title.textContent = available ? "Resources available" : "Resources not available";
      message.textContent = available
        ? "Your selected dates are available. You can continue with your booking."
        : "Please choose valid dates with check-out after check-in.";
    }, 1000);
  });

  close.addEventListener("click", () => dialog.close());
}

function setupDateInputs() {
  const checkIn = document.querySelector('input[title="Select Check-in Date"]');
  const checkOut = document.querySelector('input[title="Select Check-out Date"]');
  if (!checkIn || !checkOut) return;

  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = formatDate(new Date());
  checkIn.min = today;
  if (!checkIn.value || checkIn.value < today) checkIn.value = today;

  const updateCheckoutMinimum = () => {
    const nextDay = new Date(`${checkIn.value}T00:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);
    const minimumCheckout = formatDate(nextDay);
    checkOut.min = minimumCheckout;
    if (!checkOut.value || checkOut.value < minimumCheckout) {
      checkOut.value = minimumCheckout;
    }
  };

  updateCheckoutMinimum();
  checkIn.addEventListener("change", updateCheckoutMinimum);
}

startApp().catch(error => {
  console.error(error);
  document.body.insertAdjacentHTML("beforeend", `<div class="gz-loader-error"><strong>GiggleZen Suites</strong><span>Open giggle.html with VS Code Live Server.</span></div>`);
});
