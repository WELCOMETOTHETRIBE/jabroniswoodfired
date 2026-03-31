import { useEffect, useRef } from 'react'

export default function Hero() {
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
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToExperience = (e) => {
    e.preventDefault()
    document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' })
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

      {/* Two-column layout */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '120px 48px 100px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '64px',
        alignItems: 'center',
      }}>

        {/* LEFT — copy */}
        <div>
          {/* Eyebrow */}
          <div className="eyebrow" style={{ marginBottom: '32px', opacity: 0.8 }}>
            Live-Fire Catering · Wood-Fired Ovens · Performance Dining
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 900,
            fontSize: 'clamp(2.8rem, 5.5vw, 6.5rem)',
            lineHeight: 1.0,
            color: 'var(--cream)',
            marginBottom: '40px',
            letterSpacing: '-1px',
          }}>
            No Gas.{' '}
            <em style={{ color: 'var(--ember-glow)', fontStyle: 'italic' }}>No Gimmicks.</em>
            {' '}Just Fire.
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
            Premium live-fire catering, wood-fired oven manufacturing, and immersive performance dining — hand-built in Southern California.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="#booking"
              onClick={scrollToBooking}
              className="btn btn-primary"
              style={{ fontSize: '13px', letterSpacing: '2px', padding: '16px 36px' }}
            >
              Book an Event
            </a>
            <a
              href="#experience"
              onClick={scrollToExperience}
              className="btn btn-ghost"
              style={{ fontSize: '13px', letterSpacing: '2px', padding: '16px 36px' }}
            >
              The Experience →
            </a>
          </div>

          {/* Tagline */}
          <p style={{
            marginTop: '56px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '3px',
            color: 'var(--char)',
            textTransform: 'uppercase',
          }}>
            Old World Fire. New World Smoke.
          </p>
        </div>

        {/* RIGHT — logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Ember bloom behind the logo */}
          <div style={{
            position: 'absolute',
            inset: '-10%',
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(201, 75, 26, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          <img
            src="/images/jabroni-logo.png"
            alt="Jabroni's Wood Fired"
            style={{
              width: '100%',
              maxWidth: '520px',
              height: 'auto',
              display: 'block',
              position: 'relative',
              zIndex: 1,
              filter: 'contrast(18) invert(1) brightness(2.5)',
              mixBlendMode: 'screen',
              opacity: 0.92,
            }}
          />

          {/* Heritage badge below the logo */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            marginTop: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{ height: '1px', width: '40px', background: 'var(--ember)', opacity: 0.5 }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '3px',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              opacity: 0.7,
            }}>
              Italian Heritage Since 1933
            </span>
            <div style={{ height: '1px', width: '40px', background: 'var(--ember)', opacity: 0.5 }} />
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          #hero .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 860px) {
          #hero > div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            padding: 100px 24px 80px !important;
          }
          #hero > div[style*="gridTemplateColumns"] h1 {
            font-size: clamp(2.4rem, 10vw, 4rem) !important;
          }
          /* On mobile, logo goes above the text */
          #hero > div[style*="gridTemplateColumns"] > div:last-child {
            order: -1;
          }
          #hero > div[style*="gridTemplateColumns"] > div:last-child img {
            max-width: 280px !important;
          }
        }
      `}</style>
    </section>
  )
}
