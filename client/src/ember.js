// ─── Jabroni's Wood Fired — Ember Glow Layer ─────────────────────────────────
// mix-blend-mode:screen — black = invisible, glow adds light above page.

function initEmber() {
  const isMobile = 'ontouchstart' in window;
  const COUNT    = isMobile ? 12 : 22;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = [
    'position:fixed', 'top:0', 'left:0',
    'width:100%', 'height:100%',
    'z-index:9998', 'pointer-events:none',
    'mix-blend-mode:screen',
  ].join(';');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    }, 150);
  });

  // ── Ember factory ─────────────────────────────────────────────────────────
  function makeEmber() {
    // Weighted toward lower 2/3 of screen
    const y = H * (0.25 + 0.75 * Math.pow(Math.random(), 0.7));
    const x = W * (0.05 + 0.90 * Math.random());

    // Each ember is 3–5 overlapping blobs at slight offsets
    // This is what breaks the perfect-circle silhouette
    const blobCount = 3 + (Math.random() * 2 | 0);
    const blobs = Array.from({ length: blobCount }, () => ({
      dx: (Math.random() - 0.5) * 8,   // offset from ember center
      dy: (Math.random() - 0.5) * 6,
      r:  6 + Math.random() * 14,       // each blob 6–20px radius
    }));

    // Deep coal colors — no bright orange, these are aged embers
    const palettes = [
      [180, 40,  5],   // deep red coal
      [160, 35,  0],   // burnt sienna
      [200, 55, 10],   // slightly warmer
      [140, 30,  5],   // almost dead coal
    ];
    const col = palettes[(Math.random() * palettes.length) | 0];

    return {
      x, y,
      blobs,
      col,
      // Each ember breathes independently at a very slow, irregular rate
      phase:      Math.random() * Math.PI * 2,
      pulseSpeed: 0.00035 + Math.random() * 0.0006,  // 30–90 second cycle feel
      // Occasional deeper throb layered on top of base pulse
      throbPhase: Math.random() * Math.PI * 2,
      throbSpeed: 0.0009 + Math.random() * 0.0015,
      // Lifespan
      life:    0,
      maxLife: 600 + Math.random() * 800,   // 10–23 sec at 60fps — patient
      // Very slow horizontal drift, barely perceptible
      driftX:  (Math.random() - 0.5) * 0.03,
    };
  }

  const embers = Array.from({ length: COUNT }, makeEmber);
  // Stagger life so they don't all fade in at once
  for (const e of embers) e.life = Math.random() * e.maxLife * 0.7;

  // ── Loop ─────────────────────────────────────────────────────────────────
  let last = performance.now();

  function loop(now) {
    const dt = Math.min((now - last) / 16.667, 3);
    last = now;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < embers.length; i++) {
      const e = embers[i];
      e.life += dt;

      if (e.life >= e.maxLife) {
        embers[i] = makeEmber();
        continue;
      }

      e.x += e.driftX * dt;

      const t = e.life / e.maxLife;
      // Smooth fade in / fade out envelope
      const fadeIn  = Math.min(e.life / 90, 1);
      const fadeOut = Math.min((e.maxLife - e.life) / 120, 1);
      const env = fadeIn * fadeOut;

      // Two-layer pulse: slow breath + occasional throb
      const breath = 0.55 + 0.45 * Math.sin(now * e.pulseSpeed + e.phase);
      const throb  = 0.80 + 0.20 * Math.sin(now * e.throbSpeed + e.throbPhase);
      const intensity = env * breath * throb;

      if (intensity < 0.01) continue;

      const [r, g, b] = e.col;

      // Draw each blob — irregular offsets = organic coal shape
      for (const blob of e.blobs) {
        const bx = e.x + blob.dx;
        const by = e.y + blob.dy;

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, blob.r);
        // Center: warm amber-white hot spot
        grad.addColorStop(0,    `rgba(${Math.min(r+60,255)},${Math.min(g+30,120)},${b},${(intensity * 0.55).toFixed(3)})`);
        // Mid: the coal's true color
        grad.addColorStop(0.4,  `rgba(${r},${g},${b},${(intensity * 0.28).toFixed(3)})`);
        // Edge: deep red bleed, very faint
        grad.addColorStop(0.75, `rgba(${Math.max(r-30,80)},${Math.max(g-20,0)},0,${(intensity * 0.08).toFixed(3)})`);
        grad.addColorStop(1,    'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(bx, by, blob.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEmber);
} else {
  initEmber();
}
