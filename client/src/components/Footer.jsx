import { JabroniIcon } from './JabroniSVG'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { label: 'The Experience', href: '#experience' },
    { label: 'Packages', href: '#packages' },
    { label: 'The Oven', href: '#oven' },
    { label: 'Book the Fire', href: '#booking' },
  ]

  const handleNavClick = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer style={{
      background: 'var(--stage)',
      borderTop: '1px solid var(--char)',
      padding: '80px 0 40px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>

        {/* Top row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '48px',
          marginBottom: '64px',
          alignItems: 'start',
        }}>
          {/* Logo + tagline */}
          <div>
            <img
              src="/images/jabroni-logo.png"
              alt="Jabroni's Wood Fired"
              style={{
                height: '80px',
                width: 'auto',
                display: 'block',
                marginBottom: '16px',
                filter: 'contrast(18) invert(1)',
                mixBlendMode: 'screen',
                opacity: 0.75,
              }}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            {/* Text fallback */}
            <div style={{ display: 'none', marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '42px', letterSpacing: '4px', color: 'var(--ember-glow)', lineHeight: 1 }}>
                Jabroni's
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--gold)', textTransform: 'uppercase', marginTop: '4px' }}>
                Wood Fired
              </div>
            </div>
            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.15rem',
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--bone)',
              letterSpacing: '0.5px',
            }}>
              Old World Fire. New World Smoke.
            </p>
            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '0.9rem',
              color: 'var(--char)',
              marginTop: '8px',
              letterSpacing: '0.3px',
            }}>
              Coachella Valley + South Bay LA · Italian Heritage Since 1933
            </p>
          </div>

          {/* Nav links */}
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-end' }}>
              {navLinks.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: 'var(--char)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => e.target.style.color = 'var(--ember-glow)'}
                    onMouseLeave={e => e.target.style.color = 'var(--char)'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider with mascot */}
        <div className="fire-rule" style={{ marginBottom: '32px' }}>
          <span>Respect the Fire</span>
          <JabroniIcon style={{ width: '20px', height: '20px', color: 'var(--ember)', flexShrink: 0, opacity: 0.6 }} />
          <span>Respect the Fire</span>
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--char)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}>
            © {currentYear} Jabroni's Wood Fired. All rights reserved.
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--char)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}>
            No Gas. No Gimmicks. Just Fire.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          footer [style*="gridTemplateColumns: '1fr auto'"] {
            grid-template-columns: 1fr !important;
          }
          footer nav ul {
            align-items: flex-start !important;
          }
          footer [style*="padding: '0 48px'"] {
            padding: 0 24px !important;
          }
        }
      `}</style>
    </footer>
  )
}
