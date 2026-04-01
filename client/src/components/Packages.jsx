import { useState, useRef, useEffect } from 'react'
import { JabroniIcon } from './JabroniSVG'

const TABS = [
  { id: 'bbq', label: 'BBQ & Live-Fire', live: true },
  { id: 'pizza', label: 'Wood-Fired Pizza', live: true },
  { id: 'santamaria', label: 'Santa Maria Grill', live: false },
]

const PACKAGES = {
  bbq: [
    {
      name: 'Street Package',
      tagline: 'Block parties & backyard events',
      price: '$28–$35',
      unit: '/head',
      min: '20 guests min',
      featured: false,
      live: true,
      inclusions: [
        '3-hour service window',
        'Choice of 2 — Pitmaster\'s Pride, Hog\'s Share, or Feather & Flame',
        'Calabrian Slaw + one additional side',
        'House sauces + condiments',
        'Basic setup & breakdown',
      ],
    },
    {
      name: 'Signature BBQ',
      tagline: 'Graduations & celebrations',
      price: '$45–$65',
      unit: '/head',
      min: '40 guests min',
      featured: true,
      live: true,
      inclusions: [
        '4-hour service window',
        'Choice of 3 — Pitmaster\'s Pride, Hog\'s Share, Feather & Flame',
        'Full Italian Cowboy Sides — Calabrian Slaw, Belly Beans, Smoke & Cacio',
        'Artisan bread & butter service',
        'House sauces — all varieties',
        'Staffed buffet setup',
        'Professional equipment & setup crew',
      ],
    },
    {
      name: 'Full Feast',
      tagline: 'Weddings & milestone events',
      price: '$85–$120',
      unit: '/head',
      min: '50 guests min',
      featured: false,
      live: true,
      inclusions: [
        '5-hour full event coverage',
        'Full Smokeworks menu — Pitmaster\'s Pride, Hog\'s Share & Feather & Flame',
        'All Italian Cowboy Sides — Calabrian Slaw, Belly Beans & Smoke & Cacio',
        'Passed appetizers (1 hour)',
        'Dessert service — Princess Peach or Kenny\'s Cheesecake',
        'Full staffing + service crew',
        'Custom menu consultation',
      ],
    },
  ],
  pizza: [
    {
      name: 'Pizza Add-On',
      tagline: 'Add wood-fired pizza to any event',
      price: '+$15–$25',
      unit: '/head',
      min: 'Add to any booking',
      featured: false,
      live: true,
      inclusions: [
        'Wood-fired oven on-site',
        'Choose up to 4 pies — Margherita, Hot \'Roni, Holy Smoke & more',
        'Fresh-pulled mozzarella, live',
        'House-made dough, daily',
        'Marinara, classic & seasonal options',
      ],
    },
    {
      name: 'Pizza Feast',
      tagline: 'Block parties & outdoor gatherings',
      price: '$55–$80',
      unit: '/head',
      min: '30 guests min',
      featured: true,
      live: true,
      inclusions: [
        'Dedicated wood-fired oven station',
        'Full pie menu — Margherita, Hot \'Roni, Holy Smoke, The Outlaw, Nonna\'s Ransom & more',
        'Antipasto spread + fresh focaccia',
        'Fresh mozz pull, live',
        'Campfire Caruso dessert (add-on)',
        'Staffed oven service',
      ],
    },
    {
      name: 'BBQ + Pizza',
      tagline: 'Graduations & small weddings',
      price: '$75–$95',
      unit: '/head',
      min: '40 guests min',
      featured: false,
      live: true,
      inclusions: [
        'Full Smokeworks BBQ — Pitmaster\'s Pride, Hog\'s Share & Feather & Flame',
        'Wood-fired pizza — your choice of 4 pies from the full menu',
        'Italian Cowboy Sides — Calabrian Slaw, Belly Beans & Smoke & Cacio',
        'Dual live-fire setup',
        'Full staff & service crew',
        'The whole fire, one table',
      ],
    },
  ],
  santamaria: [
    {
      name: 'Santa Maria Add-On',
      tagline: 'Open-fire grill layered onto any package',
      price: 'Inquire',
      unit: '',
      min: 'Add to any booking',
      featured: true,
      live: false,
      inclusions: [
        'Traditional Santa Maria-style open pit',
        'Tri-tip over live oak coals',
        'Pinquito beans from scratch',
        'Grilled bread & salsa',
        'West Coast\'s oldest fire technique',
        'Pairs with BBQ or pizza packages',
      ],
    },
    {
      name: 'Santa Maria Full Experience',
      tagline: 'The complete Central Coast tradition',
      price: 'Inquire',
      unit: '',
      min: '30 guests min',
      featured: false,
      live: false,
      inclusions: [
        'Dedicated Santa Maria pit station',
        'Full tri-tip & side beef menu',
        'Classic salsa, beans & garlic bread',
        'Staffed live-fire service',
        'Custom menu consultation',
      ],
    },
  ],
}

function PackageCard({ pkg }) {
  const scrollToBooking = (e) => {
    e.preventDefault()
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{
      background: pkg.featured ? 'var(--ash)' : 'rgba(45, 41, 37, 0.3)',
      border: pkg.featured ? '1px solid var(--ember)' : '1px solid var(--char)',
      padding: '40px 32px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'border-color 0.2s ease, background 0.2s ease',
    }}
    onMouseEnter={e => {
      if (!pkg.featured) e.currentTarget.style.background = 'rgba(45, 41, 37, 0.5)'
    }}
    onMouseLeave={e => {
      if (!pkg.featured) e.currentTarget.style.background = 'rgba(45, 41, 37, 0.3)'
    }}
    >
      {/* Featured badge */}
      {pkg.featured && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--ember)',
          padding: '3px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '2px',
          color: 'var(--cream)',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {pkg.live ? 'Most Popular' : 'Coming Soon'}
        </div>
      )}

      {/* Coming soon badge */}
      {!pkg.live && !pkg.featured && (
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <span className="phase-badge">Coming Soon</span>
        </div>
      )}

      {/* Package name */}
      <h3 style={{
        fontFamily: 'var(--font-playfair)',
        fontSize: '1.4rem',
        fontWeight: 700,
        color: 'var(--cream)',
        marginBottom: '4px',
        marginTop: pkg.featured ? '12px' : '0',
        letterSpacing: '-0.2px',
      }}>
        {pkg.name}
      </h3>

      {/* Tagline */}
      {pkg.tagline && (
        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          color: 'var(--gold)',
          marginBottom: '12px',
          lineHeight: 1.4,
        }}>
          {pkg.tagline}
        </p>
      )}

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '4px' }}>
        <span style={{
          fontFamily: 'var(--font-bebas)',
          fontSize: '2.8rem',
          color: pkg.featured ? 'var(--ember-glow)' : 'var(--cream)',
          letterSpacing: '1px',
          lineHeight: 1,
        }}>
          {pkg.price}
        </span>
        {pkg.unit && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--gold)',
            letterSpacing: '1px',
          }}>
            {pkg.unit}
          </span>
        )}
      </div>

      {/* Min guests */}
      <div className="eyebrow" style={{ marginBottom: '24px', opacity: 0.6 }}>
        {pkg.min}
      </div>

      <div style={{ height: '1px', background: 'var(--char)', marginBottom: '24px' }} />

      {/* Inclusions */}
      <ul style={{
        listStyle: 'none',
        padding: 0,
        marginBottom: '32px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {pkg.inclusions.map((item, i) => (
          <li key={i} style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1rem',
            color: 'var(--bone)',
            lineHeight: 1.5,
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
          }}>
            <span style={{ color: 'var(--ember-glow)', flexShrink: 0, marginTop: '2px', fontSize: '12px' }}>—</span>
            {item}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#booking"
        onClick={scrollToBooking}
        className={`btn ${pkg.featured ? 'btn-primary' : pkg.live ? 'btn-ember-ghost' : 'btn-ghost'}`}
        style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '2px', padding: '13px 24px' }}
      >
        {pkg.live ? 'Book This →' : 'Get Notified →'}
      </a>
    </div>
  )
}

export default function Packages() {
  const [activeTab, setActiveTab] = useState('bbq')
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

  const packages = PACKAGES[activeTab] || []
  const tabIsLive = TABS.find(t => t.id === activeTab)?.live ?? false

  return (
    <section id="packages" ref={sectionRef} style={{
      background: 'var(--smoke)',
      padding: '120px 0',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>

        {/* Section header */}
        <div className="fire-rule reveal" style={{ marginBottom: '48px' }}>
          <span>Catering</span>
          <JabroniIcon style={{ width: '24px', height: '24px', color: 'var(--ember)', flexShrink: 0 }} />
          <span>Live Fire</span>
        </div>

        <div className="reveal reveal-delay-1" style={{ marginBottom: '8px' }}>
          <span className="eyebrow">Block Parties · Graduations · Small Weddings</span>
        </div>
        <h2 className="reveal reveal-delay-2" style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 900,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: 'var(--cream)',
          marginBottom: '20px',
          letterSpacing: '-0.5px',
        }}>
          Real Fire for{' '}
          <em style={{ color: 'var(--ember-glow)', fontStyle: 'italic' }}>Real Events.</em>
        </h2>
        <p className="reveal reveal-delay-2" style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1.1rem',
          fontWeight: 300,
          color: 'var(--bone)',
          lineHeight: 1.75,
          marginBottom: '48px',
          maxWidth: '560px',
        }}>
          We bring the fire to you — wood-fired pizza, slow-smoked BBQ, and the open-pit Santa Maria grill (coming soon). Every event is set up, staffed, and broken down by us.
        </p>

        {/* Tabs */}
        <div className="reveal reveal-delay-3" style={{
          display: 'flex',
          gap: '2px',
          marginBottom: '48px',
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--char)',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--ember)' : '2px solid transparent',
                marginBottom: '-1px',
                padding: '14px 24px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: activeTab === tab.id ? 'var(--ember-glow)' : 'var(--bone)',
                opacity: activeTab === tab.id ? 1 : 0.55,
                transition: 'color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.color = 'var(--bone)' } }}
              onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.opacity = '0.55'; e.currentTarget.style.color = 'var(--bone)' } }}
            >
              {tab.label}
              {tab.live && (
                <span style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  flexShrink: 0,
                }} />
              )}
              {!tab.live && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  letterSpacing: '1px',
                  color: 'var(--gold)',
                  border: '1px solid var(--gold)',
                  padding: '1px 5px',
                  opacity: 0.7,
                }}>
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Package cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(packages.length, 3)}, 1fr)`,
          gap: '2px',
        }}>
          {packages.map((pkg, i) => (
            <PackageCard key={`${activeTab}-${i}`} pkg={{ ...pkg, live: tabIsLive }} />
          ))}
        </div>

        {/* Footnote */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--muted)',
          letterSpacing: '1.5px',
          marginTop: '32px',
          textAlign: 'center',
          textTransform: 'uppercase',
        }}>
          All pricing is per-person. Travel fees may apply outside Coachella Valley + South Bay LA.
          <span style={{ color: 'var(--ember)', margin: '0 8px' }}>·</span>
          Custom quotes available for all events.
        </p>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #packages [style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
          #packages > div {
            padding: 80px 24px !important;
          }
          #packages [style*="gap: '2px'"][style*="flexWrap: 'wrap'"] {
            gap: 0 !important;
          }
        }
        @media (max-width: 480px) {
          #packages [style*="padding: '14px 24px'"] {
            padding: 12px 16px !important;
            font-size: 10px !important;
          }
        }
      `}</style>
    </section>
  )
}
