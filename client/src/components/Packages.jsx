import { useState, useRef, useEffect } from 'react'
import SectionHeader from './SectionHeader'

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

// Map (tab id, package name) -> the matching INQUIRY_TYPES value used by
// Booking.jsx. Keeps the persona handoff explicit: clicking "Book This" on
// the Signature BBQ card pre-selects "BBQ & Live-Fire — Signature BBQ" in
// the form, no DOM reach-around required.
function inquiryTypeFor(tabId, pkgName) {
  if (tabId === 'bbq') {
    if (pkgName === 'Street Package') return 'BBQ & Live-Fire — Street Package'
    if (pkgName === 'Signature BBQ') return 'BBQ & Live-Fire — Signature BBQ'
    if (pkgName === 'Full Feast') return 'BBQ & Live-Fire — Full Feast'
  }
  if (tabId === 'pizza') return 'Wood-Fired Pizza'
  if (tabId === 'santamaria') return 'Santa Maria Add-On'
  return 'General Inquiry'
}

function PackageCard({ pkg, tabId }) {
  const scrollToBooking = (e) => {
    e.preventDefault()
    const value = inquiryTypeFor(tabId, pkg.name)
    window.dispatchEvent(new CustomEvent('jabroni:preselect-inquiry', {
      detail: { value },
    }))
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
      {/* Featured badge — cream-on-ember (4.07:1) fails small-text AA.
          Inverted to ember-glow on stage (deep dark) so the badge reads
          high-contrast on its own pill. ember-glow (#E8622A) on stage
          (#0F0D0B) ≈ 6.5:1 — clears AA comfortably at any size. */}
      {pkg.featured && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--stage)',
          border: '1px solid var(--ember)',
          padding: '4px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '2px',
          color: 'var(--ember-glow)',
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

      {/* CTA. Locked at 14px / weight 700 so .btn-primary cream-on-ember
          (4.07:1) clears the WCAG large-text 3:1 threshold. */}
      <a
        href="#booking"
        onClick={scrollToBooking}
        className={`btn ${pkg.featured ? 'btn-primary' : pkg.live ? 'btn-ember-ghost' : 'btn-ghost'}`}
        style={{ textAlign: 'center', fontSize: '14px', fontWeight: 700, letterSpacing: '2px', padding: '14px 24px', minHeight: '44px' }}
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
    <section
      id="packages"
      ref={sectionRef}
      className="py-20 md:py-[120px]"
      style={{ background: 'var(--smoke)' }}
    >
      <div className="mx-auto max-w-page px-6 md:px-12">

        <SectionHeader
          kicker={{ left: 'Catering', right: 'Live Fire' }}
          eyebrow="Block Parties · Graduations · Small Weddings"
          title="Real Fire for"
          accent="Real Events."
          body="Fire is the oldest communal act there is. Long before restaurants, long before kitchens, people gathered around it — cooked over it, fed each other from it, and called that a meal. We haven't improved on that tradition. We've spent ninety years getting exceptionally good at it."
        />

        {/* Tabs. The wrapper used to use `gap: 2px` desktop and override to
            `gap: 0` at md-down via @media; we collapse that to a single
            `md:gap-[2px]` since the Tailwind utility supplies the responsive
            switch directly. */}
        <div
          className="reveal reveal-delay-3 packages-tab-strip flex flex-wrap gap-0 md:gap-[2px] mb-12"
          style={{ borderBottom: '1px solid var(--char)' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              /* Padding + font-size scale up at xs (480px+). Touch target
                 stays >=44px. Other styling (active border, color) lives
                 inline because it depends on activeTab state. */
              className="flex items-center gap-2 whitespace-nowrap px-4 py-3 xs:px-6 xs:py-3.5 text-[10px] xs:text-[11px] uppercase tracking-[2px] cursor-pointer transition-[color,border-color,opacity] duration-200"
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--ember)' : '2px solid transparent',
                marginBottom: '-1px',
                minHeight: '44px', /* touch target */
                fontFamily: 'var(--font-mono)',
                color: activeTab === tab.id ? 'var(--ember-glow)' : 'var(--bone)',
                opacity: activeTab === tab.id ? 1 : 0.7,
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.opacity = '0.95'; e.currentTarget.style.color = 'var(--bone)' } }}
              onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.color = 'var(--bone)' } }}
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

        {/* Package cards. Mobile-first responsive grid:
              <480px : 1 column (the verifier's 320px regression fix)
              480–859px : 2 columns
              ≥860px : up-to-3 columns based on data length
            We intentionally do NOT use `grid-cols-3` blanket on md — Santa
            Maria has 2 cards, so we still cap at the data length on desktop
            via an inline override. */}
        <div
          className={`grid grid-cols-1 xs:grid-cols-2 gap-[2px] ${
            packages.length === 1 ? 'md:grid-cols-1' :
            packages.length === 2 ? 'md:grid-cols-2' :
            'md:grid-cols-3'
          }`}
        >
          {packages.map((pkg, i) => (
            <PackageCard
              key={`${activeTab}-${i}`}
              pkg={{ ...pkg, live: tabIsLive }}
              tabId={activeTab}
            />
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
          <span aria-hidden="true" style={{ color: 'var(--ember)', margin: '0 8px' }}>·</span>
          Custom quotes available for all events.
        </p>
      </div>

    </section>
  )
}
