import { useState, useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import PhaseBanner from './components/PhaseBanner'
import Experience from './components/Experience'
import Packages from './components/Packages'
import Oven from './components/Oven'
import Booking from './components/Booking'
import Footer from './components/Footer'
import { JabroniShrug } from './components/JabroniSVG'

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

export default function App() {
  const [is404] = useState(() => {
    // In production, this would be determined by the router
    // For single-page app, all routes resolve to home
    return false
  })

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

  if (is404) return <NotFound />

  return (
    <div style={{ background: 'var(--smoke)', minHeight: '100vh' }}>
      <Nav />
      <main>
        <Hero />
        <PhaseBanner />
        <SectionDivider />
        <Packages />
        <SectionDivider />
        <Oven />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Booking />
      </main>
      <Footer />
    </div>
  )
}
