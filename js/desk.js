/* ============================================================
   meowni.ca — "desk" theme behaviour (vanilla, progressive)
   Nothing here is required to read the site; it only enhances.
   ============================================================ */
(function () {
  "use strict";
  const isMobile = () => window.matchMedia("(max-width: 759px)").matches;
  let zTop = 10; // running counter so a dragged window jumps above its siblings
  const X_SVG = '<svg viewBox="0 0 16 16" width="9" height="9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>';

  /* ---------- persisted prefs ---------- */
  // const store = {
  //   accent: localStorage.getItem("desk.accent") || "red",
  //   wall: (localStorage.getItem("desk.wall") === "weave" ? "grid" : localStorage.getItem("desk.wall")) || "dots",
  //   theme: localStorage.getItem("desk.theme") || "mac",
  // };
  const store = {
    accent: "teal",
    wall: "dots", 
    theme: "mac",
  };
  const THEMES = ["mac", "cga", "msdos", "ttc"]; // "mac" is the default (no data-theme)
  const ACCENTS = {
    red:  { a: "#EC5B87", ink: "oklch(0.5 0.2 25)",  soft: "oklch(0.93 0.05 25)" },
    blue: { a: "#4BB8DB", ink: "oklch(0.45 0.18 265)", soft: "oklch(0.93 0.04 265)" },
    gold: { a: "#F9B518", ink: "oklch(0.52 0.13 85)", soft: "oklch(0.93 0.05 85)" },
    teal: { a: "#438F64", ink: "oklch(0.5 0.1 185)",  soft: "oklch(0.93 0.04 185)" },
    // rainbow drives a solid mid-spectrum colour for fills/borders/selection;
    // the > prompts, prose links and the <hr> go full-spectrum via CSS below.
    rainbow: { a: "#A166AB", ink: "#7B3F86", soft: "oklch(0.93 0.045 330)" },
  };
  function applyAccent(k) {
    const p = ACCENTS[k] || ACCENTS.red;
    // Set on <body>, not <html>: the body{} rule redeclares --accent, so an
    // inline style on body is what actually wins for body + all its content.
    const r = document.body.style;
    r.setProperty("--accent", p.a);
    r.setProperty("--accent-soft", p.soft);
    document.body.dataset.accent = k; // hooks the rainbow gradient rules
    store.accent = k; 
    //localStorage.setItem("desk.accent", k);
    document.querySelectorAll(".cp-sw").forEach(s => s.classList.toggle("on", s.dataset.acc === k));
  }
  function applyWall(w) {
    document.body.dataset.wall = w;
    store.wall = w; 
    //localStorage.setItem("desk.wall", w);
    document.querySelectorAll(".cp-seg[data-wall]").forEach(s => s.classList.toggle("on", s.dataset.wall === w));
  }
  function applyTheme(t) {
    t = THEMES.includes(t) ? t : "mac";
    if (t === "mac") {
      delete document.body.dataset.theme;       // default Mac palette (body{} rules)
      applyAccent(store.accent);                // accent picker is live on Mac
    } else {
      document.body.dataset.theme = t;          // retro palette via body[data-theme]
      // retro themes pin their own accent — drop the inline accent so theirs wins
      ["--accent", "--accent-soft"]
        .forEach(v => document.body.style.removeProperty(v));
    }
    store.theme = t; 
    //localStorage.setItem("desk.theme", t);
    document.querySelectorAll(".cp-seg[data-theme]").forEach(s => s.classList.toggle("on", s.dataset.theme === t));
    const ag = document.getElementById("cp-accent-group");
    if (ag) ag.classList.toggle("is-disabled", t !== "mac"); // accent only matters on Mac
  }

  /* ---------- live clock ---------- */
  function tick() {
    const t = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    document.querySelectorAll("#clock, .m-clock").forEach(el => (el.textContent = t));
  }

  /* ---------- control panel (✦) ---------- */
  function openCP() {
    if (document.querySelector(".cp-scrim")) return;
    const s = document.createElement("div");
    s.className = "cp-scrim";
    s.innerHTML = `
      <div class="cp">
        <div class="titlebar"><span class="tb-box tb-left" aria-hidden="true"></span><span class="ttl">control.md</span><span class="tb-box tb-x" data-cp-close role="button" aria-label="Close">${X_SVG}</span></div>
        <div class="cp-body">
          <div class="cp-group">
            <div class="cp-label">Theme</div>
            <div class="cp-seg-row">
              <button class="cp-seg" data-theme="mac">Mac</button>
              <button class="cp-seg" data-theme="cga">CGA</button>
              <button class="cp-seg" data-theme="msdos">DOS</button>
              <button class="cp-seg" data-theme="ttc">Term</button>
            </div>
          </div>
          <div class="cp-group" id="cp-accent-group">
            <div class="cp-label">Accent</div>
            <div class="cp-sw-row">
              <button class="cp-sw" data-acc="red"  style="background:#FE81AC"></button>
              <button class="cp-sw" data-acc="blue" style="background:#4BB8DB"></button>
              <button class="cp-sw" data-acc="gold" style="background:#F9B518"></button>
              <button class="cp-sw" data-acc="teal" style="background:#438F64"></button>
              <button class="cp-sw" data-acc="rainbow" style="background:linear-gradient(135deg,#F79533,#EF4E7B,#A166AB,#1098AD,#6DBA82)"></button>
            </div>
          </div>
          <div class="cp-group">
            <div class="cp-label">Wallpaper</div>
            <div class="cp-seg-row">
              <button class="cp-seg" data-wall="dots">Dots</button>
              <button class="cp-seg" data-wall="grid">Grid</button>
              <button class="cp-seg" data-wall="plain">Plain</button>
            </div>
          </div>
          <div class="cp-foot">Note: These changes don't persist across sessions. It would
          be too strange to be welcomed by the CGA theme because past you accidentally
          chose it for a laugh.</div>
          <br>
          <div class="cp-foot">version v 1.0.0 / tap outside to close</div>
        </div>
      </div>`;
    document.body.appendChild(s);
    s.addEventListener("click", (e) => { if (e.target === s) closeCP(); });
    applyAccent(store.accent); applyWall(store.wall); applyTheme(store.theme);
    requestAnimationFrame(() => s.classList.add("in"));
  }
  function closeCP() {
    const s = document.querySelector(".cp-scrim");
    if (!s) return;
    s.classList.remove("in");
    setTimeout(() => s.remove(), 240);
  }

  /* ---------- draggable windows (desktop) ---------- */
  function dragify() {
    // every in-flow window except the behind-the-article listing
    document.querySelectorAll(".deskwrap .window:not(.win-listing-bg)").forEach((win) => {
      const bar = win.querySelector(".titlebar");
      if (!bar || bar.dataset.drag) return;
      bar.dataset.drag = "1";
      let sx, sy, ox, oy, on = false;
      bar.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".tb-box")) return;
        on = true;
        if (getComputedStyle(win).position === "static") win.style.position = "relative";
        win.style.zIndex = ++zTop; // bring this window to the front of its siblings
        sx = e.clientX; sy = e.clientY;
        ox = parseFloat(win.style.left) || 0; oy = parseFloat(win.style.top) || 0;
        bar.setPointerCapture(e.pointerId);
      });
      bar.addEventListener("pointermove", (e) => {
        if (!on) return;
        win.style.left = ox + (e.clientX - sx) + "px";
        win.style.top = oy + (e.clientY - sy) + "px";
      });
      const stop = () => (on = false);
      bar.addEventListener("pointerup", stop);
      bar.addEventListener("pointercancel", stop);
    });
  }

  /* ---------- generic draggable (floating windows) ---------- */
  function makeDraggable(win) {
    const bar = win.querySelector(".titlebar");
    if (!bar) return;
    let sx, sy, ox, oy, on = false;
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".tb-box")) return;
      on = true;
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(win.style.left) || win.offsetLeft;
      oy = parseFloat(win.style.top) || win.offsetTop;
      win.style.zIndex = 80;
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener("pointermove", (e) => {
      if (!on) return;
      let nx = ox + (e.clientX - sx), ny = oy + (e.clientY - sy);
      nx = Math.max(-win.offsetWidth + 90, Math.min(nx, window.innerWidth - 90));
      ny = Math.max(28, Math.min(ny, window.innerHeight - 34));
      win.style.left = nx + "px"; win.style.top = ny + "px";
    });
    const stop = () => (on = false);
    bar.addEventListener("pointerup", stop);
    bar.addEventListener("pointercancel", stop);
  }

  /* ---------- generative art window (Monica's "birbs") ---------- */
  function openArt() {
    const existing = document.getElementById("art-window");
    if (existing) { existing.style.zIndex = 80; return; }
    const win = document.createElement("div");
    win.className = "window floatwin art-window";
    win.id = "art-window";
    win.innerHTML = `
      <div class="titlebar">
        <span class="tb-box tb-left" aria-hidden="true"></span>
        <span class="ttl">birds.exe</span>
        <span class="tb-box tb-x" data-floatclose role="button" aria-label="Close window">${X_SVG}</span>
      </div>
      <div class="art-body">
        <div id="birbs"><canvas></canvas></div>
        <p class="art-legend"><b>click the art</b> to regenerate it ✦</p>
      </div>`;
    // center-ish, with a little offset from the menu bar
    const w = Math.min(392, window.innerWidth - 24);
    win.style.width = w + "px";
    win.style.left = Math.max(12, Math.round((window.innerWidth - w) / 2)) + "px";
    win.style.top = isMobile() ? "60px" : "76px";
    win.style.zIndex = 80;
    document.body.appendChild(win);
    makeDraggable(win);
    // draw it (birds.js exposes window.birds + window.p)
    if (typeof window.birds === "function" && window.p) {
      requestAnimationFrame(() => window.birds(window.p));
    }
  }

  /* ---------- snake (a tiny Nokia-style game) ---------- */
  function openSnake() {
    const existing = document.getElementById("snake-window");
    if (existing) { existing.style.zIndex = ++zTop; return; }
    const win = document.createElement("div");
    win.className = "window floatwin snake-window";
    win.id = "snake-window";
    win.innerHTML = `
      <div class="titlebar">
        <span class="tb-box tb-left" aria-hidden="true"></span>
        <span class="ttl">snake.exe</span>
        <span class="tb-box tb-x" data-floatclose role="button" aria-label="Close window">${X_SVG}</span>
      </div>
      <div class="snake-body">
        <canvas id="snake-canvas" width="224" height="168"></canvas>
        <p class="snake-legend"><b>arrows / swipe</b> &middot; score <span id="snake-score">0</span></p>
      </div>`;
    const w = Math.min(256, window.innerWidth - 24);
    win.style.width = w + "px";
    win.style.left = Math.max(12, Math.round((window.innerWidth - w) / 2)) + "px";
    win.style.top = isMobile() ? "70px" : "92px";
    win.style.zIndex = 80;
    document.body.appendChild(win);
    makeDraggable(win);
    runSnake(win);
  }
  function runSnake(win) {
    const canvas = win.querySelector("#snake-canvas");
    const ctx = canvas.getContext("2d");
    const scoreEl = win.querySelector("#snake-score");
    const CELL = 14, COLS = canvas.width / CELL, ROWS = canvas.height / CELL;
    
    const rootStyles = window.getComputedStyle(document.body);
    const paperColor = rootStyles.getPropertyValue('--paper').trim();
    const inkColor = rootStyles.getPropertyValue('--ink').trim();
    const BG = paperColor, PX = inkColor;

    let snake, dir, nextDir, food, score, dead, started, loop;

    function placeFood() {
      do { food = { x: (Math.random() * COLS) | 0, y: (Math.random() * ROWS) | 0 }; }
      while (snake.some(s => s.x === food.x && s.y === food.y));
    }
    function reset() {
      snake = [{ x: 5, y: 6 }, { x: 4, y: 6 }, { x: 3, y: 6 }];
      dir = { x: 1, y: 0 }; nextDir = dir;
      score = 0; dead = false; started = false;
      scoreEl.textContent = "0";
      placeFood(); draw();
    }
    function overlay(text) {
      const rootStyles = window.getComputedStyle(document.body);
      const inkColor = rootStyles.getPropertyValue('--ink').trim();
      ctx.fillStyle = inkColor;

      ctx.fillRect(0, canvas.height / 2 - 15, canvas.width, 30);
      ctx.fillStyle = BG;
      ctx.font = "bold 13px 'Roboto Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }
    function draw() {
      ctx.fillStyle = BG; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = PX;
      ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
      snake.forEach(s => ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2));
      if (dead) overlay("GAME OVER · TAP");
      else if (!started) overlay("PRESS ARROW");
    }
    function step() {
      if (!started || dead) return;
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
          snake.some(s => s.x === head.x && s.y === head.y)) { dead = true; draw(); return; }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) { score++; scoreEl.textContent = score; placeFood(); }
      else snake.pop();
      draw();
    }
    function setDir(x, y) {
      if (dead) { reset(); return; }
      if (snake.length > 1 && x === -dir.x && y === -dir.y) return; // no reversing
      nextDir = { x, y }; started = true;
    }
    const onKey = (e) => {
      if (!document.body.contains(canvas)) { document.removeEventListener("keydown", onKey); return; }
      const k = e.key; let handled = true;
      if (k === "ArrowUp" || k === "w") setDir(0, -1);
      else if (k === "ArrowDown" || k === "s") setDir(0, 1);
      else if (k === "ArrowLeft" || k === "a") setDir(-1, 0);
      else if (k === "ArrowRight" || k === "d") setDir(1, 0);
      else if (k === " " && dead) reset();
      else handled = false;
      if (handled) e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    let tsx = null, tsy = null;
    canvas.addEventListener("touchstart", (e) => { const t = e.touches[0]; tsx = t.clientX; tsy = t.clientY; }, { passive: true });
    canvas.addEventListener("touchend", (e) => {
      if (tsx == null) return; const t = e.changedTouches[0];
      const dx = t.clientX - tsx, dy = t.clientY - tsy;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0); else setDir(0, dy > 0 ? 1 : -1);
      }
      tsx = tsy = null;
    }, { passive: true });
    canvas.addEventListener("click", () => { if (dead) reset(); });
    reset();
    loop = setInterval(() => {
      if (!document.body.contains(canvas)) { clearInterval(loop); document.removeEventListener("keydown", onKey); return; }
      step();
    }, 150);
  }
  const M_NAV = [
    ["/is", "about"], ["https://meownica.studio", "art"], ["/reads", "reading"],
    ["/writes", "writing"], ["/makes", "projects"], ["/talks", "talks"],
  ];
  function buildMobile() {
    /* Mobile keeps the full desktop approach now (menu bar + windows on the
       dotted desk), so the separate pocket-organizer status bar/launcher is
       intentionally not built. Kept as a no-op so existing callers stay valid. */
    return;
  }
  function teardownMobile() {
    document.querySelector(".m-statusbar")?.remove();
    document.querySelector("[data-launch]")?.remove();
  }

  /* ---------- global clicks ---------- */
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-art]")) { e.preventDefault(); openArt(); return; }
    if (e.target.closest("[data-snake]")) { e.preventDefault(); openSnake(); return; }
    if (e.target.closest("[data-floatclose]")) { e.target.closest(".floatwin")?.remove(); return; }
    if (e.target.closest(".m-star") || e.target.closest("#menubar .star") || e.target.closest("[data-control]")) {
      e.preventDefault(); openCP(); return;
    }
    if (e.target.closest("[data-cp-close]")) { closeCP(); return; }
    const sw = e.target.closest(".cp-sw"); if (sw) { applyAccent(sw.dataset.acc); return; }
    const seg = e.target.closest(".cp-seg[data-wall]"); if (seg) { applyWall(seg.dataset.wall); return; }
    const th = e.target.closest(".cp-seg[data-theme]"); if (th) { applyTheme(th.dataset.theme); return; }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCP(); });

  /* ---------- mobile menu dropdown (the "menu" toggle in the menu bar) ---------- */
  document.addEventListener("click", (e) => {
    const grp = document.getElementById("mi-group");
    if (!grp) return;
    const btn = e.target.closest("[data-menu]");
    if (btn) {
      const open = grp.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    // any other click (an item, or outside) closes it
    if (grp.classList.contains("open")) {
      grp.classList.remove("open");
      document.querySelector("[data-menu]")?.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const grp = document.getElementById("mi-group");
    if (grp && grp.classList.contains("open")) {
      grp.classList.remove("open");
      document.querySelector("[data-menu]")?.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- init ---------- */
  function init() {
    applyWall(store.wall);
    applyTheme(store.theme); // also applies/clears the accent appropriately
    dragify();
    if (isMobile()) buildMobile();
    tick(); setInterval(tick, 10000);
    let wasM = isMobile();
    window.addEventListener("resize", () => {
      const m = isMobile();
      if (m !== wasM) { wasM = m; m ? buildMobile() : teardownMobile(); }
    });
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

  // Re-bind behaviours after DOM is swapped (used by the static Theme Preview only).
  window.__deskReinit = function () {
    applyWall(store.wall);
    applyTheme(store.theme); // keeps the saved theme + correct accent after a nav swap
    dragify();
    tick();
  };
})();
