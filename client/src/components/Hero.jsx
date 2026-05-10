import { useEffect, useRef } from 'react'

export default function Hero({ onSelectPersona }) {
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const scrollY = window.scrollY
      const parallax = heroRef.current.querySelector('.hero-parallax')
      if (parallax) {
        parallax.style.transform = `translateY(${scrollY * 0.25}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToBooking = (e) => {
    e.preventDefault()
    // Default to the catering persona when the user takes the primary path
    onSelectPersona?.('catering')
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToOven = (e) => {
    e.preventDefault()
    // Switch to the Ovens persona before scrolling — the Oven section only
    // renders inside that persona panel. Two RAFs is the cheap way to be
    // certain React has committed the panel swap before we try to land on
    // the new node.
    onSelectPersona?.('ovens')
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelector('#oven')?.scrollIntoView({ behavior: 'smooth' })
    }))
  }

  return (
    <section
      ref={heroRef}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'var(--stage)',
      }}
    >
      {/* Background radial glow — anchored right where the logo sits */}
      <div className="hero-parallax" style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 70% 80% at 75% 55%, rgba(201, 75, 26, 0.14) 0%, transparent 55%),
          radial-gradient(ellipse 50% 60% at 80% 80%, rgba(232, 98, 42, 0.09) 0%, transparent 50%),
          radial-gradient(ellipse 100% 100% at 50% 50%, #0F0D0B 35%, #1A1714 100%)
        `,
        zIndex: 0,
      }} />

      {/* Grain texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Bottom fade */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '200px',
        background: 'linear-gradient(to bottom, transparent, var(--smoke))',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* Two-column layout. On md (≥860px) the copy and logo render side
          by side; below, the logo moves above the copy (CSS `order`). */}
      <div
        className="relative z-[3] w-full mx-auto max-w-page grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center px-5 xs:px-6 md:px-12 pt-[90px] xs:pt-[100px] md:pt-[120px] pb-[60px] xs:pb-[80px] md:pb-[100px]"
      >

        {/* LEFT — copy */}
        <div>
          {/* Now-booking + qualification line — folded into the Hero so the
              regional service-area buyer's #1 question ("do you serve my
              area?") is answerable without scrolling. Replaces the old
              standalone PhaseBanner strip. */}
          <div
            className="hero-qualifier"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px',
              flexWrap: 'wrap',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--gold)',
                animation: 'pulseDot 2.5s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            <span
              className="eyebrow"
              style={{
                color: 'var(--gold)',
                opacity: 1,
                whiteSpace: 'nowrap',
              }}
            >
              Now Booking
            </span>
            <span aria-hidden="true" style={{ color: 'var(--char)', fontSize: '12px' }}>·</span>
            <span
              className="eyebrow"
              style={{ opacity: 0.85, color: 'var(--bone)' }}
            >
              Coachella Valley + South Bay LA
            </span>
          </div>

          {/* Occasion qualifier */}
          <div className="eyebrow" style={{ marginBottom: '32px', opacity: 0.6 }}>
            Block Parties · Graduations · Small Weddings
          </div>

          {/* Headline. Two-stage responsive sizing replaces the previous
              three layered @media-overridden clamps:
                <md (mobile/tablet) : clamp(2.4rem, 10vw, 4rem)
                ≥md (desktop)       : clamp(2.8rem, 5.5vw, 6.5rem)
              At 320px → 38.4px; at 414px → 41.4px; at 860px+ → up to 6.5rem.
              Matches the legacy rhythm without the @media block. */}
          <h1
            className="text-[clamp(2.4rem,10vw,4rem)] md:text-[clamp(2.8rem,5.5vw,6.5rem)]"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 900,
              lineHeight: 1.0,
              color: 'var(--cream)',
              marginBottom: '40px',
              letterSpacing: '-1px',
            }}
          >
            Your Event.{' '}
            <em style={{ color: 'var(--ember-glow)', fontStyle: 'italic' }}>Real Fire.</em>
          </h1>

          {/* Subhead */}
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 300,
            fontSize: 'clamp(1.05rem, 1.6vw, 1.3rem)',
            color: 'var(--bone)',
            lineHeight: 1.75,
            marginBottom: '52px',
            letterSpacing: '0.3px',
            maxWidth: '480px',
          }}>
            The fire starts two hours before the first guest arrives. Olive wood and hickory, laid by hand, coaxed to temperature the slow way — the way our family has done it since 1933. By the time the smoke reaches the street, something primal has already happened. The meal hasn't even begun.
          </p>

          {/* CTAs. Locked at 14px/700 so .btn-primary cream-on-ember
              (4.07:1) clears WCAG large-text 3:1. */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="#booking"
              onClick={scrollToBooking}
              className="btn btn-primary"
              style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '2px', padding: '16px 36px' }}
            >
              Book Your Event
            </a>
            <a
              href="#oven"
              onClick={scrollToOven}
              className="btn btn-ghost"
              style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '2px', padding: '16px 36px' }}
            >
              Commission an Oven →
            </a>
          </div>

          {/* On the fire strip. "Burning tonight" was 9px ember-on-stage at
              4.16:1 — fails small-text AA. Bumped to 11px and shifted to
              ember-glow which clears comfortably (~5.5:1 on stage). */}
          <div style={{
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid var(--char)',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '3px',
              color: 'var(--ember-glow)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '12px',
            }}>
              Burning tonight
            </span>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 20px',
              alignItems: 'center',
            }}>
              {[
                'Pitmaster\'s Pride',
                'Nonna\'s Ransom',
                'Holy Smoke',
                'Feather & Flame',
                'Campfire Caruso',
              ].map((dish, i, arr) => (
                <span key={dish} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1rem',
                    fontStyle: 'italic',
                    color: 'var(--bone)',
                    opacity: 0.75,
                    letterSpacing: '0.2px',
                  }}>
                    {dish}
                  </span>
                  {i < arr.length - 1 && (
                    /* Decorative separator — aria-hidden so axe stops scoring
                       its decorative low-contrast as a content failure. */
                    <span aria-hidden="true" style={{ color: 'var(--char)', fontSize: '10px', opacity: 0.6 }}>·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — logo. Below md it moves above the copy via order:-1. */}
        <div className="relative flex flex-col items-center justify-center order-first md:order-none">
          {/* Ember bloom behind the logo */}
          <div style={{
            position: 'absolute',
            inset: '-10%',
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(201, 75, 26, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          <img
            src="/images/jabroni-logo-transparent.png"
            alt="Jabroni's Wood Fired"
            className="block relative z-[1] w-full max-w-[260px] md:max-w-[480px] h-auto"
          />

        </div>

      </div>
    </section>
  )
}
