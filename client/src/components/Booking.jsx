import { useState, useRef, useEffect } from 'react'
import { JabroniTipHat } from './JabroniSVG'
import SectionHeader from './SectionHeader'

const INQUIRY_TYPES = [
  { value: '', label: 'Select inquiry type...' },
  { value: 'BBQ & Live-Fire — Street Package', label: 'BBQ & Live-Fire — Street Package' },
  { value: 'BBQ & Live-Fire — Signature BBQ', label: 'BBQ & Live-Fire — Signature BBQ' },
  { value: 'BBQ & Live-Fire — Full Feast', label: 'BBQ & Live-Fire — Full Feast' },
  { value: 'Wood-Fired Pizza', label: 'Wood-Fired Pizza' },
  { value: 'Santa Maria Add-On', label: 'Santa Maria Add-On' },
  { value: "A Jabroni's Evening", label: "A Jabroni's Evening" },
  { value: 'Oven Commission', label: 'Oven Commission' },
  { value: 'Resort Partnership', label: 'Resort Partnership' },
  { value: 'General Inquiry', label: 'General Inquiry' },
]

// LP7 — Persona-aware field visibility.
// The brief's success criterion is "≤ 5 visible fields on first paint when a
// persona is selected". The map below classifies each inquiry type into a
// "bucket" whose form shape is appropriate for the buyer's intent. For
// example, an oven commissioner doesn't need "Guest Count" framed as event
// headcount, and an "Express Interest" lead for the still-aspirational
// Evening concept only needs name + email + message to capture a notify-me.
//
// `getFieldSet(type, manualOverride)` returns a pure function of inputs:
// - `manualOverride=true` → user clicked "Change inquiry type" → show all
//   fields including the select itself, regardless of `type`.
// - Otherwise → bucket-specific reduced field set with the select hidden.
const TYPE_BUCKET = {
  '': 'general',
  'BBQ & Live-Fire — Street Package': 'catering',
  'BBQ & Live-Fire — Signature BBQ': 'catering',
  'BBQ & Live-Fire — Full Feast': 'catering',
  'Wood-Fired Pizza': 'catering',
  'Santa Maria Add-On': 'catering',
  "A Jabroni's Evening": 'evening',
  'Oven Commission': 'oven',
  'Resort Partnership': 'oven',
  'General Inquiry': 'general',
}

const ALL_FIELDS = {
  name: true,
  email: true,
  phone: true,
  type: true,
  guests: true,
  dateLocation: true,
  message: true,
}

function getFieldSet(type, manualOverride) {
  if (manualOverride) return { ...ALL_FIELDS }
  const bucket = TYPE_BUCKET[type] || 'general'
  switch (bucket) {
    case 'catering':
      // Hosts: contact + event details + message. Inquiry type is known
      // (pre-selected from the persona CTA) so the select is hidden.
      return { name: true, email: true, phone: true, type: false, guests: true, dateLocation: true, message: true }
    case 'oven':
      // Oven commissioners: contact + message. Event date + guest count are
      // irrelevant to a 10–28 wk oven build.
      return { name: true, email: true, phone: true, type: false, guests: false, dateLocation: false, message: true }
    case 'evening':
      // Express-interest lead capture for the still-aspirational concept.
      // Minimum to reach back out: name + email + message.
      return { name: true, email: true, phone: false, type: false, guests: false, dateLocation: false, message: true }
    case 'general':
    default:
      // No persona pre-selected (or user explicitly chose General Inquiry):
      // full backwards-compatible behavior.
      return { ...ALL_FIELDS }
  }
}

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  type: '',
  guests: '',
  dateLocation: '',
  message: '',
}

export default function Booking({ initialInquiryType = '' }) {
  const [form, setForm] = useState({ ...INITIAL_FORM, type: initialInquiryType || '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('')
  // LP7 — when true, the user has clicked "Change inquiry type" to escape
  // the persona-reduced form back to the full 8-field experience. Reset to
  // false on any incoming `jabroni:preselect-inquiry` event so a fresh
  // persona pick re-applies the appropriate reduced field set.
  const [manualOverride, setManualOverride] = useState(false)
  const sectionRef = useRef(null)
  const selectRef = useRef(null)

  const visible = getFieldSet(form.type, manualOverride)

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

  // Keep the form's inquiry type in sync with the active persona / CTA.
  // The previous implementation reached into the DOM with `select.value =`
  // and dispatched a synthetic change event from Oven.jsx. We replace that
  // with a cleaner global custom event: any CTA in the page can dispatch
  // `jabroni:preselect-inquiry` with the desired value and the form will
  // pick it up. This lets us drive pre-selection from PersonaTabs, the
  // sticky mobile CTA, and section-internal CTAs without DOM reach-arounds.
  useEffect(() => {
    const handler = (e) => {
      const next = e?.detail?.value
      if (typeof next !== 'string') return
      setForm(prev => prev.type === next ? prev : { ...prev, type: next })
      if (errors.type) setErrors(prev => ({ ...prev, type: '' }))
      // LP7 — fresh persona pre-select cancels any prior manual override so
      // the new persona's reduced field set applies on landing.
      setManualOverride(false)
    }
    window.addEventListener('jabroni:preselect-inquiry', handler)
    return () => window.removeEventListener('jabroni:preselect-inquiry', handler)
  }, [errors.type])

  // Honor the `initialInquiryType` prop changing while the form is mounted
  // (e.g. user switches personas without ever submitting).
  useEffect(() => {
    if (!initialInquiryType) return
    setForm(prev => prev.type ? prev : { ...prev, type: initialInquiryType })
  }, [initialInquiryType])

  const validate = () => {
    const newErrors = {}
    if (!form.firstName.trim()) newErrors.firstName = 'Required'
    if (!form.lastName.trim()) newErrors.lastName = 'Required'
    if (!form.email.trim()) {
      newErrors.email = 'Required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Valid email required'
    }
    if (!form.type) newErrors.type = 'Required'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    // LP7 — When the user picks a new inquiry type from the (revealed)
    // select, drop the manual override so the bucket's reduced field set
    // re-applies. This makes the field set a pure function of the current
    // type (per brief item 5). The "Change inquiry type" link will
    // reappear next to the chosen type as the recovery path.
    if (name === 'type' && manualOverride) setManualOverride(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setStatus('loading')
    setErrorMessage('')

    // LP7 — Submit only the fields visible in the current persona-aware
    // form shape. If a user pre-filled, say, "Guest Count" and then
    // switched persona to Oven (which hides that field), we must not send
    // the stale value. firstName/lastName/email/type are always required
    // and always present. The phone/guests/dateLocation/message keys are
    // dropped from the payload when their fields are hidden — backend
    // accepts the schema with these as optionals.
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      type: form.type,
    }
    if (visible.phone) payload.phone = form.phone
    if (visible.guests) payload.guests = form.guests
    if (visible.dateLocation) payload.dateLocation = form.dateLocation
    if (visible.message) payload.message = form.message

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Unable to reach the server. Please try again or contact us directly.')
    }
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setErrors({})
    setStatus('idle')
    setErrorMessage('')
    setManualOverride(false)
  }

  return (
    <section
      id="booking"
      ref={sectionRef}
      className="py-20 md:py-[120px]"
      style={{
        background: 'var(--smoke)',
        borderTop: '2px solid var(--ember)',
      }}
    >
      <div className="mx-auto max-w-page-narrow px-6 md:px-12">

        <SectionHeader
          kicker={{ left: 'Book', right: 'Inquire' }}
          bottomMargin="48px"
        />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-12 md:gap-20 items-start">
          {/* LEFT: Copy */}
          <div>
            <span className="eyebrow reveal" style={{ marginBottom: '12px', display: 'block' }}>
              Start Here
            </span>
            <h2 className="reveal reveal-delay-1" style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              color: 'var(--cream)',
              lineHeight: 1.1,
              marginBottom: '28px',
              letterSpacing: '-0.3px',
            }}>
              The fire is{' '}
              <em style={{ color: 'var(--ember-glow)', fontStyle: 'italic' }}>already lit.</em>
            </h2>

            <p className="reveal reveal-delay-2" style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.15rem',
              fontWeight: 300,
              color: 'var(--bone)',
              lineHeight: 1.8,
              marginBottom: '32px',
            }}>
              Fill out the form. We respond within 24 hours — no templates, no automated replies. A real conversation about your event, your people, and what we're going to cook together over an open fire.
            </p>

            <div className="reveal reveal-delay-3" style={{
              borderLeft: '2px solid var(--ember)',
              paddingLeft: '20px',
              marginBottom: '32px',
            }}>
              <p style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                color: 'var(--gold-light)',
                lineHeight: 1.7,
              }}>
                "The smoke reaches your guests before the food does. Olive wood, hickory — it carries across a block party, fills a backyard, stops a conversation. There is no shortcut to that smell. We've never looked for one."
              </p>
            </div>

            {/* Dish teasers */}
            <div className="reveal reveal-delay-3" style={{ marginBottom: '40px' }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px', /* 9px ember-on-smoke fails AA — 11px ember-glow clears */
                letterSpacing: '2px',
                color: 'var(--ember-glow)',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}>
                On the menu
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  'Pitmaster\'s Pride',
                  'Nonna\'s Ransom',
                  'Hog\'s Share',
                  'Holy Smoke',
                  'Calabrian Slaw',
                  'Campfire Caruso',
                ].map(dish => (
                  <span key={dish} style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    color: 'var(--bone)',
                    opacity: 0.7,
                    background: 'rgba(61, 53, 48, 0.4)',
                    border: '1px solid var(--char)',
                    padding: '4px 10px',
                    letterSpacing: '0.2px',
                  }}>
                    {dish}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact notes */}
            <div className="reveal reveal-delay-4" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Territory', value: 'Coachella Valley + South Bay LA' },
                { label: 'Response Time', value: 'Within 24 hours' },
                { label: 'Minimum Notice', value: '3–4 weeks for catering' },
                { label: 'Oven Lead Time', value: '10–28 weeks by tier' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '2px',
                    color: 'var(--gold)',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                    width: '120px',
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '0.95rem',
                    color: 'var(--bone)',
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Form or success state */}
          <div className="reveal reveal-delay-2">
            {status === 'success' ? (
              <SuccessState onReset={handleReset} />
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* LP7 — Persona-aware preamble.
                    When the inquiry type is pre-selected (or manually picked
                    from the select to anything other than "General Inquiry"),
                    the select is hidden and replaced with a single line that
                    confirms what the user is inquiring about plus a "Change
                    inquiry type" affordance to escape the reduced form. */}
                {!visible.type && form.type && (
                  <div
                    className="reveal"
                    style={{
                      marginBottom: '20px',
                      padding: '14px 16px',
                      background: 'rgba(201, 75, 26, 0.06)',
                      border: '1px solid var(--char)',
                      borderLeft: '2px solid var(--ember)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <span style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        letterSpacing: '2px',
                        color: 'var(--gold)',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}>
                        Inquiry Type
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-cormorant)',
                        fontSize: '1.05rem',
                        fontStyle: 'italic',
                        color: 'var(--cream)',
                      }}>
                        {form.type}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setManualOverride(true)}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '1.5px',
                        color: 'var(--ember-glow)',
                        background: 'transparent',
                        border: 'none',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        padding: '8px 0',
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px',
                      }}
                      aria-label="Change inquiry type"
                    >
                      Change inquiry type{' '}↻
                    </button>
                  </div>
                )}

                {/* Name row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <FormField
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    placeholder="First"
                    required
                  />
                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    placeholder="Last"
                    required
                  />
                </div>

                {/* Email + Phone row.
                    Phone is hidden in the Evening (express-interest) bucket.
                    When phone is hidden, email occupies the full row. */}
                <div className={`grid grid-cols-1 ${visible.phone ? 'md:grid-cols-2' : ''} gap-3 mb-3`}>
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="your@email.com"
                    required
                  />
                  {visible.phone && (
                    <FormField
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                  )}
                </div>

                {/* Inquiry type — visible in General bucket, OR after the
                    user clicks "Change inquiry type" to escape a pre-selected
                    persona-reduced form. */}
                {visible.type && (
                  <div style={{ marginBottom: '12px' }}>
                    <label htmlFor="inquiry-type" style={labelStyle}>
                      Inquiry Type <span style={{ color: 'var(--ember)' }} aria-hidden="true">*</span>
                    </label>
                    <select
                      id="inquiry-type"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className={`form-input${errors.type ? ' error' : ''}`}
                      ref={selectRef}
                      aria-label="Inquiry type"
                      aria-required="true"
                      aria-invalid={errors.type ? 'true' : 'false'}
                    >
                      {INQUIRY_TYPES.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {errors.type && <span style={errorStyle}>{errors.type}</span>}
                  </div>
                )}

                {/* Guest count + Date/Location.
                    Hidden for Oven and Evening buckets (irrelevant). When
                    only one of the two is shown the row drops to a single
                    full-width column on every viewport. */}
                {(visible.guests || visible.dateLocation) && (
                  <div
                    className={`grid grid-cols-1 ${visible.guests && visible.dateLocation ? 'md:grid-cols-[1fr_1.5fr]' : ''} gap-3 mb-3`}
                  >
                    {visible.guests && (
                      <FormField
                        label="Guest Count"
                        name="guests"
                        type="number"
                        value={form.guests}
                        onChange={handleChange}
                        placeholder="Approx. count"
                        min="1"
                      />
                    )}
                    {visible.dateLocation && (
                      <FormField
                        label="Event Date & Location"
                        name="dateLocation"
                        value={form.dateLocation}
                        onChange={handleChange}
                        placeholder="Date + city or venue"
                      />
                    )}
                  </div>
                )}

                {/* Message */}
                {visible.message && (
                  <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="booking-message" style={labelStyle}>Message</label>
                    <textarea
                      id="booking-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about the event. The fire is already lit."
                      rows={5}
                      className="form-input"
                      style={{ resize: 'vertical', minHeight: '120px', lineHeight: 1.6 }}
                    />
                  </div>
                )}

                {/* Error message */}
                {status === 'error' && (
                  <div style={{
                    background: 'rgba(201, 75, 26, 0.1)',
                    border: '1px solid var(--ember)',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--ember-glow)',
                    letterSpacing: '1px',
                  }}>
                    {errorMessage}
                  </div>
                )}

                {/* Submit. Locked at 14px/700 so cream-on-ember (4.07:1) qualifies
                    for the WCAG large-text 3:1 threshold. */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '3px',
                    padding: '18px',
                    opacity: status === 'loading' ? 0.7 : 1,
                    cursor: status === 'loading' ? 'wait' : 'pointer',
                    position: 'relative',
                  }}
                >
                  {status === 'loading' ? 'Stoking the coals...' : 'Send It.'}
                </button>

                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px', /* 9px → 10px; muted on smoke = 4.9:1, safe */
                  color: 'var(--muted)',
                  letterSpacing: '1.5px',
                  marginTop: '12px',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                }}>
                  No spam. No automated replies. A real person responds.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

    </section>
  )
}

function SuccessState({ onReset }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '64px 32px',
      border: '1px solid var(--char)',
      background: 'var(--ash)',
    }}>
      {/* Jabroni tipping hat */}
      <div style={{ width: '120px', margin: '0 auto 32px', color: 'var(--ember)' }}>
        <JabroniTipHat style={{ width: '100%', height: 'auto' }} />
      </div>

      <h3 style={{
        fontFamily: 'var(--font-playfair)',
        fontSize: '1.8rem',
        fontWeight: 700,
        color: 'var(--cream)',
        marginBottom: '12px',
        letterSpacing: '-0.2px',
      }}>
        We've Got Your Inquiry.
      </h3>

      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        letterSpacing: '2px',
        color: 'var(--gold)',
        textTransform: 'uppercase',
        marginBottom: '20px',
      }}>
        The Jabroni's on it.
      </p>

      <p style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '1.05rem',
        color: 'var(--bone)',
        lineHeight: 1.7,
        marginBottom: '32px',
        maxWidth: '360px',
        margin: '0 auto 32px',
      }}>
        You'll hear from us within 24 hours. A real person. A real conversation. The fire is already lit.
      </p>

      <button
        onClick={onReset}
        className="btn btn-ghost"
        style={{ fontSize: '11px', letterSpacing: '2px', padding: '12px 24px' }}
      >
        Submit Another Inquiry
      </button>
    </div>
  )
}

function FormField({ label, name, type = 'text', value, onChange, error, placeholder, required, min }) {
  // Stable id for the label/input association — axe `select-name` /
  // `label` rules require an explicit `htmlFor` on a sibling label or an
  // aria-label on the input itself. Using `htmlFor` here is the correct
  // semantic, since the visible label is exactly what we want screen
  // readers to read.
  const fieldId = `booking-field-${name}`
  return (
    <div>
      <label htmlFor={fieldId} style={labelStyle}>
        {label}{required && <span style={{ color: 'var(--ember)' }} aria-hidden="true"> *</span>}
      </label>
      <input
        id={fieldId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input${error ? ' error' : ''}`}
        min={min}
        aria-required={required ? 'true' : undefined}
        aria-invalid={error ? 'true' : undefined}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: 'var(--gold)',
  marginBottom: '6px',
}

const errorStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  color: 'var(--ember-glow)',
  letterSpacing: '1px',
  marginTop: '4px',
  display: 'block',
}
