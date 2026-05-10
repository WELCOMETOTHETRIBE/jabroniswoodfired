import { useEffect, useRef } from 'react'

/**
 * PersonaTabs — top-level intent switcher under the Hero.
 *
 * The homepage serves three buyers (event hosts, oven commissioners, the
 * performance-dining curious). Rather than stack three sets of decorative
 * chrome in one long scroll, we let the user pick their lane and only show
 * what's relevant to it. The previous "everything for everyone, top to
 * bottom" layout is still available via the long-scroll disclosure at the
 * bottom of each lane.
 *
 * Status labels (Bookable now / 10–28 wk lead / Coming soon) make the
 * "what can I actually buy today" question answerable in one glance.
 *
 * The strip is sticky on mobile (under the fixed Nav) so the user can swap
 * intent at any scroll depth without scrolling back to the hero.
 *
 * Accessibility:
 *   - role="tablist" / role="tab" / role="tabpanel"
 *   - Arrow-key navigation (ArrowLeft/ArrowRight, Home/End)
 *   - aria-selected, aria-controls, tabIndex management
 */

export const PERSONAS = [
  {
    id: 'catering',
    label: 'Catering',
    status: 'Bookable now',
    statusTone: 'live',
  },
  {
    id: 'ovens',
    label: 'Ovens',
    status: '10–28 wk lead',
    statusTone: 'lead',
  },
  {
    id: 'evening',
    label: 'The Evening',
    status: 'Coming soon',
    statusTone: 'soon',
  },
]

const STATUS_COLOR = {
  live: 'var(--gold)',     // dot + text — actively bookable
  lead: 'var(--bone)',     // commission queue, real but slow
  soon: 'var(--muted)',    // aspirational
}

export default function PersonaTabs({ active, onChange }) {
  const stripRef = useRef(null)
  const tabRefs = useRef({})

  // Keyboard nav across the tab strip — left/right arrows cycle through
  // tabs; Home/End jump to first/last; the tab itself is activated on focus
  // (this matches the most common pattern for "automatic activation" tabs,
  // since switching is cheap here and there's no async cost).
  const handleKeyDown = (e) => {
    const idx = PERSONAS.findIndex(p => p.id === active)
    if (idx < 0) return

    let nextIdx = null
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % PERSONAS.length
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + PERSONAS.length) % PERSONAS.length
    else if (e.key === 'Home') nextIdx = 0
    else if (e.key === 'End') nextIdx = PERSONAS.length - 1

    if (nextIdx !== null) {
      e.preventDefault()
      const nextId = PERSONAS[nextIdx].id
      onChange(nextId)
      // Defer focus to next paint so React has rendered the updated tabIndex
      requestAnimationFrame(() => {
        tabRefs.current[nextId]?.focus()
      })
    }
  }

  return (
    <div className="persona-tab-strip" role="navigation" aria-label="Service personas">
      <div
        ref={stripRef}
        role="tablist"
        aria-label="Choose your path"
        onKeyDown={handleKeyDown}
        className="mx-auto max-w-page flex gap-0 overflow-x-auto px-4 sm:px-8"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {PERSONAS.map(persona => {
          const isActive = active === persona.id
          return (
            <button
              key={persona.id}
              ref={el => { tabRefs.current[persona.id] = el }}
              role="tab"
              id={`persona-tab-${persona.id}`}
              aria-selected={isActive}
              aria-controls={`persona-panel-${persona.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(persona.id)}
              /* Responsive padding/gap: tighter below sm, wider above.
                 11px text + 1.5px tracking on mobile vs 11px + 2px on desktop. */
              className="flex items-center whitespace-nowrap shrink-0 cursor-pointer uppercase text-[11px] tracking-[1.5px] sm:tracking-[2px] gap-2 sm:gap-3 px-[14px] py-[14px] sm:px-5 sm:py-4 transition-[color,border-color,opacity] duration-200"
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--ember)' : '2px solid transparent',
                marginBottom: '-1px',
                minHeight: '48px',
                fontFamily: 'var(--font-mono)',
                color: isActive ? 'var(--ember-glow)' : 'var(--bone)',
                opacity: isActive ? 1 : 0.7,
              }}
            >
              <span>{persona.label}</span>
              <span className="flex items-center gap-1.5">
                {persona.statusTone === 'live' && (
                  <span
                    aria-hidden="true"
                    className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: STATUS_COLOR.live }}
                  />
                )}
                <span
                  className="text-[9px] sm:text-[10px] tracking-[1px] sm:tracking-[1.5px] uppercase"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: STATUS_COLOR[persona.statusTone],
                    opacity: isActive ? 1 : 0.9,
                  }}
                >
                  {persona.status}
                </span>
              </span>
            </button>
          )
        })}
      </div>
      {/* Scrollbar-hide is the only thing that has to live in CSS — Tailwind
          doesn't ship a `scrollbar-none` utility out of the box. */}
      <style>{`
        .persona-tab-strip [role="tablist"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}

// Mapping: which inquiry-type value should pre-select in the form for each persona.
// Used by the Booking section to read the current persona on mount and via the
// global `jabroni:preselect-inquiry` custom event when CTAs fire.
export const PERSONA_TO_INQUIRY = {
  catering: 'BBQ & Live-Fire — Signature BBQ',
  ovens: 'Oven Commission',
  evening: "A Jabroni's Evening",
}

// Persona-aware label + href for the primary CTA (used in Nav and the sticky
// mobile bottom bar).
export const PERSONA_CTA = {
  catering: { label: 'Book Catering', inquiryType: 'BBQ & Live-Fire — Signature BBQ' },
  ovens: { label: 'Commission an Oven', inquiryType: 'Oven Commission' },
  evening: { label: 'Express Interest', inquiryType: "A Jabroni's Evening" },
}
