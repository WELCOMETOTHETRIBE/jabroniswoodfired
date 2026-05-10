import { useEffect, useState } from 'react'
import { PERSONA_CTA } from './PersonaTabs'

/**
 * StickyMobileCTA — single primary CTA pinned to the bottom of the viewport
 * on mobile. Persona-aware label. Hidden when the booking form is on screen
 * (where the form's own submit button is the right CTA), and hidden on
 * desktop entirely (handled in CSS).
 *
 * The IntersectionObserver target is `#booking`. We hide as soon as any
 * portion of Booking is visible — once you're at the form, the bar is
 * just visual noise covering form fields.
 *
 * Honors `env(safe-area-inset-bottom)` via index.css — important for iOS
 * Safari where the home-indicator bar would otherwise overlap.
 */
export default function StickyMobileCTA({ persona, onClick }) {
  const [hidden, setHidden] = useState(false)

  // Watch the booking section. When it scrolls into view, hide the sticky CTA
  // so the user can interact with the form unobstructed.
  useEffect(() => {
    const target = document.querySelector('#booking')
    if (!target) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // Hide if even a sliver of the booking section is on screen
          setHidden(entry.isIntersecting)
        })
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  // Tell the body it has a sticky CTA so the bottom margin can compensate.
  // Removed when the component unmounts (e.g. on the admin route).
  useEffect(() => {
    document.body.classList.add('has-sticky-cta')
    return () => document.body.classList.remove('has-sticky-cta')
  }, [])

  const cta = PERSONA_CTA[persona] || PERSONA_CTA.catering

  const handleClick = (e) => {
    e.preventDefault()
    onClick?.(persona)
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      className={`sticky-mobile-cta is-visible${hidden ? ' is-hidden' : ''}`}
      aria-hidden={hidden}
    >
      <a
        href="#booking"
        onClick={handleClick}
        className="btn btn-primary"
        style={{
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '2px',
          padding: '16px 20px',
          minHeight: '48px',
        }}
      >
        {cta.label} →
      </a>
    </div>
  )
}
