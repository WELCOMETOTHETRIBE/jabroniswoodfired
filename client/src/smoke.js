// ─── Jabroni's Wood Fired — Smoke Particle Engine ────────────────────────────
// Physics-based smoke tied to cursor/touch. Canvas overlays all content.

// ─── Perlin Noise 2D ─────────────────────────────────────────────────────────
const _perm = new Uint8Array(512);
const _grad2 = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];

(function buildPerm() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.random() * (i + 1) | 0;
    const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) _perm[i] = p[i & 255];
})();

function _fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function _lerp(a, b, t) { return a + t * (b - a); }

function noise2D(x, y) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = _fade(xf), v = _fade(yf);
  const a  = _perm[X]     + Y;
  const b  = _perm[X + 1] + Y;
  const g00 = _grad2[_perm[a]     & 7];
  const g10 = _grad2[_perm[b]     & 7];
  const g01 = _grad2[_perm[a + 1] & 7];
  const g11 = _grad2[_perm[b + 1] & 7];
  return _lerp(
    _lerp(g00[0] * xf       + g00[1] * yf,       g10[0] * (xf - 1) + g10[1] * yf,       u),
    _lerp(g01[0] * xf       + g01[1] * (yf - 1), g11[0] * (xf - 1) + g11[1] * (yf - 1), u),
    v
  );
}

// ─── Particle ─────────────────────────────────────────────────────────────────
const SMOKE_COLORS = ['210,200,190', '180,175,170', '230,220,205'];

class Particle {
  constructor() {
    this.dead = true; // start inactive; reset() activates
  }

  reset(x, y) {
    this.x  = x + (Math.random() - 0.5) * 16;
    this.y  = y + (Math.random() - 0.5) * 16;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = -(0.4 + Math.random() * 0.4);
    this.age      = 0;
    this.lifetime = (90 + Math.random() * 50) | 0;
    this.maxRadius = 14 + Math.random() * 14;   // 14–28px at peak
    this.color    = SMOKE_COLORS[Math.random() * 3 | 0];
    // unique noise-space offset so every particle follows a distinct path
    this.nx = Math.random() * 200;
    this.ny = Math.random() * 200;
    this.dead = false;
  }

  update() {
    if (this.dead) return;
    this.age++;
    if (this.age >= this.lifetime) { this.dead = true; return; }

    // Perlin-driven turbulence — writhes, doesn't drift linearly
    const t = this.age * 0.018;
    this.vx += noise2D(this.nx + t, this.ny      ) * 0.09;
    this.vy += noise2D(this.nx,     this.ny + t  ) * 0.06;

    // Gentle drag so velocity stays believable
    this.vx *= 0.975;
    this.vy *= 0.982;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    if (this.dead) return;
    const progress = this.age / this.lifetime;
    const radius   = this.maxRadius * Math.pow(progress, 0.6);
    if (radius < 0.5) return;

    // Opacity arc: rises then falls; never chalky
    const alpha = Math.sin(Math.PI * progress) * 0.18;
    if (alpha < 0.004) return;

    ctx.save();
    ctx.filter = 'blur(6px)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${alpha.toFixed(3)})`;
    ctx.fill();
    ctx.restore();
  }
}

// ─── Engine ───────────────────────────────────────────────────────────────────
function initSmoke() {
  const isMobile   = 'ontouchstart' in window;
  const MAX_POOL   = isMobile ? 250 : 400;

  // Pre-allocate the entire pool
  const pool       = Array.from({ length: MAX_POOL }, () => new Particle());
  let   recycleIdx = 0; // ring pointer for oldest-first recycling

  // Canvas
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:9999;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  // ── Emission ────────────────────────────────────────────────────────────────
  function emit(x, y, count) {
    for (let i = 0; i < count; i++) {
      // Prefer a slot that's already dead
      let slot = null;
      for (let attempt = 0; attempt < 8; attempt++) {
        const candidate = pool[(recycleIdx + attempt) % MAX_POOL];
        if (candidate.dead) { slot = candidate; recycleIdx = (recycleIdx + attempt + 1) % MAX_POOL; break; }
      }
      // Fall back to oldest via ring pointer
      if (!slot) {
        slot = pool[recycleIdx];
        recycleIdx = (recycleIdx + 1) % MAX_POOL;
      }
      slot.reset(x, y);
    }
  }

  // ── Mouse ───────────────────────────────────────────────────────────────────
  let lastMx = -999, lastMy = -999;
  window.addEventListener('mousemove', (e) => {
    const dx    = e.clientX - lastMx;
    const dy    = e.clientY - lastMy;
    const speed = Math.sqrt(dx * dx + dy * dy);
    const count = speed < 2
      ? (Math.random() < 0.25 ? 1 : 0)
      : ((3 + Math.random() * 2) | 0);
    if (count) emit(e.clientX, e.clientY, count);
    lastMx = e.clientX;
    lastMy = e.clientY;
  });

  // ── Touch ───────────────────────────────────────────────────────────────────
  const lastTouchPos = {};

  window.addEventListener('touchstart', (e) => {
    for (const t of e.touches) {
      emit(t.clientX, t.clientY, (4 + Math.random() * 2) | 0);
      lastTouchPos[t.identifier] = { x: t.clientX, y: t.clientY };
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    for (const t of e.touches) {
      emit(t.clientX, t.clientY, (4 + Math.random() * 2) | 0);
      lastTouchPos[t.identifier] = { x: t.clientX, y: t.clientY };
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    for (const t of e.changedTouches) {
      const pos = lastTouchPos[t.identifier];
      if (pos) {
        emit(pos.x, pos.y, (8 + Math.random() * 4) | 0);
        delete lastTouchPos[t.identifier];
      }
    }
  }, { passive: true });

  // ── Render loop ─────────────────────────────────────────────────────────────
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pool) {
      p.update();
      p.draw(ctx);
    }
    requestAnimationFrame(loop);
  }
  loop();
}

// Boot after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmoke);
} else {
  initSmoke();
}
