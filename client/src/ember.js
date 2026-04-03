// ─── Jabroni's Wood Fired — Ember Glow Layer ─────────────────────────────────
// Fixed canvas at z-index:9998, mix-blend-mode:screen.
// Screen blend: black = transparent, glow colors add light on top of page.

function initEmber() {
  const isMobile   = 'ontouchstart' in window;
  const COUNT      = isMobile ? 40 : 80;

  // ── Canvas ──────────────────────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText = [
    'position:fixed', 'top:0', 'left:0',
    'width:100%', 'height:100%',
    'z-index:9998',
    'pointer-events:none',
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

  // ── Particles ────────────────────────────────────────────────────────────────
  const COLORS = [
    [255, 100, 20],
    [255,  60,  0],
    [220,  80, 10],
    [255, 140, 40],
  ];

  const particles = Array.from({ length: COUNT }, () => spawnParticle(true));

  function spawnParticle(anywhere) {
    const col = COLORS[(Math.random() * COLORS.length) | 0];
    // Weighted toward bottom half of screen
    const yRand = Math.random();
    const y = anywhere
      ? H * (0.3 + 0.7 * Math.pow(Math.random(), 0.6))
      : H * (0.5 + 0.5 * Math.pow(Math.random(), 0.5));

    return {
      x:          Math.random() * W,
      y:          y,
      r:          col,
      g:          col[1],
      b:          col[2],
      radius:     1.2 + Math.random() * 2.2,         // 1.2–3.4px
      phase:      Math.random() * Math.PI * 2,        // pulse offset
      pulseSpeed: 0.0008 + Math.random() * 0.0025,   // very slow flicker
      driftX:     (Math.random() - 0.5) * 0.12,      // slow horizontal sway
      driftY:     -(0.04 + Math.random() * 0.12),    // gentle upward rise
      life:       0,
      maxLife:    300 + Math.random() * 400,          // 5–12 sec at 60fps
      col,
    };
  }

  // ── Loop ─────────────────────────────────────────────────────────────────────
  let last = performance.now();

  function loop(now) {
    const dt = Math.min((now - last) / 16.667, 3);
    last = now;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life += dt;

      if (p.life >= p.maxLife) {
        particles[i] = spawnParticle(false);
        continue;
      }

      // Fade in first 60 frames, fade out last 60 frames
      const t        = p.life / p.maxLife;
      const fadeIn   = Math.min(p.life / 60, 1);
      const fadeOut  = Math.min((p.maxLife - p.life) / 60, 1);
      const envelope = fadeIn * fadeOut;

      // Slow pulse/flicker
      const pulse = 0.5 + 0.5 * Math.sin(now * p.pulseSpeed + p.phase);
      const alpha = envelope * (0.3 + 0.6 * pulse);
      if (alpha < 0.01) continue;

      p.x += p.driftX * dt;
      p.y += p.driftY * dt;

      // Glow halo
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 5);
      glow.addColorStop(0,    `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${(alpha * 0.9).toFixed(3)})`);
      glow.addColorStop(0.35, `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${(alpha * 0.35).toFixed(3)})`);
      glow.addColorStop(1,    `rgba(${p.col[0]},${p.col[1]},${p.col[2]},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Hot core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,220,180,${Math.min(alpha * 1.2, 1).toFixed(3)})`;
      ctx.fill();
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
