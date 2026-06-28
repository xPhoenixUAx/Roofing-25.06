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

  document.querySelectorAll(".brand [data-company]").forEach((node) => {
    node.classList.add("brand-text");
    node.innerHTML = '<span class="brand-name"><span>Roof</span><span class="brand-link">Link</span></span><span class="brand-tagline">Roofing Network</span>';
  });

  document.querySelectorAll(".brand-mark").forEach((mark) => {
    mark.innerHTML = '<i data-lucide="house" aria-hidden="true"></i>';
  });

  const navToggle = document.querySelector(".nav-toggle");
  const navPanel = document.querySelector(".nav-panel");
  if (navToggle && navPanel) {
    const setNavOpen = (open) => {
      navToggle.setAttribute("aria-expanded", String(open));
      navPanel.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };

    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!expanded);
    });

    navPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setNavOpen(false);
    });
  }

  const header = document.querySelector(".site-header");
  function syncHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
  }
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  document.querySelectorAll(".estimate-panel").forEach((panel) => {
    const toggle = panel.querySelector(".estimate-toggle");
    const form = panel.querySelector(".estimate-form");
    if (!toggle || !form) return;

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("is-form-open", open);
      window.dispatchEvent(new Event("resize"));
    });
  });

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

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    const closeButton = modal.querySelector("button[data-modal-close]");
    if (closeButton) closeButton.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.closest(".form-modal"));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".form-modal:not([hidden])").forEach(closeModal);
    }
  });

  document.querySelectorAll(".roof-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = form.querySelector(".form-success");
      const submitButton = form.querySelector('[type="submit"]');

      if (form.dataset.asyncHandler) {
        const endpoint = form.getAttribute("action");
        if (!endpoint) return;

        if (message) {
          message.hidden = true;
          message.textContent = "";
          message.classList.remove("is-error");
        }
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.dataset.originalText = submitButton.textContent || "";
          submitButton.textContent = "Sending...";
        }

        fetch(endpoint, {
          method: form.getAttribute("method") || "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        })
          .then(async (response) => {
            const data = await response.json().catch(() => ({}));
            if (!response.ok || data.ok === false) {
              throw new Error(data.message || "The request could not be sent. Please try again.");
            }
            form.reset();
            openModal(document.querySelector(form.dataset.successModal || "#contact-success-modal"));
          })
          .catch((error) => {
            if (message) {
              message.textContent = error.message;
              message.classList.add("is-error");
              message.hidden = false;
            }
          })
          .finally(() => {
            if (submitButton) {
              submitButton.disabled = false;
              submitButton.textContent = submitButton.dataset.originalText || "Send message";
            }
          });
        return;
      }

      if (message) {
        message.textContent = `Thanks. ${config.companyName || "The request network"} received your request and will reply from ${config.email || "the platform email"}.`;
        message.classList.remove("is-error");
        message.hidden = false;
      }
      form.reset();
    });
  });

  document.querySelectorAll("[data-accordion]").forEach((accordion) => {
    const items = Array.from(accordion.querySelectorAll("article"));

    function setItem(item, open) {
      const button = item.querySelector("button[aria-expanded]");
      const answer = item.querySelector(".faq-answer");
      if (!button || !answer) return;

      item.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      answer.style.height = open ? `${answer.scrollHeight}px` : "0px";
    }

    items.forEach((item) => {
      const button = item.querySelector("button[aria-expanded]");
      const answer = item.querySelector(".faq-answer");
      if (!button || !answer) return;

      setItem(item, item.classList.contains("is-open"));

      button.addEventListener("click", () => {
        const shouldOpen = button.getAttribute("aria-expanded") !== "true";
        items.forEach((otherItem) => setItem(otherItem, shouldOpen && otherItem === item));
      });
    });

    window.addEventListener("resize", () => {
      items.forEach((item) => {
        if (item.classList.contains("is-open")) setItem(item, true);
      });
    }, { passive: true });
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

  if (config.phone && !document.querySelector(".floating-cta")) {
    const floatingCta = document.createElement("a");
    floatingCta.className = "floating-cta";
    floatingCta.href = `tel:${(config.phone || "").replace(/[^\d+]/g, "")}`;
    floatingCta.setAttribute("aria-label", `Call ${config.companyName || "RoofLink"}`);
    floatingCta.innerHTML = '<i data-lucide="phone-call" aria-hidden="true"></i><span>Call</span>';
    document.body.appendChild(floatingCta);
    document.body.classList.add("has-floating-cta");

    const syncFloatingCta = () => {
      const formInView = Array.from(document.querySelectorAll(".roof-form")).some((form) => {
        const rect = form.getBoundingClientRect();
        return rect.top < window.innerHeight - 90 && rect.bottom > 90;
      });
      floatingCta.classList.toggle("is-visible", window.scrollY > 48 && !formInView);
    };

    syncFloatingCta();
    window.addEventListener("scroll", syncFloatingCta, { passive: true });
    window.addEventListener("resize", syncFloatingCta, { passive: true });
  }

  document.querySelectorAll("[data-root-link]").forEach((link) => {
    const target = link.getAttribute("data-root-link");
    link.setAttribute("href", `${root}${target}`);
  });

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
})();
