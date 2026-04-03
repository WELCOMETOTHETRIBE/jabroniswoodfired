// ─── Jabroni's Wood Fired — Ember & Heat Background ──────────────────────────
// Fixed canvas at z-index:-1. Two passes: heat pools then ember particles.
// Persistence trail: no clearRect — semi-transparent black fill each frame.

// ─── Perlin Noise (independent permutation from smoke.js) ────────────────────
const _eP = new Uint8Array(512);
const _eG = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
(function() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const t = p[i]; p[i] = p[j]; p[j] = t;
  }
  for (let i = 0; i < 512; i++) _eP[i] = p[i & 255];
})();
function _eFade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function _eLerp(a, b, t) { return a + t * (b - a); }
function eNoise(x, y) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x), yf = y - Math.floor(y);
  const u = _eFade(xf), v = _eFade(yf);
  const a = _eP[X] + Y, b = _eP[X + 1] + Y;
  const g = (idx) => _eG[_eP[idx] & 7];
  return _eLerp(
    _eLerp(g(a)[0]*xf     + g(a)[1]*yf,     g(b)[0]*(xf-1) + g(b)[1]*yf,     u),
    _eLerp(g(a+1)[0]*xf   + g(a+1)[1]*(yf-1), g(b+1)[0]*(xf-1) + g(b+1)[1]*(yf-1), u),
    v
  );
}

// ─── HeatPool ────────────────────────────────────────────────────────────────
class HeatPool {
  constructor(xFrac, yFrac, canvasW, canvasH) {
    this.xFrac  = xFrac;
    this.yFrac  = yFrac;
    this.radius = 80 + Math.random() * 100;       // 80–180px
    this.speed  = 0.0003 + Math.random() * 0.0005; // very slow breath
    this.phase  = Math.random() * Math.PI * 2;
  }

  draw(ctx, time, W, H) {
    const x = this.xFrac * W;
    const y = this.yFrac * H;
    const intensity   = 0.5 + 0.5 * Math.sin(time * this.speed + this.phase);
    const centerAlpha = 0.03 + intensity * 0.06; // 0.03–0.09
    const midAlpha    = centerAlpha * 0.45;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, this.radius);
    grad.addColorStop(0,   `rgba(255,90,10,${centerAlpha.toFixed(4)})`);
    grad.addColorStop(0.5, `rgba(200,50,0,${midAlpha.toFixed(4)})`);
    grad.addColorStop(1,   'rgba(0,0,0,0)');

    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

// ─── EmberParticle ────────────────────────────────────────────────────────────
const COAL_COLORS = ['255,100,20', '255,60,0', '200,80,10'];

class EmberParticle {
  constructor() {
    this.state = 'coal';
    this._pools = null; // set by engine before first use
  }

  spawnCoal(heatPools, W, H, x, y) {
    if (x !== undefined) {
      this.x = x;
      this.y = y;
    } else {
      // Cluster near a random heat pool, clamped to bottom 40% of canvas
      const pool  = heatPools[(Math.random() * heatPools.length) | 0];
      const angle = Math.random() * Math.PI * 2;
      const dist  = Math.random() * 120;
      this.x = Math.max(0, Math.min(W, pool.xFrac * W + Math.cos(angle) * dist));
      this.y = Math.max(H * 0.6, Math.min(H, pool.yFrac * H + Math.sin(angle) * dist));
    }
    this.vx         = (Math.random() - 0.5) * 0.05;
    this.vy         = (Math.random() - 0.5) * 0.05;
    this.radius     = 1.5 + Math.random() * 2;       // 1.5–3.5px
    this.color      = COAL_COLORS[(Math.random() * 3) | 0];
    this.pulseSpeed = 0.001 + Math.random() * 0.003;
    this.phase      = Math.random() * Math.PI * 2;
    this.state      = 'coal';
  }

  transitionToSpark() {
    this.state       = 'spark';
    this.birthRadius = this.radius;
    this.vy          = -(0.3 + Math.random() * 0.8);
    this.vx          = (Math.random() - 0.5) * 0.4;
    this.age         = 0;
    this.lifetime    = 120 + Math.random() * 80;      // 120–200 frames
    this.nx          = Math.random() * 300;            // noise seed
  }

  update(time, dt, heatPools, W, H) {
    if (this.state === 'coal') {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      // random loft — weighted by dt for framerate independence
      if (Math.random() < 0.002 * dt) this.transitionToSpark();
    } else {
      this.age += dt;
      if (this.age >= this.lifetime) {
        // return to coal if still low enough, else respawn near a pool
        if (this.y > H * 0.6) {
          this.spawnCoal(heatPools, W, H, this.x, this.y);
        } else {
          this.spawnCoal(heatPools, W, H);
        }
        return;
      }
      // noise turbulence on horizontal axis
      const t = this.age * 0.022;
      this.vx += eNoise(this.nx + t, this.nx * 0.5) * 0.05 * dt;
      this.vx *= Math.pow(0.97, dt);
      // upward motion with minimal drag
      this.vy *= Math.pow(0.998, dt);
      this.x  += this.vx * dt;
      this.y  += this.vy * dt;
    }
  }

  draw(ctx, time) {
    if (this.state === 'coal') {
      const alpha = 0.4 + 0.5 * Math.sin(time * this.pulseSpeed + this.phase);
      ctx.shadowBlur  = 12;
      ctx.shadowColor = `rgba(${this.color},1)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${alpha.toFixed(3)})`;
      ctx.fill();
    } else {
      const t      = this.age / this.lifetime;
      const radius = Math.max(0.15, this.birthRadius * (1 - t) * 0.9);
      const alpha  = (1 - t) * 0.9;
      if (alpha < 0.01) return;

      // Cool from orange-white → dark ember as spark rises
      const r = Math.round(255 + (80  - 255) * t);
      const g = Math.round(130 + (40  - 130) * t);
      const b = Math.round(30  + (20  - 30)  * t);

      ctx.shadowBlur  = 18 * (1 - t) + 4 * t;
      ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
      ctx.fill();
    }
  }
}

// ─── Engine ───────────────────────────────────────────────────────────────────
function initEmber() {
  const isMobile    = 'ontouchstart' in window;
  const POOL_COUNT  = isMobile ? 5  : (6 + Math.random() * 4 | 0);  // 6–10
  const EMBER_COUNT = isMobile ? 50 : (80 + Math.random() * 40 | 0); // 80–120

  // ── Canvas ──────────────────────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:-1;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  // ── Vignette div ────────────────────────────────────────────────────────────
  const vignette = document.createElement('div');
  vignette.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'width:100%', 'height:100%',
    'z-index:0', 'pointer-events:none',
    'background:radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
  ].join(';');
  document.body.insertBefore(vignette, document.body.firstChild);

  let W = 0, H = 0;
  let heatPools = [];
  let embers    = [];

  // ── Build scene ─────────────────────────────────────────────────────────────
  function buildScene(w, h) {
    W = w; H = h;
    canvas.width  = W;
    canvas.height = H;

    // Heat pools — weighted vertical distribution
    heatPools = [];
    for (let i = 0; i < POOL_COUNT; i++) {
      const r = Math.random();
      let yFrac;
      if (r < 0.70)      yFrac = 0.667 + Math.random() * 0.333; // bottom third
      else if (r < 0.90) yFrac = 0.333 + Math.random() * 0.334; // middle third
      else               yFrac = Math.random() * 0.333;           // top
      const xFrac = 0.05 + Math.random() * 0.90;                  // avoid hard edges
      heatPools.push(new HeatPool(xFrac, yFrac, W, H));
    }

    // Ember particles
    embers = [];
    for (let i = 0; i < EMBER_COUNT; i++) {
      const e = new EmberParticle();
      // 70% coals, 30% already lofted at random age to avoid all sparking at once
      if (Math.random() < 0.70) {
        e.spawnCoal(heatPools, W, H);
      } else {
        e.spawnCoal(heatPools, W, H);
        e.transitionToSpark();
        e.age = Math.random() * e.lifetime; // stagger
      }
      embers.push(e);
    }
  }

  buildScene(window.innerWidth, window.innerHeight);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => buildScene(window.innerWidth, window.innerHeight), 150);
  });

  // ── Render loop ──────────────────────────────────────────────────────────────
  let lastTime = performance.now();

  function loop(now) {
    const rawDt = now - lastTime;
    lastTime = now;
    // Normalize to 60fps (1.0 = one 60fps frame). Cap at 3× to absorb tab-focus spikes.
    const dt   = Math.min(rawDt / 16.667, 3);
    const time = now; // ms — used for sin-based pulses

    // Persistence: framerate-independent semi-transparent overlay
    // alpha = 1 - (1 - 0.18)^dt so fade is identical per-second at any fps
    const fadeAlpha = 1 - Math.pow(0.82, dt);
    ctx.fillStyle = `rgba(0,0,0,${fadeAlpha.toFixed(4)})`;
    ctx.fillRect(0, 0, W, H);

    // ── Pass 1: heat pools ───────────────────────────────────────────────────
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; // additive: pools stack warmly
    for (const pool of heatPools) pool.draw(ctx, time, W, H);
    ctx.restore();

    // ── Pass 2: embers ───────────────────────────────────────────────────────
    ctx.save();
    // Update all particles
    for (const e of embers) e.update(time, dt, heatPools, W, H);

    // Draw coals first (batch shadowBlur = 12)
    ctx.shadowBlur = 12;
    for (const e of embers) {
      if (e.state === 'coal') e.draw(ctx, time);
    }
    // Reset shadow before sparks (each sets its own)
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    for (const e of embers) {
      if (e.state === 'spark') e.draw(ctx, time);
    }
    // Clean up shadow state
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.restore();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEmber);
} else {
  initEmber();
}
