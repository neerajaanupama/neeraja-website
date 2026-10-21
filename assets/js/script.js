/* ============================================================
   Anupama — shared interactions (home + dance)
   Content is fully visible without JS; this only adds polish.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Intro sequence: name / title reveal ---- */
  // Two frames so the initial (hidden) state paints before transitioning.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add("is-ready"); });
  });

  // Stagger the letters of the hero name and the dance title.
  document.querySelectorAll(".name .g").forEach(function (g, i) {
    g.style.transitionDelay = reduceMotion ? "0ms" : (80 + i * 55) + "ms";
  });
  document.querySelectorAll(".dance-title .ch").forEach(function (c, i) {
    c.style.transitionDelay = reduceMotion ? "0ms" : (260 + i * 60) + "ms";
  });
  document.querySelectorAll(".hero .seq").forEach(function (el, i) {
    el.style.transitionDelay = reduceMotion ? "0ms" : (650 + i * 90) + "ms";
  });

  /* ---- The name: hover (pointer) or tap (touch) shifts its form ---- */
  var name = document.getElementById("name");
  if (name) {
    var canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) {
      name.addEventListener("mouseenter", function () { name.classList.add("is-shifted"); });
      name.addEventListener("mouseleave", function () { name.classList.remove("is-shifted"); });
    } else {
      name.addEventListener("click", function () { name.classList.toggle("is-shifted"); });
    }
  }

  /* ---- Nav: solidify once the page scrolls ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Smooth in-page scrolling (native scroll-padding handles the nav offset) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });

  /* ---- Section entrances ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Active nav link for in-page sections ---- */
  var links = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  if ("IntersectionObserver" in window && Object.keys(links).length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (!a) return;
        if (en.isIntersecting) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* ---- Lightbox for design covers (native <dialog>: focus trap + Esc for free) ---- */
  var lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector("p");
    document.querySelectorAll(".cover[data-full]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lbImg.src = btn.getAttribute("data-full");
        lbImg.alt = btn.getAttribute("data-cap") || "";
        lbCap.textContent = btn.getAttribute("data-cap") || "";
        lb.showModal();
      });
    });
    lb.querySelector("[data-close]").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  } else {
    // No <dialog> support: covers open the image directly.
    document.querySelectorAll(".cover[data-full]").forEach(function (btn) {
      btn.addEventListener("click", function () { window.open(btn.getAttribute("data-full"), "_blank"); });
    });
  }

  /* ---- Year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
