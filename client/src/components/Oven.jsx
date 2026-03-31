import { useRef, useEffect } from 'react'
import { JabroniIcon } from './JabroniSVG'

const COMMISSION_TIERS = [
  {
    name: 'Signature Series',
    price: '$30–$38K',
    specs: '36″–42″ mouth',
    lead: '10–14 weeks',
    description: 'The entry point into real fire. Hand-laid firebrick, custom arch, powder-coated or natural steel exterior. Built for heavy residential and commercial use.',
    inclusions: [
      'Hand-laid firebrick dome & hearth',
      '36″ to 42″ mouth opening',
      'Integrated smoke management system',
      'Custom arch design',
      'Powder-coated or natural steel door',
      'Full installation guide + commissioning',
    ],
  },
  {
    name: 'Estate Series',
    price: '$40–$52K',
    specs: '48″–60″ hearth',
    lead: '14–20 weeks',
    description: 'For the estate kitchen, high-volume restaurant, or the residence that takes fire seriously. Larger hearth, full architectural integration available.',
    inclusions: [
      'Everything in Signature Series',
      '48″ to 60″ full hearth build',
      'Custom architectural surround options',
      'Integrated wood storage + ember management',
      'Premium refractory dome materials',
      'On-site installation service available',
      'Dedicated commission manager',
    ],
    featured: true,
  },
  {
    name: 'Grand Commission',
    price: '$52–$60K+',
    specs: 'Full architectural',
    lead: '20–28 weeks',
    description: 'A complete architectural build. Custom scale, custom material, custom everything. No catalog. No limitations. Built from a conversation.',
    inclusions: [
      'Everything in Estate Series',
      'Fully custom dimensions + layout',
      'Architect collaboration available',
      'Custom tile, stone, or brick finish',
      'Integrated multi-cook chamber option',
      'White-glove on-site installation',
      'Annual service agreement',
      'Naming rights to the build',
    ],
  },
]

function ImageSlot({ src, alt, label, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--ash)',
      border: '1px solid var(--char)',
      ...style,
    }}>
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={(e) => { e.target.style.display = 'none' }}
      />
      {/* Placeholder overlay — shown if image missing */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '8px',
        background: 'var(--ash)',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '2px',
          color: 'var(--ember)',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.8,
          padding: '0 24px',
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '1.5px',
          color: 'var(--char)',
          textTransform: 'uppercase',
        }}>
          Your fire. Your photo. Coming soon.
        </div>
      </div>
    </div>
  )
}

export default function Oven() {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
          }
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const scrollToBooking = (e) => {
    e.preventDefault()
    const booking = document.querySelector('#booking')
    if (booking) {
      booking.scrollIntoView({ behavior: 'smooth' })
      // Attempt to pre-select oven commission in the form
      setTimeout(() => {
        const select = document.querySelector('#inquiry-type')
        if (select) {
          select.value = 'Oven Commission'
          select.dispatchEvent(new Event('change', { bubbles: true }))
        }
      }, 600)
    }
  }

  return (
    <section id="oven" ref={sectionRef} style={{
      background: 'var(--curtain)',
      borderTop: '1px solid var(--char)',
      padding: '120px 0',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>

        {/* Section header */}
        <div className="fire-rule reveal" style={{ marginBottom: '48px' }}>
          <span>The Oven</span>
          <JabroniIcon style={{ width: '24px', height: '24px', color: 'var(--ember)', flexShrink: 0 }} />
          <span>Commission</span>
        </div>

        <div className="reveal reveal-delay-1">
          <span className="eyebrow">Hand-Built. No Catalog.</span>
        </div>
        <h2 className="reveal reveal-delay-2" style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 900,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: 'var(--cream)',
          margin: '12px 0 56px',
          letterSpacing: '-0.5px',
        }}>
          Built Different.{' '}
          <em style={{ color: 'var(--ember-glow)', fontStyle: 'italic' }}>Cooked Proper.</em>
        </h2>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          alignItems: 'start',
        }}>
          {/* LEFT: Gallery */}
          <div className="reveal">
            {/* Hero image slot */}
            <ImageSlot
              src="/images/oven-hero.jpg"
              alt="Wood-fired oven hero shot"
              label="Signature Series · Brick Dome · 42″ Mouth"
              style={{ height: '320px', marginBottom: '8px' }}
            />
            {/* Two square slots */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <ImageSlot
                src="/images/oven-tile.jpg"
                alt="Oven detail tile"
                label="Estate Series · Custom Arch"
                style={{ height: '180px' }}
              />
              <ImageSlot
                src="/images/oven-fire.jpg"
                alt="Fire in the oven"
                label="Active Hearth · Full Temp"
                style={{ height: '180px' }}
              />
            </div>

            {/* Tagline below gallery */}
            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.05rem',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--bone)',
              marginTop: '24px',
              lineHeight: 1.8,
              letterSpacing: '0.3px',
            }}>
              Every guest is a potential buyer. Every event is the showroom. We don't pitch the oven — we cook with it. If you want one after that, you know where to find us.
            </p>
            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '0.95rem',
              color: 'var(--char)',
              marginTop: '12px',
              letterSpacing: '0.3px',
              fontStyle: 'italic',
            }}>
              Italian culinary lineage since 1933. The ovens came before the catering. They always will.
            </p>
          </div>

          {/* RIGHT: Commission tiers */}
          <div className="reveal reveal-delay-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {COMMISSION_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  style={{
                    padding: '28px 28px',
                    background: tier.featured ? 'var(--ash)' : 'rgba(30, 21, 16, 0.6)',
                    border: tier.featured ? '1px solid var(--ember)' : '1px solid var(--char)',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => !tier.featured && (e.currentTarget.style.background = 'rgba(45, 41, 37, 0.5)')}
                  onMouseLeave={e => !tier.featured && (e.currentTarget.style.background = 'rgba(30, 21, 16, 0.6)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--cream)',
                      letterSpacing: '-0.2px',
                    }}>
                      {tier.name}
                    </h3>
                    {tier.featured && (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        letterSpacing: '2px',
                        color: 'var(--ember)',
                        border: '1px solid var(--ember)',
                        padding: '2px 8px',
                        textTransform: 'uppercase',
                      }}>
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Price + specs row */}
                  <div style={{ display: 'flex', gap: '24px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'var(--font-bebas)',
                      fontSize: '1.8rem',
                      color: tier.featured ? 'var(--ember-glow)' : 'var(--cream)',
                      letterSpacing: '1px',
                      lineHeight: 1,
                    }}>
                      {tier.price}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className="eyebrow" style={{ opacity: 0.7 }}>{tier.specs}</span>
                      <span className="eyebrow" style={{ opacity: 0.5 }}>{tier.lead}</span>
                    </div>
                  </div>

                  <p style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '0.95rem',
                    color: 'var(--bone)',
                    lineHeight: 1.65,
                    marginBottom: '16px',
                  }}>
                    {tier.description}
                  </p>

                  {/* Inclusions accordion hint */}
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {tier.inclusions.slice(0, tier.featured ? 4 : 3).map((item, i) => (
                      <li key={i} style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        letterSpacing: '1.5px',
                        color: 'var(--bone)',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'flex-start',
                        textTransform: 'uppercase',
                        opacity: 0.8,
                      }}>
                        <span style={{ color: 'var(--ember)', flexShrink: 0 }}>—</span>
                        {item}
                      </li>
                    ))}
                    {tier.inclusions.length > (tier.featured ? 4 : 3) && (
                      <li style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        letterSpacing: '1.5px',
                        color: 'var(--char)',
                        textTransform: 'uppercase',
                      }}>
                        + {tier.inclusions.length - (tier.featured ? 4 : 3)} more inclusions
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ marginTop: '32px' }}>
              <a
                href="#booking"
                onClick={scrollToBooking}
                className="btn btn-ember-ghost"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  padding: '16px 32px',
                }}
              >
                Start a Commission
              </a>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--char)',
                letterSpacing: '1.5px',
                textAlign: 'center',
                marginTop: '12px',
                textTransform: 'uppercase',
              }}>
                Every oven is a conversation. Start yours below.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #oven [style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          #oven [style*="padding: '0 48px'"] {
            padding: 0 24px !important;
          }
        }
      `}</style>
    </section>
  )
}
