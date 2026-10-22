/* ============================================================
   Anupama — "For You" reveal
   Tap to open · soft music (fades in) · a living, interactive sky
   Everything is readable with JS off; this only adds the magic.
   ============================================================ */
(function () {
  "use strict";

  var root   = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var body    = document.body;
  var veil    = document.getElementById("veil");
  var openBtn = document.getElementById("open");
  var song    = document.getElementById("song");
  var sound   = document.getElementById("sound");
  var cue     = document.getElementById("cue");
  var petals  = document.getElementById("petals");
  var motesEl = document.getElementById("motes");
  var flutters= document.getElementById("flutters");
  var bursts  = document.getElementById("bursts");
  var scenes  = document.querySelectorAll(".scene");

  var opened = false, playing = false;
  var TARGET_VOL = 0.46;

  body.classList.add("locked");

  /* ---------- Interactive name: split into hoverable letters ---------- */
  (function splitName() {
    var h = document.querySelector(".name");
    if (!h) return;
    var text = h.textContent.trim();
    h.setAttribute("aria-label", text);
    h.textContent = "";
    text.split("").forEach(function (ch) {
      var s = document.createElement("span");
      s.className = "l"; s.setAttribute("aria-hidden", "true"); s.textContent = ch;
      h.appendChild(s);
    });
  })();

  /* ---------- Reveal scenes as they enter view ---------- */
  var giftDone = false;
  function watchScenes() {
    if (!("IntersectionObserver" in window)) {
      scenes.forEach(function (s) { s.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          if (e.target.classList.contains("scene--gift") && !giftDone) {
            giftDone = true; celebrate();
          }
        }
      });
    }, { threshold: 0.35 });
    scenes.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Soft music, with a gentle fade-in ---------- */
  var fadeTimer = null;
  function fadeTo(target, ms) {
    if (!song) return;
    clearInterval(fadeTimer);
    var steps = 40, i = 0, start = song.volume, step = (target - start) / steps;
    fadeTimer = setInterval(function () {
      i++; song.volume = Math.max(0, Math.min(1, start + step * i));
      if (i >= steps) { clearInterval(fadeTimer); song.volume = target; }
    }, ms / steps);
  }
  function tryPlay() {
    if (!song) return;
    song.volume = 0;
    var p = song.play();
    if (p && typeof p.then === "function") {
      p.then(function () { setPlaying(true); fadeTo(TARGET_VOL, 2600); })
       .catch(function () { setPlaying(false); });
    } else { setPlaying(true); fadeTo(TARGET_VOL, 2600); }
  }
  function setPlaying(state) {
    playing = state;
    if (sound) sound.setAttribute("aria-pressed", state ? "true" : "false");
  }
  if (sound) sound.addEventListener("click", function () {
    if (!song) return;
    if (playing) { fadeTo(0, 500); setTimeout(function () { song.pause(); }, 520); setPlaying(false); }
    else { tryPlay(); }
  });

  /* ---------- Falling petals ---------- */
  function spawnPetals() {
    if (reduce || !petals) return;
    var colors = ["#f6aebc", "#f68fa2", "#ffd7a1", "#f2b6c6"];
    var n = window.innerWidth < 560 ? 10 : 16;
    for (var i = 0; i < n; i++) {
      var el = document.createElement("span");
      el.className = "petal";
      el.style.setProperty("--x",     (Math.random() * 100).toFixed(1) + "vw");
      el.style.setProperty("--sz",    (8 + Math.random() * 12).toFixed(0) + "px");
      el.style.setProperty("--dur",   (10 + Math.random() * 12).toFixed(1) + "s");
      el.style.setProperty("--delay", (-Math.random() * 16).toFixed(1) + "s");
      el.style.setProperty("--sway",  (Math.random() * 160 - 80).toFixed(0) + "px");
      el.style.setProperty("--pc",    colors[i % colors.length]);
      petals.appendChild(el);
    }
  }

  /* ---------- Twinkling motes ---------- */
  function spawnMotes() {
    if (reduce || !motesEl) return;
    var n = window.innerWidth < 560 ? 14 : 22;
    for (var i = 0; i < n; i++) {
      var m = document.createElement("span");
      m.className = "mote";
      m.style.setProperty("--x",   (Math.random() * 100).toFixed(1) + "vw");
      m.style.setProperty("--y",   (Math.random() * 100).toFixed(1) + "vh");
      m.style.setProperty("--sz",  (3 + Math.random() * 6).toFixed(0) + "px");
      m.style.setProperty("--dur", (4 + Math.random() * 6).toFixed(1) + "s");
      m.style.setProperty("--delay", (Math.random() * 6).toFixed(1) + "s");
      motesEl.appendChild(m);
    }
  }

  /* ---------- Butterflies ---------- */
  function spawnButterflies() {
    if (reduce || !flutters) return;
    ["f1", "f2"].forEach(function (cls) {
      var f = document.createElement("span");
      f.className = "flutter " + cls;
      f.innerHTML = '<span class="bfly"><span class="wing l"></span><span class="wing r"></span></span>';
      flutters.appendChild(f);
    });
  }

  /* ---------- Tap-to-bloom: petals burst where she touches ---------- */
  function burstAt(x, y, count) {
    if (reduce || !bursts) return;
    var colors = ["#f6aebc", "#f68fa2", "#ffd7a1", "#f2b6c6", "#ec6a4f"];
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "bp";
      var ang = Math.random() * Math.PI * 2, dist = 40 + Math.random() * 90;
      p.style.setProperty("--x",  x + "px");
      p.style.setProperty("--y",  y + "px");
      p.style.setProperty("--dx", (Math.cos(ang) * dist).toFixed(0) + "px");
      p.style.setProperty("--dy", (Math.sin(ang) * dist + 60).toFixed(0) + "px");
      p.style.setProperty("--sz", (9 + Math.random() * 10).toFixed(0) + "px");
      p.style.setProperty("--rot", (Math.random() * 540 - 100).toFixed(0) + "deg");
      p.style.setProperty("--dur", (1.3 + Math.random() * 1).toFixed(2) + "s");
      p.style.setProperty("--pc", colors[i % colors.length]);
      bursts.appendChild(p);
      p.addEventListener("animationend", function () { this.remove(); });
    }
  }
  function onTap(e) {
    if (!opened) return;
    if (e.target.closest && e.target.closest("a, button")) return; /* keep real controls clickable */
    var x = e.touches ? e.touches[0].clientX : e.clientX;
    var y = e.touches ? e.touches[0].clientY : e.clientY;
    burstAt(x, y, 10);
  }
  /* a soft shower at the gift */
  function celebrate() {
    if (reduce) return;
    var w = window.innerWidth;
    for (var i = 0; i < 26; i++) {
      (function (d) { setTimeout(function () {
        burstAt(w * (0.15 + Math.random() * 0.7), window.innerHeight * 0.28, 4);
      }, d); })(i * 70);
    }
  }

  /* ---------- Pointer parallax + scroll warmth ---------- */
  var px = 0, py = 0, tpx = 0, tpy = 0, running = false;
  function onMove(e) {
    var cx = e.touches ? e.touches[0].clientX : e.clientX;
    var cy = e.touches ? e.touches[0].clientY : e.clientY;
    tpx = (cx / window.innerWidth) * 2 - 1;
    tpy = (cy / window.innerHeight) * 2 - 1;
  }
  function frame() {
    px += (tpx - px) * 0.06; py += (tpy - py) * 0.06;
    var max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    var prog = Math.min(1, Math.max(0, window.scrollY / max));
    root.style.setProperty("--px", px.toFixed(3));
    root.style.setProperty("--py", py.toFixed(3));
    root.style.setProperty("--prog", prog.toFixed(3));
    requestAnimationFrame(frame);
  }
  function startLoop() {
    if (running) return; running = true;
    window.addEventListener("pointermove", onMove, { passive: true });
    requestAnimationFrame(frame);
  }

  /* ---------- Scroll cue hides once she starts ---------- */
  function armCue() {
    if (!cue) return;
    cue.hidden = false;
    window.addEventListener("scroll", function hide() {
      cue.classList.add("gone");
      window.removeEventListener("scroll", hide);
    }, { passive: true, once: true });
  }

  /* ---------- Open the gift ---------- */
  function open() {
    if (opened) return;
    opened = true;

    body.classList.remove("locked");
    body.classList.add("open");
    veil.classList.add("lift");

    if (sound) sound.hidden = false;
    tryPlay();
    spawnPetals();
    spawnMotes();
    watchScenes();
    armCue();
    startLoop();

    document.addEventListener("pointerdown", onTap, { passive: true });

    window.scrollTo(0, 0);
    setTimeout(function () { if (scenes[0]) scenes[0].classList.add("in"); }, 300);
    setTimeout(function () { if (veil) veil.style.display = "none"; }, 1300);
  }

  if (openBtn) openBtn.addEventListener("click", open);
  if (veil) veil.addEventListener("click", function (e) { if (e.target !== openBtn) open(); });
  document.addEventListener("keydown", function (e) {
    if (!opened && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(); }
  });
})();
