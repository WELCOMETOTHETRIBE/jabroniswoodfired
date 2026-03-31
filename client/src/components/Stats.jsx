import { useRef, useEffect } from 'react'

const STATS = [
  {
    value: '1933',
    label: 'Italian Heritage',
    sub: 'Three generations of fire',
    font: 'bebas',
  },
  {
    value: '~70%',
    label: 'Gross Margin',
    sub: 'Premium packages',
    font: 'bebas',
  },
  {
    value: '$30K–$60K',
    label: 'Per Custom Oven',
    sub: 'Commission pricing',
    font: 'bebas',
  },
  {
    value: '3',
    label: 'Markets',
    sub: 'Coachella · South Bay · SoCal',
    font: 'bebas',
  },
  {
    value: '90',
    label: 'Days to Profitability',
    sub: 'Conservative model',
    font: 'bebas',
  },
  {
    value: '$100K+',
    label: 'Monthly Revenue Target',
    sub: 'Phase 4 at scale',
    font: 'bebas',
  },
]

const MARKETS = [
  {
    market: 'Palm Springs · Coachella Valley',
    focus: 'BBQ & Live-Fire Events',
    size: '50–200 guests',
    revenue: '$4K–$18K / event',
  },
  {
    market: 'La Quinta · Desert Communities',
    focus: 'Wood-Fired Pizza Experiences',
    size: '30–150 guests',
    revenue: '$5K–$22K / event',
  },
  {
    market: 'South Bay LA',
    focus: 'Premium BBQ Catering',
    size: '30–100 guests',
    revenue: '$3K–$12K / event',
  },
  {
    market: 'Statewide · National',
    focus: 'Custom Oven Commissions',
    size: 'N/A',
    revenue: '$30K–$60K / unit',
  },
]

export default function Stats() {
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

  return (
    <section ref={sectionRef} style={{
      background: 'var(--ash)',
      borderTop: '1px solid var(--char)',
      borderBottom: '1px solid var(--char)',
      padding: '80px 0',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>

        {/* Stats grid */}
        <div className="reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '2px',
          marginBottom: '64px',
        }}>
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: '32px 20px',
                background: i % 2 === 0 ? 'rgba(15, 13, 11, 0.4)' : 'transparent',
                borderLeft: i > 0 ? '1px solid var(--char)' : 'none',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(1.6rem, 2.5vw, 2.8rem)',
                color: 'var(--ember-glow)',
                letterSpacing: '1px',
                lineHeight: 1,
                marginBottom: '6px',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '2px',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}>
                {stat.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '0.85rem',
                color: 'var(--char)',
                fontStyle: 'italic',
                letterSpacing: '0.3px',
              }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Markets table */}
        <div className="reveal reveal-delay-2">
          <div style={{ marginBottom: '20px' }}>
            <span className="eyebrow">Active Markets</span>
          </div>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-cormorant)',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ember)' }}>
                {['Market', 'Primary Focus', 'Event Size', 'Revenue'].map(h => (
                  <th key={h} style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    textAlign: 'left',
                    padding: '8px 12px 12px 0',
                    fontWeight: 400,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MARKETS.map((row, i) => (
                <tr
                  key={row.market}
                  style={{
                    borderBottom: '1px solid var(--char)',
                    background: i % 2 === 1 ? 'rgba(15, 13, 11, 0.2)' : 'transparent',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(201, 75, 26, 0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? 'rgba(15, 13, 11, 0.2)' : 'transparent'}
                >
                  <td style={{ padding: '14px 12px 14px 0', color: 'var(--cream)', fontSize: '1rem', fontWeight: 400 }}>
                    {row.market}
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--bone)', fontSize: '1rem' }}>
                    {row.focus}
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--bone)', fontSize: '1rem' }}>
                    {row.size}
                  </td>
                  <td style={{
                    padding: '14px 0 14px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    color: 'var(--ember-glow)',
                  }}>
                    {row.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--char)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginTop: '12px',
          }}>
            Estate communities — The Madison Club · Hideaway · Thermal Club — anchor the Coachella Valley market.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          section [style*="gridTemplateColumns: 'repeat(6, 1fr)'"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          section [style*="padding: '0 48px'"] {
            padding: 0 24px !important;
          }
          table { font-size: 0.9rem !important; }
          th, td { padding: 10px 8px 10px 0 !important; }
        }
        @media (max-width: 560px) {
          section [style*="gridTemplateColumns: 'repeat(6, 1fr)'"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}
