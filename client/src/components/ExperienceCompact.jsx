import { useEffect, useRef } from 'react'
import { JabroniIcon } from './JabroniSVG'

/**
 * ExperienceCompact — single-screen teaser variant of "A Jabroni's Evening".
 *
 * Background: per the research brief, The Evening is aspirational — not
 * bookable. It used to absorb most of a viewport with a 5-card cast grid,
 * 5 paragraphs of prose, a 3-cell pricing block, and dual CTAs. Inside
 * the Evening persona tab we replace that with a one-screen teaser:
 * curtain decoration, headline + tagline, "in development" notice,
 * compact cast-name list (no tooltips), and a single Express Interest CTA.
 *
 * The full long-form Experience component remains in the codebase for the
 * "View everything" long-scroll fallback.
 */

const CAST_NAMES = [
  'Femme Fatale',
  'Consigliere',
  'Pit Boss',
  'Racketeer',
  'Chanteuse',
]

export default function ExperienceCompact({ onExpressInterest }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
        }
      }),
      { threshold: 0.1 }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleClick = (e) => {
    e.preventDefault()
    onExpressInterest?.()
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        background: 'var(--stage)',
        borderTop: '2px solid var(--ember)',
        borderBottom: '2px solid var(--ember)',
        position: 'relative',
        overflow: 'hidden',
        padding: '96px 0',
      }}
    >
      {/* Compressed curtain — kept the visual register, halved the size */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, bottom: 0, width: '60px',
        background: 'linear-gradient(to right, var(--curtain), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0, width: '60px',
        background: 'linear-gradient(to left, var(--curtain), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Smaller ambient glow — the Evening tab is no longer the page's
          decorative climax, just one of three intent panes. */}
      <div style={{
        position: 'absolute',
        top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '480px', height: '480px',
        background: 'radial-gradient(circle, rgba(201, 75, 26, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: '880px', margin: '0 auto',
        padding: '0 32px', textAlign: 'center',
      }}>
        {/* Fire-rule kicker */}
        <div className="fire-rule reveal" style={{ marginBottom: '40px', justifyContent: 'center' }}>
          <span>Coming Soon</span>
          <JabroniIcon style={{ width: '24px', height: '24px', color: 'var(--ember)', flexShrink: 0 }} />
          <span>A Look Ahead</span>
        </div>

        {/* Eyebrow */}
        <div className="reveal reveal-delay-1" style={{ marginBottom: '14px' }}>
          <span className="eyebrow">In Development · Aspirational</span>
        </div>

        {/* Headline */}
        <h2
          className="reveal reveal-delay-2"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 900,
            fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
            color: 'var(--cream)',
            marginBottom: '16px',
            lineHeight: 1.05,
            letterSpacing: '-0.5px',
          }}
        >
          A Jabroni's{' '}
          <em style={{ color: 'var(--ember-glow)', fontStyle: 'italic' }}>Evening</em>
        </h2>

        <p
          className="reveal reveal-delay-3"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
            fontWeight: 300,
            color: 'var(--gold-light)',
            marginBottom: '28px',
            letterSpacing: '0.5px',
            fontStyle: 'italic',
          }}
        >
          This is not dinner and a show. This is dinner as the show.
        </p>

        {/* In-development notice */}
        <div
          className="reveal reveal-delay-3"
          style={{
            display: 'inline-block',
            marginBottom: '40px',
            padding: '10px 22px',
            border: '1px solid var(--char)',
            background: 'rgba(201, 75, 26, 0.05)',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '2px',
            color: 'var(--bone)',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            In development — catering &amp; ovens are bookable today
          </p>
        </div>

        {/* Compact cast list — names only, italic, with bullet separators.
            The full per-character definitions live in the long-form
            Experience component, surfaced via "View the full story". */}
        <div
          className="reveal reveal-delay-4"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px 18px',
            marginBottom: '40px',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '3px',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            alignSelf: 'center',
          }}>
            The Cast —
          </span>
          {CAST_NAMES.map((name, i) => (
            <span
              key={name}
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                color: 'var(--bone)',
                opacity: 0.85,
                letterSpacing: '0.2px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '18px',
              }}
            >
              {name}
              {i < CAST_NAMES.length - 1 && (
                <span aria-hidden="true" style={{ color: 'var(--char)', fontSize: '12px' }}>·</span>
              )}
            </span>
          ))}
        </div>

        {/* Single primary CTA. 14px/700 to clear large-text 3:1 contrast
            for cream-on-ember (4.07:1). */}
        <div className="reveal reveal-delay-4">
          <a
            href="#booking"
            onClick={handleClick}
            className="btn btn-primary"
            style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '2px', padding: '16px 32px' }}
          >
            Express Interest →
          </a>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--muted)',
            letterSpacing: '1.5px',
            marginTop: '14px',
            textTransform: 'uppercase',
          }}>
            We'll reach out as the concept comes together.
          </p>
        </div>
      </div>
    </section>
  )
}
