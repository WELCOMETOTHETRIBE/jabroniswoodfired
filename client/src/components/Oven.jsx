import { useRef, useEffect } from 'react'
import { JabroniIcon } from './JabroniSVG'
import SectionHeader from './SectionHeader'

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

/**
 * ImageSlot — image-or-typographic-composition slot.
 *
 * Photography is months away (per the research brief, Section 11). Until
 * real shots land, we render an oversized typographic composition instead
 * of a "photo coming soon" placeholder: a Bebas Neue temperature reading
 * (or other large numeral), a thin diagonal-hatched brick texture for
 * grit, the spec label in mono caps, and the existing JabroniIcon mark
 * to anchor the slot in brand. The component reserves the same dimensions
 * a real photo will eventually fill, so the swap is free.
 *
 * If a `src` is supplied AND the image loads, the typographic composition
 * is hidden via JS and the photo takes over.
 */
function ImageSlot({ src, alt, label, headline, sub, style = {} }) {
  return (
    <div
      role="img"
      aria-label={alt || label || 'Wood-fired oven detail'}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--curtain)',
        border: '1px solid var(--char)',
        ...style,
      }}
    >
      {src && (
        <img
          src={src}
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

      {/* Typographic composition — replaces "photo coming soon" placeholder.
          Brick-like diagonal hatch + oversized numerals + spec label. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          padding: '20px 22px',
          background: `
            linear-gradient(135deg, rgba(201, 75, 26, 0.06) 0%, transparent 60%),
            repeating-linear-gradient(
              90deg,
              rgba(61, 53, 48, 0.0) 0,
              rgba(61, 53, 48, 0.35) 1px,
              rgba(61, 53, 48, 0.0) 2px,
              rgba(61, 53, 48, 0.0) 64px
            ),
            repeating-linear-gradient(
              0deg,
              rgba(61, 53, 48, 0.0) 0,
              rgba(61, 53, 48, 0.30) 1px,
              rgba(61, 53, 48, 0.0) 2px,
              rgba(61, 53, 48, 0.0) 32px
            ),
            radial-gradient(ellipse 120% 90% at 80% 100%, rgba(201, 75, 26, 0.10) 0%, transparent 60%),
            var(--curtain)
          `,
          zIndex: 1,
        }}
      >
        {/* The big typographic numeral / phrase */}
        {headline && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(3rem, 9vw, 5.5rem)',
              letterSpacing: '4px',
              color: 'var(--ember-glow)',
              lineHeight: 1,
              opacity: 0.9,
            }}>
              {headline}
            </div>
            {sub && (
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '3px',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                marginTop: '8px',
                opacity: 0.85,
              }}>
                {sub}
              </div>
            )}
          </div>
        )}

        {/* Mascot mark, low-opacity, in the upper-right */}
        <JabroniIcon
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '28px',
            height: '28px',
            color: 'var(--ember)',
            opacity: 0.4,
          }}
        />

        {/* Bottom-left label — spec line */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '2.5px',
          color: 'var(--bone)',
          textTransform: 'uppercase',
          opacity: 0.8,
          maxWidth: '70%',
          lineHeight: 1.6,
          position: 'relative',
          zIndex: 1,
        }}>
          {label}
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
    // Fire the global pre-select event — Booking.jsx listens for this and
    // sets the inquiry type without us touching its DOM directly.
    window.dispatchEvent(new CustomEvent('jabroni:preselect-inquiry', {
      detail: { value: 'Oven Commission' },
    }))
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="oven"
      ref={sectionRef}
      className="py-20 md:py-[120px]"
      style={{
        background: 'var(--curtain)',
        borderTop: '1px solid var(--char)',
      }}
    >
      <div className="mx-auto max-w-page px-6 md:px-12">

        <SectionHeader
          kicker={{ left: 'The Oven', right: 'Commission' }}
          eyebrow="Static & Mobile · Hand-Built · No Catalog"
          title="Built for Your Space."
          accent="Static or Mobile."
          body="A wood-fired oven is a living thing. It breathes. It holds heat in the brick long after the fire dies down. Fueled by olive wood and built with hand-laid firebrick the way southern Italian masons have done for centuries, each oven we commission carries a lineage that predates every kitchen appliance you've ever owned. Static builds for estates and restaurants. Mobile rigs that come to you."
        />

        {/* Two-column layout — stacks below md (gap also tightens). */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* LEFT: Gallery — typographic compositions stand in for photos
              until real photography lands. The slots are sized to match
              the eventual photo crops so the swap-in is a no-op. */}
          <div className="reveal">
            {/* Hero image slot — peak temp reading */}
            <ImageSlot
              src="/images/oven-hero.jpg"
              alt="Wood-fired oven at peak temperature"
              label="Signature Series · Brick Dome · 42″ Mouth"
              headline="850°F"
              sub="Peak Hearth Temperature"
              style={{ height: '320px', marginBottom: '8px' }}
            />
            {/* Two square slots */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <ImageSlot
                src="/images/oven-tile.jpg"
                alt="Estate-series custom arch"
                label="Estate Series · Custom Arch"
                headline="60″"
                sub="Full Hearth"
                style={{ height: '180px' }}
              />
              <ImageSlot
                src="/images/oven-fire.jpg"
                alt="Active live-fire hearth"
                label="Active Hearth · Full Temp"
                headline="1933"
                sub="Family Lineage"
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
              Every event we cater is the showroom. The smell of olive wood reaches the crowd before the food does. We pull Nonna's Ransom from the mouth of the oven, the brick radiates, someone goes quiet. That's the whole pitch. We don't do another one.
            </p>
            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '0.95rem',
              color: 'var(--muted)',
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
                        fontSize: '10px', /* up from 9px — and shifted to ember-glow which clears AA on ash */
                        fontWeight: 700,
                        letterSpacing: '2px',
                        color: 'var(--ember-glow)',
                        border: '1px solid var(--ember)',
                        padding: '3px 8px',
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
                        color: 'var(--muted)',
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
                color: 'var(--muted)',
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

    </section>
  )
}
