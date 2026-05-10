import { useState, useEffect, useMemo } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Experience from './components/Experience'
import ExperienceCompact from './components/ExperienceCompact'
import Packages from './components/Packages'
import Oven from './components/Oven'
import Menu from './components/Menu'
import Booking from './components/Booking'
import Footer from './components/Footer'
import PersonaTabs, { PERSONA_TO_INQUIRY } from './components/PersonaTabs'
import StickyMobileCTA from './components/StickyMobileCTA'
import { JabroniShrug } from './components/JabroniSVG'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'

// Hash-anchor → persona mapping. Lets a deep-link like /#oven open the page
// already on the Ovens persona panel.
const HASH_TO_PERSONA = {
  '#packages': 'catering',
  '#menu': 'catering',
  '#oven': 'ovens',
  '#experience': 'evening',
}

// Simple hash-based routing for 404 state
function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--stage)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
      textAlign: 'center',
    }}>
      {/* Jabroni shrugging */}
      <div style={{ width: '160px', marginBottom: '40px', color: 'var(--ember)', opacity: 0.6 }}>
        <JabroniShrug style={{ width: '100%', height: 'auto' }} />
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '4px',
        color: 'var(--gold)',
        textTransform: 'uppercase',
        marginBottom: '16px',
      }}>
        404
      </div>

      <h1 style={{
        fontFamily: 'var(--font-playfair)',
        fontWeight: 900,
        fontSize: 'clamp(1.8rem, 4vw, 3rem)',
        color: 'var(--cream)',
        marginBottom: '16px',
        letterSpacing: '-0.3px',
        lineHeight: 1.1,
      }}>
        Wrong table.{' '}
        <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>No reservation here.</em>
      </h1>

      <p style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '1.1rem',
        color: 'var(--bone)',
        marginBottom: '40px',
        fontStyle: 'italic',
        fontWeight: 300,
      }}>
        The cigar's still lit. The fire's still going. But you're at the wrong table.
      </p>

      <a
        href="/"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--cream)',
          textDecoration: 'none',
          background: 'var(--ember)',
          padding: '14px 28px',
          display: 'inline-block',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={e => e.target.style.background = 'var(--ember-glow)'}
        onMouseLeave={e => e.target.style.background = 'var(--ember)'}
      >
        Back to the Table
      </a>
    </div>
  )
}

function SectionDivider() {
  return (
    <div style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, var(--char), transparent)',
    }} />
  )
}

/**
 * LongScrollDisclosure — the safety valve for users who want the
 * "everything for everyone" view that the old single-scroll homepage
 * provided. Per persona the user gets the focused view by default; if
 * they hit "Show me everything", the other persona panels render below.
 */
function LongScrollDisclosure({ open, onToggle }) {
  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '32px 48px 48px',
      textAlign: 'center',
      borderTop: '1px solid var(--char)',
    }}>
      <button
        onClick={onToggle}
        className="btn btn-ghost"
        style={{
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '2px',
          padding: '14px 28px',
          minHeight: '48px',
          background: 'transparent',
        }}
        aria-expanded={open}
      >
        {open ? 'Hide everything else' : 'Show me everything ↓'}
      </button>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px', /* up from 9px — muted on smoke = 4.9:1 safe at 10px */
        color: 'var(--muted)',
        letterSpacing: '1.5px',
        marginTop: '14px',
        textTransform: 'uppercase',
      }}>
        {open
          ? 'You\'re seeing every section, regardless of persona.'
          : 'Catering · Ovens · The Evening — see all three together.'}
      </p>
    </div>
  )
}

export default function App() {
  const [is404] = useState(() => {
    // In production, this would be determined by the router
    // For single-page app, all routes resolve to home
    return false
  })

  const [adminPage] = useState(() =>
    window.location.pathname === '/admin' ||
    window.location.pathname.startsWith('/admin/')
  )
  const [adminToken, setAdminToken] = useState(() =>
    sessionStorage.getItem('jabroni_admin_token')
  )
  const [adminUserId, setAdminUserId] = useState(() => {
    const id = sessionStorage.getItem('jabroni_admin_user_id')
    return id ? parseInt(id) : null
  })

  // Persona state: resolves from URL hash on first paint so deep-links land
  // on the right panel, defaults to Catering per the brief's Section 11.
  const [persona, setPersona] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    return HASH_TO_PERSONA[hash] || 'catering'
  })

  // Long-scroll fallback toggle — shows all three persona panels stacked
  // when the user opts in. Hidden by default to keep first-paint focused.
  const [showAll, setShowAll] = useState(false)

  if (adminPage) {
    if (!adminToken) {
      return (
        <AdminLogin
          onLogin={({ token, userId }) => {
            sessionStorage.setItem('jabroni_admin_token', token)
            sessionStorage.setItem('jabroni_admin_user_id', userId)
            setAdminToken(token)
            setAdminUserId(userId)
          }}
        />
      )
    }
    return (
      <AdminDashboard
        token={adminToken}
        currentUserId={adminUserId}
        onLogout={() => {
          sessionStorage.removeItem('jabroni_admin_token')
          sessionStorage.removeItem('jabroni_admin_user_id')
          setAdminToken(null)
          setAdminUserId(null)
        }}
      />
    )
  }

  // Global scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    // Observe all reveal elements in the document
    const observe = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el))
    }

    // Initial pass + mutation observer for dynamic content
    observe()
    const mutationObserver = new MutationObserver(observe)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  // Whenever the persona changes, broadcast the matching inquiry type so the
  // form's selector updates even if the user never clicks an explicit CTA.
  useEffect(() => {
    const inquiryType = PERSONA_TO_INQUIRY[persona]
    if (!inquiryType) return
    window.dispatchEvent(new CustomEvent('jabroni:preselect-inquiry', {
      detail: { value: inquiryType },
    }))
  }, [persona])

  // Listen for persona-switch requests from Footer / other deep-linking
  // surfaces so the right panel is mounted before the page scrolls.
  useEffect(() => {
    const handler = (e) => {
      const next = e?.detail?.persona
      if (typeof next === 'string' && PERSONA_TO_INQUIRY[next]) setPersona(next)
    }
    window.addEventListener('jabroni:select-persona', handler)
    return () => window.removeEventListener('jabroni:select-persona', handler)
  }, [])

  const initialInquiryType = useMemo(() => PERSONA_TO_INQUIRY[persona], [persona])

  if (is404) return <NotFound />

  // Per-persona panels. Each panel renders only the sections relevant to that
  // intent. The long-scroll fallback (`showAll`) appends every other panel
  // below for users who want the full stack.
  const renderPersonaPanel = (id) => {
    if (id === 'catering') {
      return (
        <div
          key="catering"
          id="persona-panel-catering"
          role="tabpanel"
          aria-labelledby="persona-tab-catering"
        >
          <Packages />
          <SectionDivider />
          <Menu />
        </div>
      )
    }
    if (id === 'ovens') {
      return (
        <div
          key="ovens"
          id="persona-panel-ovens"
          role="tabpanel"
          aria-labelledby="persona-tab-ovens"
        >
          <Oven />
        </div>
      )
    }
    if (id === 'evening') {
      return (
        <div
          key="evening"
          id="persona-panel-evening"
          role="tabpanel"
          aria-labelledby="persona-tab-evening"
        >
          {/* Inside the persona view we render the compressed teaser. The
              full-length Experience component is reserved for the
              "Show me everything" long-scroll fallback below. */}
          <ExperienceCompact />
        </div>
      )
    }
    return null
  }

  // The other personas appear in the long-scroll fallback in a fixed order
  // (Catering → Ovens → Evening), and the Evening uses the long form there.
  const renderLongScrollExtras = () => {
    return (
      <div aria-label="All sections">
        {persona !== 'catering' && (
          <>
            <Packages />
            <SectionDivider />
            <Menu />
            <SectionDivider />
          </>
        )}
        {persona !== 'ovens' && (
          <>
            <Oven />
            <SectionDivider />
          </>
        )}
        {/* Evening — the long-scroll fallback always shows the full version,
            not the compressed teaser. The compressed teaser is reserved for
            the persona-tab view. */}
        {persona !== 'evening' && (
          <>
            <Experience />
            <SectionDivider />
          </>
        )}
        {/* If the user is already on the Evening tab and asks to see
            everything, give them the full Experience too. */}
        {persona === 'evening' && (
          <>
            <SectionDivider />
            <Experience />
            <SectionDivider />
          </>
        )}
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--smoke)', minHeight: '100vh' }}>
      <Nav persona={persona} onSelectPersona={setPersona} />
      <main>
        <Hero onSelectPersona={setPersona} />
        <PersonaTabs active={persona} onChange={setPersona} />
        <SectionDivider />
        {renderPersonaPanel(persona)}
        <SectionDivider />
        <Booking initialInquiryType={initialInquiryType} />
        <LongScrollDisclosure open={showAll} onToggle={() => setShowAll(v => !v)} />
        {showAll && renderLongScrollExtras()}
      </main>
      <Footer />
      <StickyMobileCTA persona={persona} />
    </div>
  )
}
