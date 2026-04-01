import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Catering', href: '#packages' },
    { label: 'Oven Commissions', href: '#oven' },
    { label: 'The Experience', href: '#experience' },
    { label: 'Book', href: '#booking' },
  ]

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'background 0.3s ease, border-color 0.3s ease',
        background: scrolled
          ? 'rgba(15, 13, 11, 0.97)'
          : 'transparent',
        borderBottom: scrolled ? '1px solid #3D3530' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 32px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <img
            src="/images/jabroni-logo.png"
            alt="Jabroni's Wood Fired"
            style={{
              height: '52px',
              width: 'auto',
              filter: 'contrast(18) invert(1)',
              mixBlendMode: 'screen',
              opacity: 0.92,
            }}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
          {/* Text fallback — shown when logo image missing */}
          <span style={{
            display: 'none',
            flexDirection: 'column',
            gap: '1px',
          }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '28px', letterSpacing: '3px', color: 'var(--ember-glow)', lineHeight: 1 }}>
              Jabroni's
            </span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--gold)', letterSpacing: '2px', lineHeight: 1, textTransform: 'uppercase' }}>
              Wood Fired
            </span>
          </span>
        </a>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }} className="desktop-nav">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--bone)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                padding: '4px 0',
                borderBottom: '1px solid transparent',
              }}
              onMouseEnter={e => {
                e.target.style.color = 'var(--ember-glow)'
                e.target.style.borderBottomColor = 'var(--ember)'
              }}
              onMouseLeave={e => {
                e.target.style.color = 'var(--bone)'
                e.target.style.borderBottomColor = 'transparent'
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            onClick={(e) => handleNavClick(e, '#booking')}
            className="btn btn-primary"
            style={{ fontSize: '11px', padding: '10px 20px', letterSpacing: '2px' }}
          >
            Book the Fire
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
          }}
          aria-label="Menu"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block',
              width: '24px',
              height: '1px',
              background: menuOpen ? 'var(--ember)' : 'var(--cream)',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translateY(6px)'
                  : i === 1 ? 'scaleX(0)'
                  : 'rotate(-45deg) translateY(-6px)'
                : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(15, 13, 11, 0.98)',
          borderTop: '1px solid var(--char)',
          padding: '24px 32px 32px',
        }}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--bone)',
                textDecoration: 'none',
                padding: '14px 0',
                borderBottom: '1px solid var(--ash)',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            onClick={(e) => handleNavClick(e, '#booking')}
            className="btn btn-primary"
            style={{ marginTop: '24px', display: 'block', textAlign: 'center', fontSize: '12px' }}
          >
            Book the Fire
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
