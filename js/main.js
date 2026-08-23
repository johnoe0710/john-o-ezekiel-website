// ==========================================================================
// main.js — global site behaviour
// ==========================================================================

const scriptUrl = new URL(document.currentScript.src, document.baseURI);
const siteRoot = new URL("../", scriptUrl);

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartials();
  resolveRoutes();
  initMobileNav();
  setFooterYear();
});

async function loadPartials() {
  const includes = document.querySelectorAll("[data-include]");

  await Promise.all(Array.from(includes, async (include) => {
    const partialPath = include.dataset.include;

    try {
      const response = await fetch(new URL(partialPath, siteRoot));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      include.innerHTML = await response.text();
    } catch (error) {
      include.textContent = "Unable to load site navigation.";
      console.error(`Failed to load partial: ${partialPath}`, error);
    }
  }));
}

function resolveRoutes() {
  document.querySelectorAll("[data-route]").forEach((link) => {
    link.href = new URL(link.dataset.route, siteRoot).href;
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");

  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.setAttribute("data-open", "false");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.getAttribute("data-open") === "true";
    nav.setAttribute("data-open", String(!isOpen));
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  document.querySelectorAll(".site-header a[data-route]").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.getAttribute("data-open") === "true") {
      closeMenu();
      toggle.focus();
    }
  });
}

function setFooterYear() {
  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
