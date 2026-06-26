(function () {
  const config = window.siteConfig || {};
  const root = document.documentElement.dataset.root || "";

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  }

  function setHref(selector, value) {
    document.querySelectorAll(selector).forEach((node) => {
      node.setAttribute("href", value);
    });
  }

  setText("[data-company]", config.companyName || "RoofLink Roofing Network");
  setText("[data-email]", config.email || "");
  setText("[data-website]", config.website || "");
  setText("[data-phone]", config.phone || "");
  setText("[data-phone-label]", config.phoneLabel || "Call now");
  setText("[data-address]", config.address || "");
  setText("[data-service-area]", config.serviceArea || "");
  setText("[data-hours]", config.businessHours || "");
  setText("[data-footer-text]", config.footerText || "");
  setText("[data-copyright]", config.copyright || "");
  setText("[data-disclaimer]", config.disclaimer || "");
  setText("[data-footer-company-line]", `${config.companyName || "RoofLink Roofing Network"} - ${config.address || ""} - ID ${config.companyId || ""}`);
  setHref("[data-phone-href]", `tel:${(config.phone || "").replace(/[^\d+]/g, "")}`);
  setHref("[data-email-href]", `mailto:${config.email || ""}`);
  setHref("[data-website-href]", `https://${config.website || ""}`);

  const navToggle = document.querySelector(".nav-toggle");
  const navPanel = document.querySelector(".nav-panel");
  if (navToggle && navPanel) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navPanel.classList.toggle("is-open");
      document.body.classList.toggle("nav-open");
    });
  }

  const header = document.querySelector(".site-header");
  function syncHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
  }
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -5% 0px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  document.querySelectorAll(".roof-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = form.querySelector(".form-success");
      if (message) {
        message.textContent = `Thanks. ${config.companyName || "The request network"} received your request and will reply from ${config.email || "the platform email"}.`;
        message.hidden = false;
      }
      form.reset();
    });
  });

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll(".footer-bottom .container").forEach((container) => {
    if (!container.querySelector("[data-disclaimer]") && config.disclaimer) {
      const disclaimer = document.createElement("p");
      disclaimer.className = "site-disclaimer";
      disclaimer.dataset.disclaimer = "";
      disclaimer.textContent = config.disclaimer;
      container.appendChild(disclaimer);
    }
  });

  document.querySelectorAll("[data-root-link]").forEach((link) => {
    const target = link.getAttribute("data-root-link");
    link.setAttribute("href", `${root}${target}`);
  });

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
})();
