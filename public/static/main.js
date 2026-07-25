/**
 * KryzOx Technologies — Main JavaScript
 * Navbar scroll effect + Mobile menu + Dropdown
 */

(function () {
  "use strict";

  // ── DOM References ──────────────────────────────────────────────────────
  const navbar = document.getElementById("navbar");
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!navbar) return; // safety guard

  // ── Navbar Scroll Effect ────────────────────────────────────────────────
  let lastScrollY = 0;
  let ticking = false;
  const SCROLL_THRESHOLD = 20;

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    },
    { passive: true },
  );

  // Initial state check
  updateNavbar();

  // ── Mobile Menu Toggle ──────────────────────────────────────────────────
  function openMobileMenu() {
    burgerBtn.classList.add("open");
    burgerBtn.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("open");
    mobileMenu.removeAttribute("aria-hidden");
    navbar.classList.add("mobile-open");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    burgerBtn.classList.remove("open");
    burgerBtn.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    navbar.classList.remove("mobile-open");
    document.body.style.overflow = "";

    // Close all mobile submenus
    document
      .querySelectorAll(".navbar__mobile-sub.open")
      .forEach(function (sub) {
        sub.classList.remove("open");
      });
    document
      .querySelectorAll(".navbar__mobile-link--parent")
      .forEach(function (btn) {
        btn.setAttribute("aria-expanded", "false");
      });
  }

  burgerBtn.addEventListener("click", function () {
    const isOpen = mobileMenu.classList.contains("open");
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // ── Mobile Dropdown (Ressources) ────────────────────────────────────────
  document
    .querySelectorAll(".navbar__mobile-link--parent")
    .forEach(function (btn) {
      btn.addEventListener("click", function () {
        const group = btn.closest(".navbar__mobile-group");
        const sub = group ? group.querySelector(".navbar__mobile-sub") : null;
        if (!sub) return;

        const isOpen = sub.classList.contains("open");
        if (isOpen) {
          sub.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        } else {
          sub.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

  // ── Desktop Dropdown — keyboard & click support ─────────────────────────
  document.querySelectorAll(".navbar__item--dropdown").forEach(function (item) {
    const trigger = item.querySelector(".navbar__link--dropdown-trigger");
    const dropdown = item.querySelector(".navbar__dropdown");
    if (!trigger || !dropdown) return;

    // Click toggle
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = item.classList.contains("open");
      // Close all dropdowns first
      document
        .querySelectorAll(".navbar__item--dropdown.open")
        .forEach(function (el) {
          el.classList.remove("open");
          el.querySelector(".navbar__link--dropdown-trigger")?.setAttribute(
            "aria-expanded",
            "false",
          );
        });
      if (!isOpen) {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });

    // Keyboard accessibility
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger.click();
      }
      if (e.key === "Escape") {
        item.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        trigger.focus();
      }
    });
  });

  // Close dropdown on outside click
  document.addEventListener("click", function () {
    document
      .querySelectorAll(".navbar__item--dropdown.open")
      .forEach(function (el) {
        el.classList.remove("open");
        el.querySelector(".navbar__link--dropdown-trigger")?.setAttribute(
          "aria-expanded",
          "false",
        );
      });
  });

  // ── Active link on scroll ───────────────────────────────────────────────
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');

  const observerOptions = {
    rootMargin: "-50% 0px -50% 0px",
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          link.classList.remove("navbar__link--active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("navbar__link--active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // ── Close mobile menu on link click ────────────────────────────────────
  document
    .querySelectorAll(
      ".navbar__mobile-link:not(.navbar__mobile-link--parent), .navbar__mobile-sublink",
    )
    .forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileMenu();
      });
    });

  // ── Close mobile menu on window resize ─────────────────────────────────
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1024 && mobileMenu.classList.contains("open")) {
      closeMobileMenu();
    }
  });

  // ── Smooth scroll offset for fixed navbar ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();

      const navbarHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--nav-height",
        ) || "80",
        10,
      );

      const elementPosition =
        target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    });
  });
})();
