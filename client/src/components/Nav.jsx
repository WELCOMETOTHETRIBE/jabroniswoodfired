import { useState, useEffect } from 'react'
import { PERSONA_CTA, PERSONAS } from './PersonaTabs'

/**
 * Nav — fixed top chrome.
 *
 * Simplified post-redesign:
 *  - The four section anchors (Catering / Menu / Oven / Experience) are no
 *    longer rendered on desktop because the persona-tab strip below the
 *    Hero now does that job, and section visibility depends on persona.
 *    They remain in the mobile hamburger as a "long-scroll fallback" for
 *    users who arrived via a deep link or who genuinely want everything.
 *  - The nav's primary CTA is persona-aware — its label and pre-select
 *    intent change with the active persona.
 */
export default function Nav({ persona = 'catering', onSelectPersona }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Long-scroll fallback links — only shown in the mobile hamburger menu
  const fallbackLinks = [
    { label: 'Catering', href: '#packages', persona: 'catering' },
    { label: 'Menu', href: '#menu', persona: 'catering' },
    { label: 'Ovens', href: '#oven', persona: 'ovens' },
    { label: 'The Evening', href: '#experience', persona: 'evening' },
  ]

  const handleAnchorClick = (e, link) => {
    e.preventDefault()
    setMenuOpen(false)
    if (link.persona) onSelectPersona?.(link.persona)
    // Two RAFs — let React commit the panel swap before scrolling, so we
    // land on the freshly-mounted section node, not the old one.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
    }))
  }

  const handleCtaClick = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    const cta = PERSONA_CTA[persona] || PERSONA_CTA.catering
    window.dispatchEvent(new CustomEvent('jabroni:preselect-inquiry', {
      detail: { value: cta.inquiryType },
    }))
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  const cta = PERSONA_CTA[persona] || PERSONA_CTA.catering

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
      aria-label="Primary"
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
          aria-label="Jabroni's Wood Fired — home"
        >
          <img
            src="/images/jabroni-logo-transparent.png"
            alt=""
            style={{
              height: '56px',
              width: 'auto',
              display: 'block',
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

        {/* Desktop right side — single persona-aware CTA. Locked at
            14px / weight 700 so cream-on-ember (4.07:1) clears WCAG
            large-text 3:1. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-nav">
          <a
            href="#booking"
            onClick={handleCtaClick}
            className="btn btn-primary"
            style={{ fontSize: '14px', fontWeight: 700, padding: '12px 22px', letterSpacing: '2px', minHeight: '44px' }}
          >
            {cta.label}
          </a>
        </div>

        {/* Mobile hamburger. 44×44 hit target — verifier flagged 40×29
            previously. The visual stack of three lines stays the same;
            we just give the button enough padding to be a real touch
            target. */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '12px',
            minHeight: '44px',
            minWidth: '44px',
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px',
          }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
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

      {/* Mobile Menu — hosts persona switcher + long-scroll fallback links */}
      {menuOpen && (
        <div style={{
          background: 'rgba(15, 13, 11, 0.98)',
          borderTop: '1px solid var(--char)',
          padding: '20px 32px 24px',
        }}>
          {/* Persona switcher (mobile only — the sticky strip handles tablet+) */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '2px',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '10px',
            }}>
              Choose your path
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {PERSONAS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { onSelectPersona?.(p.id); setMenuOpen(false) }}
                  style={{
                    background: persona === p.id ? 'rgba(201, 75, 26, 0.12)' : 'transparent',
                    border: 'none',
                    borderLeft: persona === p.id ? '2px solid var(--ember)' : '2px solid transparent',
                    color: persona === p.id ? 'var(--ember-glow)' : 'var(--bone)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    textAlign: 'left',
                    padding: '14px 14px',
                    minHeight: '44px', /* touch target */
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span>{p.label}</span>
                  <span style={{ fontSize: '10px', opacity: 0.85, color: 'var(--gold)' }}>{p.status}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Long-scroll fallback section anchors */}
          <div style={{
            paddingTop: '12px',
            borderTop: '1px solid var(--ash)',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '2px',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}>
              Jump to section
            </span>
            {fallbackLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--bone)',
                  opacity: 0.65,
                  textDecoration: 'none',
                  padding: '14px 0',
                  minHeight: '44px', /* touch target — anchor's hit area covers full row */
                  borderBottom: '1px solid var(--ash)',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#booking"
            onClick={handleCtaClick}
            className="btn btn-primary"
            style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontSize: '14px', fontWeight: 700, minHeight: '48px' }}
          >
            {cta.label}
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
