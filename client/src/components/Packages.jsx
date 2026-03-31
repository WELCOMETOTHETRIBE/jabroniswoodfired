import { useState, useRef, useEffect } from 'react'
import { JabroniIcon } from './JabroniSVG'

const TABS = [
  { id: 'bbq', label: 'BBQ & Live-Fire', live: true },
  { id: 'pizza', label: 'Wood-Fired Pizza', live: false },
  { id: 'experience', label: 'A Jabroni\'s Evening', live: false },
]

// Which tabs show the Santa Maria add-on strip
const SANTA_MARIA_TABS = new Set(['bbq', 'pizza', 'experience'])

const PACKAGES = {
  bbq: [
    {
      name: 'Street Package',
      price: '$28–$35',
      unit: '/head',
      min: '20 guests min',
      featured: false,
      live: true,
      inclusions: [
        '3-hour service window',
        'Choice of 2 proteins — brisket, pulled pork, or chicken',
        'Seasonal sides (2)',
        'House sauces + condiments',
        'Basic setup & breakdown',
      ],
    },
    {
      name: 'Signature BBQ',
      price: '$45–$65',
      unit: '/head',
      min: '40 guests min',
      featured: true,
      live: true,
      inclusions: [
        '4-hour service window',
        'Choice of 3 proteins from full menu',
        'Full side spread (4 seasonal)',
        'Artisan bread & butter service',
        'House sauces — all varieties',
        'Staffed buffet setup',
        'Professional equipment & setup crew',
      ],
    },
    {
      name: 'Full Feast',
      price: '$85–$120',
      unit: '/head',
      min: '50 guests min',
      featured: false,
      live: true,
      inclusions: [
        '5-hour full event coverage',
        'Full protein menu — no limits',
        'Complete side & salad spread',
        'Passed appetizers (1 hour)',
        'Dessert service',
        'Full staffing + service crew',
        'Custom menu consultation',
      ],
    },
  ],
  pizza: [
    {
      name: 'Pizza Add-On',
      price: '+$15–$25',
      unit: '/head',
      min: 'Add to any booking',
      featured: false,
      live: false,
      inclusions: [
        'Wood-fired oven on-site',
        'Up to 4 pizza varieties',
        'Fresh-pulled mozzarella',
        'House-made dough, daily',
        'Classic + seasonal pies',
      ],
    },
    {
      name: 'Pizza Feast',
      price: '$55–$80',
      unit: '/head',
      min: '30 guests min',
      featured: true,
      live: false,
      inclusions: [
        'Dedicated wood-fired oven station',
        'Full pizza menu — 6+ varieties',
        'Antipasto spread',
        'Fresh mozz pull, live',
        'Calzone & focaccia options',
        'Staffed oven service',
      ],
    },
    {
      name: 'BBQ + Pizza',
      price: '$75–$95',
      unit: '/head',
      min: '40 guests min',
      featured: false,
      live: false,
      inclusions: [
        'Full wood-fired pizza station',
        'Full BBQ spread — 3 proteins',
        'Complete sides',
        'Dual live-fire setup',
        'Full staff & service crew',
        'The whole fire, one table',
      ],
    },
  ],
  experience: [
    {
      name: 'A Jabroni\'s Evening',
      price: '$300',
      unit: '/head',
      min: '40 guests min',
      featured: true,
      live: false,
      inclusions: [
        'Full live-fire dinner — custom menu',
        'Cocktail Maestro — tableside service',
        'Card Sharp — working the room all night',
        'Flame Thrower — opens the evening',
        'Burlesque Performer — between courses',
        'The Comedian — embedded, not staged',
        'Custom scripted to your event & venue',
      ],
    },
    {
      name: 'Resort Residency',
      price: 'Custom',
      unit: '',
      min: 'Recurring partnership',
      featured: false,
      live: false,
      inclusions: [
        'Ongoing residency structure',
        'Monthly or seasonal programming',
        'Co-branded event design',
        'Dedicated production team',
        'Flexible format — dinner, brunch, private',
        'Partnership pricing',
      ],
    },
  ],
}

// Santa Maria add-on — appears below the grid for BBQ, Pizza, and Experience
function SantaMariaAddon() {
  const scrollToBooking = (e) => {
    e.preventDefault()
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{
      marginTop: '2px',
      padding: '28px 32px',
      background: 'rgba(201, 75, 26, 0.04)',
      border: '1px solid var(--char)',
      borderLeft: '3px solid var(--ember)',
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flex: 1 }}>
        {/* Icon / label */}
        <div style={{
          fontFamily: 'var(--font-bebas)',
          fontSize: '1.8rem',
          color: 'var(--ember)',
          lineHeight: 1,
          letterSpacing: '1px',
          flexShrink: 0,
          paddingTop: '2px',
        }}>
          +
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <h3 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--cream)',
              letterSpacing: '-0.2px',
            }}>
              Santa Maria Add-On
            </h3>
            <span className="phase-badge">Lighting Soon</span>
          </div>
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1rem',
            fontWeight: 300,
            color: 'var(--bone)',
            lineHeight: 1.65,
            maxWidth: '520px',
          }}>
            Open-fire Santa Maria grill layered onto any package — BBQ, pizza, or the full evening. Tri-tip over live coals, pinquito beans from scratch, grilled bread. The oldest fire technique on the West Coast, added to whatever you've already got burning.
          </p>
          <div style={{ display: 'flex', gap: '24px', marginTop: '12px', flexWrap: 'wrap' }}>
            {[
              'Add to BBQ & Live-Fire',
              'Add to Wood-Fired Pizza',
              'Add to A Jabroni\'s Evening',
            ].map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '1.5px',
                color: 'var(--char)',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{ color: 'var(--ember)', fontSize: '10px' }}>—</span>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <a
        href="#booking"
        onClick={scrollToBooking}
        className="btn btn-ghost"
        style={{
          fontSize: '11px',
          letterSpacing: '2px',
          padding: '12px 24px',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Get Notified →
      </a>
    </div>
  )
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
          {pkg.live ? 'Most Popular' : 'Flagship'}
        </div>
      )}

      {/* Phase badge */}
      {!pkg.live && (
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <span className="phase-badge">Lighting Soon</span>
        </div>
      )}

      {/* Package name */}
      <h3 style={{
        fontFamily: 'var(--font-playfair)',
        fontSize: '1.4rem',
        fontWeight: 700,
        color: 'var(--cream)',
        marginBottom: '8px',
        marginTop: pkg.featured ? '12px' : '0',
        letterSpacing: '-0.2px',
      }}>
        {pkg.name}
      </h3>

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
            <span style={{ color: 'var(--ember)', flexShrink: 0, marginTop: '2px', fontSize: '12px' }}>—</span>
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
        {pkg.live
          ? 'Book This →'
          : pkg.price === 'Custom'
          ? 'Express Interest →'
          : 'Get Notified →'}
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
          <span>Packages</span>
          <JabroniIcon style={{ width: '24px', height: '24px', color: 'var(--ember)', flexShrink: 0 }} />
          <span>Packages</span>
        </div>

        <div className="reveal reveal-delay-1" style={{ marginBottom: '8px' }}>
          <span className="eyebrow">Choose Your Fire</span>
        </div>
        <h2 className="reveal reveal-delay-2" style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 900,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: 'var(--cream)',
          marginBottom: '56px',
          letterSpacing: '-0.5px',
        }}>
          Every Fire, Priced Right.
        </h2>

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
                color: activeTab === tab.id ? 'var(--ember-glow)' : 'var(--char)',
                transition: 'color 0.2s ease, border-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--bone)' }}
              onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--char)' }}
            >
              {tab.label}
              {tab.live && (
                <span style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--gold)',
                }} />
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

        {/* Santa Maria add-on strip */}
        {SANTA_MARIA_TABS.has(activeTab) && <SantaMariaAddon />}

        {/* Footnote */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--char)',
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
        }
      `}</style>
    </section>
  )
}
