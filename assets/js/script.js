/* ============================================================
   Neeraja Anupama — Portfolio interactions
   ============================================================ */
(function () {
  "use strict";

  /* Enable reveal animations only when JS runs (content stays visible without JS) */
  document.body.classList.add("anim");

  var nav = document.getElementById("nav");
  var navLinks = document.getElementById("navLinks");
  var navToggle = document.getElementById("navToggle");

  /* ---- Nav: solidify on scroll ---- */
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  function closeMenu() {
    navLinks.classList.remove("open");
    nav.classList.remove("menu-open");
  }
  navToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
    nav.classList.toggle("menu-open");
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---- Smooth scroll (accounts for fixed nav) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ---- Accordion (capabilities) ---- */
  document.querySelectorAll(".acc-item .acc-head").forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.parentElement;
      var isOpen = item.classList.contains("open");
      // close siblings for a clean single-open feel
      item.parentElement.querySelectorAll(".acc-item").forEach(function (sib) {
        sib.classList.remove("open");
      });
      if (!isOpen) item.classList.add("open");
    });
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Active nav link by section ---- */
  var sections = document.querySelectorAll("section[id], header[id]");
  var linkMap = {};
  navLinks.querySelectorAll('a[href^="#"]').forEach(function (a) {
    linkMap[a.getAttribute("href").slice(1)] = a;
  });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.values(linkMap).forEach(function (a) { a.classList.remove("active"); });
          var a = linkMap[en.target.id];
          if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Lightbox (design pieces) ---- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var lbClose = document.getElementById("lbClose");

  function openLightbox(src, cap) {
    lbImg.src = src;
    lbImg.alt = cap || "";
    lbCap.textContent = cap || "";
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(function () { lbImg.src = ""; }, 300);
  }
  document.querySelectorAll(".cell[data-full]").forEach(function (p) {
    p.addEventListener("click", function () {
      openLightbox(p.getAttribute("data-full"), p.getAttribute("data-cap"));
    });
  });
  lbClose.addEventListener("click", closeLightbox);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });

  /* ---- Year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
