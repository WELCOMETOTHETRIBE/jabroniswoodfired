import { useState } from 'react'

/**
 * TypoSlot — editorial typographic composition for image slots that don't
 * yet have real photography (per research brief, Section 11 — photography
 * is months away, so we lean into the typography-and-darkness aesthetic
 * instead of shipping "photo coming soon" placeholders).
 *
 * Three distinct variants, each suited to one of the three Oven gallery
 * slots. The variation IS the visual interest — we never want all three
 * slots to read as the same composition stamped three times.
 *
 * Variants:
 *   - "temperature" — Stacked metadata column (kicker / oversized Bebas
 *     numeral with degree superscript / italic Cormorant descriptor),
 *     backed by a horizontal-band brick texture SVG and a bottom-right
 *     ember bloom. Suits the wide hero slot.
 *   - "hearth" — Nested concentric arc segments evoking a brick dome
 *     cross-section (char/ash/ember bands), with a centered metadata
 *     stack (kicker / oversized dome-diameter Bebas numeral / mono spec
 *     caption). Suits a square tile.
 *   - "lineage" — Italic Cormorant pull quote layered over a hand-drawn
 *     line-art oven cross-section (dome / hearth floor / flame curl /
 *     smoke plume), with a mono `EST. YYYY` caption beneath. Suits a
 *     square tile that needs to feel like editorial copy, not a stat.
 *
 * Photo opt-in: pass `imageSrc` (and `imageAlt`). If the image loads, the
 * typographic composition is hidden via the same onLoad/onError trick the
 * legacy ImageSlot used. Swapping back to real imagery is a one-prop change
 * for each slot.
 *
 * Motion: no looping animations. The single hover transition (subtle
 * brighten + 1px lift) inherits from the global
 * `@media (prefers-reduced-motion: reduce)` block in `index.css` so reduced-
 * motion users get a static slot.
 *
 * Tokens: uses ONLY the existing brand palette (--ember, --ember-glow,
 * --char, --ash, --bone, --gold, --cream, --curtain, --muted). No new
 * tokens, no new fonts, no new dependencies.
 */
export default function TypoSlot({
  variant = 'temperature',
  kicker,
  numeral,
  suffix,
  descriptor,
  caption,
  quote,
  estYear,
  imageSrc,
  imageAlt,
  style = {},
}) {
  const [hovered, setHovered] = useState(false)
  const accessibleName =
    imageAlt ||
    [kicker, numeral && (suffix ? `${numeral}${suffix}` : numeral), descriptor || caption || quote]
      .filter(Boolean)
      .join(' · ') ||
    'Wood-fired oven detail'

  return (
    <div
      role="img"
      aria-label={accessibleName}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--curtain)',
        border: '1px solid var(--char)',
        transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 32px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(232, 98, 42, 0.12)'
          : '0 0 0 0 rgba(0,0,0,0)',
        borderColor: hovered ? 'var(--ember-deep)' : 'var(--char)',
        ...style,
      }}
    >
      {/* Real-photo opt-in. If `imageSrc` is supplied AND the image loads,
          the composition next to it is hidden. If the image errors, it
          hides itself and the composition stays visible. Drop-in. */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            position: 'relative',
            zIndex: 2,
          }}
          onLoad={(e) => {
            const sibling = e.target.nextSibling
            if (sibling) sibling.style.display = 'none'
          }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}

      {/* Typographic composition layer. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'var(--curtain)',
        }}
      >
        {variant === 'temperature' && (
          <TemperatureComposition
            kicker={kicker}
            numeral={numeral}
            suffix={suffix}
            descriptor={descriptor}
            caption={caption}
            hovered={hovered}
          />
        )}
        {variant === 'hearth' && (
          <HearthComposition
            kicker={kicker}
            numeral={numeral}
            suffix={suffix}
            caption={caption}
            hovered={hovered}
          />
        )}
        {variant === 'lineage' && (
          <LineageComposition
            quote={quote}
            estYear={estYear}
            caption={caption}
            hovered={hovered}
          />
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------
 * Variant 1 — TEMPERATURE
 * Horizontal brick courses + ember bloom + stacked metadata column.
 * Reads as: a thermal readout from the mouth of the oven.
 * ------------------------------------------------------------------------- */
function TemperatureComposition({ kicker, numeral, suffix, descriptor, caption, hovered }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 28px',
    }}>
      {/* Brick-courses background SVG. Five offset rows, var(--char) seams,
          subtle var(--ash) fill. Decorative — aria-hidden via the parent. */}
      <svg
        viewBox="0 0 600 320"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.35,
        }}
      >
        <defs>
          <linearGradient id="brick-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ash)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--curtain)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="600" height="320" fill="url(#brick-fade)" />
        {/* Five courses of brick at 64px tall, alternating offsets. */}
        {[0, 64, 128, 192, 256].map((y, row) => {
          const offset = row % 2 === 0 ? 0 : 60
          const bricks = []
          for (let x = -offset; x < 700; x += 120) {
            bricks.push(
              <rect
                key={`${y}-${x}`}
                x={x}
                y={y}
                width={118}
                height={62}
                fill="none"
                stroke="var(--char)"
                strokeWidth="1"
              />
            )
          }
          return <g key={y}>{bricks}</g>
        })}
      </svg>

      {/* Ember bloom — bottom right, the heart of the fire. */}
      <div style={{
        position: 'absolute',
        right: '-10%',
        bottom: '-25%',
        width: '70%',
        height: '90%',
        background: 'radial-gradient(circle at 50% 50%, rgba(232, 98, 42, 0.28) 0%, rgba(201, 75, 26, 0.08) 35%, transparent 70%)',
        pointerEvents: 'none',
        transition: 'opacity 0.4s ease',
        opacity: hovered ? 1 : 0.85,
      }} />

      {/* Top-left kicker */}
      {kicker && (
        <div style={{
          position: 'relative',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '3px',
          color: 'var(--gold)',
          textTransform: 'uppercase',
          opacity: 0.9,
        }}>
          {kicker}
        </div>
      )}

      {/* Bottom-left stacked numeral + descriptor */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {numeral && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            lineHeight: 0.9,
          }}>
            <span style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(4rem, 13vw, 7rem)',
              letterSpacing: '2px',
              color: 'var(--ember-glow)',
              lineHeight: 0.9,
            }}>
              {numeral}
            </span>
            {suffix && (
              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                letterSpacing: '1px',
                color: 'var(--ember-glow)',
                lineHeight: 1,
                marginTop: '6px',
                marginLeft: '4px',
              }}>
                {suffix}
              </span>
            )}
          </div>
        )}
        {descriptor && (
          <div style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1rem',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'var(--bone)',
            letterSpacing: '0.3px',
            lineHeight: 1.4,
            maxWidth: '70%',
          }}>
            {descriptor}
          </div>
        )}
        {caption && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '2.5px',
            color: 'var(--bone)',
            textTransform: 'uppercase',
            opacity: 0.7,
            marginTop: '4px',
          }}>
            {caption}
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------
 * Variant 2 — HEARTH
 * Concentric brick fan / dome cross-section with a centered numeral.
 * Reads as: a top-down or front-on view of a hand-laid firebrick dome.
 * ------------------------------------------------------------------------- */
function HearthComposition({ kicker, numeral, suffix, caption, hovered }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Concentric brick-fan SVG — five nested arc bands, alternating
          --char / --ash, with subtle ember accents on the inner ring. */}
      <svg
        viewBox="-100 -10 200 110"
        preserveAspectRatio="xMidYMax meet"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          width: '180%',
          height: '180%',
          transform: 'translateX(-50%)',
          opacity: 0.7,
        }}
      >
        {/* Outer ring (largest) — char band with 9 segments. */}
        <BrickArc radius={100} thickness={14} segments={9} stroke="var(--char)" fill="rgba(45, 41, 37, 0.45)" />
        {/* Mid ring — ash band with 11 segments. */}
        <BrickArc radius={82} thickness={12} segments={11} stroke="var(--char)" fill="rgba(61, 53, 48, 0.55)" />
        {/* Inner-mid — char band, 13 segments. */}
        <BrickArc radius={66} thickness={10} segments={13} stroke="var(--char)" fill="rgba(45, 41, 37, 0.7)" />
        {/* Inner ring — ember-deep, 15 segments — the live coals. */}
        <BrickArc
          radius={52}
          thickness={9}
          segments={15}
          stroke="var(--ember-deep)"
          fill="rgba(122, 39, 16, 0.55)"
        />
        {/* Hearth floor line. */}
        <line x1="-100" y1="0" x2="100" y2="0" stroke="var(--char)" strokeWidth="0.8" />
        {/* Subtle ember glow at the base. */}
        <ellipse
          cx="0"
          cy="0"
          rx="40"
          ry="6"
          fill="var(--ember-glow)"
          opacity={hovered ? 0.35 : 0.22}
          style={{ transition: 'opacity 0.4s ease' }}
        />
      </svg>

      {/* Centered metadata column */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        textAlign: 'center',
        marginTop: '-10%',
      }}>
        {kicker && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '3px',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            opacity: 0.95,
          }}>
            {kicker}
          </div>
        )}
        {numeral && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', lineHeight: 0.9 }}>
            <span style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(3.6rem, 11vw, 5.2rem)',
              letterSpacing: '2px',
              color: 'var(--cream)',
              lineHeight: 0.9,
            }}>
              {numeral}
            </span>
            {suffix && (
              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
                letterSpacing: '1px',
                color: 'var(--ember-glow)',
                lineHeight: 1,
              }}>
                {suffix}
              </span>
            )}
          </div>
        )}
        {caption && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '2.5px',
            color: 'var(--bone)',
            textTransform: 'uppercase',
            opacity: 0.75,
            maxWidth: '88%',
            lineHeight: 1.5,
          }}>
            {caption}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * BrickArc — a 180° arc of N rectangular brick segments, drawn at a fixed
 * outer `radius` with `thickness` toward the center. Hand-rolled (we don't
 * pull in d3 or any path library).
 */
function BrickArc({ radius, thickness, segments, stroke, fill }) {
  const outer = radius
  const inner = radius - thickness
  const paths = []
  for (let i = 0; i < segments; i++) {
    const a0 = Math.PI * (i / segments)
    const a1 = Math.PI * ((i + 1) / segments)
    // SVG y-axis inverted, so we flip sin so the arc opens upward (dome shape).
    const x0 = -Math.cos(a0) * outer
    const y0 = -Math.sin(a0) * outer
    const x1 = -Math.cos(a1) * outer
    const y1 = -Math.sin(a1) * outer
    const x2 = -Math.cos(a1) * inner
    const y2 = -Math.sin(a1) * inner
    const x3 = -Math.cos(a0) * inner
    const y3 = -Math.sin(a0) * inner
    paths.push(
      <path
        key={i}
        d={`M ${x0} ${y0} A ${outer} ${outer} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${inner} ${inner} 0 0 0 ${x3} ${y3} Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="0.6"
      />
    )
  }
  return <g>{paths}</g>
}

/* -------------------------------------------------------------------------
 * Variant 3 — LINEAGE
 * Hand-drawn oven cross-section line art + italic pull quote + EST. YYYY.
 * Reads as: editorial copy from a hardcover monograph, not a spec card.
 * ------------------------------------------------------------------------- */
function LineageComposition({ quote, estYear, caption, hovered }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '22px 24px',
    }}>
      {/* Hand-drawn cross-section line art SVG. Dome + hearth floor +
          flame curl + smoke plume + a thin chimney line. Single stroke,
          var(--ember) at low opacity so it reads as a sketch, not chrome. */}
      <svg
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.32,
        }}
      >
        {/* Hearth floor */}
        <line x1="35" y1="135" x2="165" y2="135" stroke="var(--ember)" strokeWidth="1" strokeLinecap="round" />
        {/* Dome arch */}
        <path
          d="M 35 135 Q 35 70 100 60 Q 165 70 165 135"
          fill="none"
          stroke="var(--ember)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Inner dome — implies the firebrick layer */}
        <path
          d="M 50 132 Q 50 80 100 72 Q 150 80 150 132"
          fill="none"
          stroke="var(--ember)"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Mouth opening — a small arch carved out of the front */}
        <path
          d="M 80 135 Q 80 118 100 116 Q 120 118 120 135"
          fill="var(--curtain)"
          stroke="var(--ember)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* Flame curl inside the mouth — three quick brushstrokes */}
        <path
          d="M 95 130 Q 92 122 96 118 Q 99 122 96 128"
          fill="none"
          stroke="var(--ember-glow)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity={hovered ? 0.95 : 0.75}
          style={{ transition: 'opacity 0.4s ease' }}
        />
        <path
          d="M 102 130 Q 100 124 103 120 Q 106 124 104 130"
          fill="none"
          stroke="var(--ember-glow)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity={hovered ? 0.85 : 0.6}
          style={{ transition: 'opacity 0.4s ease' }}
        />
        <path
          d="M 108 130 Q 106 124 109 120 Q 112 125 110 129"
          fill="none"
          stroke="var(--ember-glow)"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity={hovered ? 0.7 : 0.45}
          style={{ transition: 'opacity 0.4s ease' }}
        />
        {/* Smoke plume rising — three offset curls. */}
        <path
          d="M 100 56 Q 96 44 102 36 Q 108 28 102 18"
          fill="none"
          stroke="var(--bone)"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M 108 54 Q 112 44 108 34 Q 104 26 110 16"
          fill="none"
          stroke="var(--bone)"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M 94 56 Q 90 46 94 36 Q 98 26 92 14"
          fill="none"
          stroke="var(--bone)"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.25"
        />
        {/* Hearth ground line beneath — a couple of stones */}
        <line x1="20" y1="148" x2="180" y2="148" stroke="var(--char)" strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />
        <line x1="30" y1="158" x2="170" y2="158" stroke="var(--char)" strokeWidth="0.5" strokeLinecap="round" opacity="0.4" />
      </svg>

      {/* Top-left — small mono mark, decorative anchor */}
      <div style={{
        position: 'relative',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        letterSpacing: '3px',
        color: 'var(--gold)',
        textTransform: 'uppercase',
        opacity: 0.85,
      }}>
        Lineage
      </div>

      {/* Bottom — italic pull quote + EST. YYYY caption */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {quote && (
          <blockquote style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1.05rem, 3.4vw, 1.4rem)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'var(--cream)',
            lineHeight: 1.25,
            letterSpacing: '0.2px',
            margin: 0,
            borderLeft: '2px solid var(--ember)',
            paddingLeft: '12px',
          }}>
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '2.5px',
          color: 'var(--bone)',
          textTransform: 'uppercase',
          opacity: 0.75,
        }}>
          {estYear && <span>Est. {estYear}</span>}
          {estYear && caption && <span aria-hidden="true" style={{ color: 'var(--char)' }}>·</span>}
          {caption && <span>{caption}</span>}
        </div>
      </div>
    </div>
  )
}
