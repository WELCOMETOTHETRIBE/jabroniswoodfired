import { useState, useRef, useEffect } from 'react'
import { JabroniTipHat, JabroniIcon } from './JabroniSVG'

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

export default function Booking() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const sectionRef = useRef(null)
  const selectRef = useRef(null)

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

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
  }

  return (
    <section id="booking" ref={sectionRef} style={{
      background: 'var(--smoke)',
      borderTop: '2px solid var(--ember)',
      padding: '120px 0',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 48px' }}>

        {/* Section header */}
        <div className="fire-rule reveal" style={{ marginBottom: '48px' }}>
          <span>Book</span>
          <JabroniIcon style={{ width: '24px', height: '24px', color: 'var(--ember)', flexShrink: 0 }} />
          <span>Inquire</span>
        </div>

        <div className="booking-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: '80px',
          alignItems: 'start',
        }}>
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
              Fill out the form. We respond within 24 hours. No automated replies, no templates — a real conversation about your event.
            </p>

            <div className="reveal reveal-delay-3" style={{
              borderLeft: '2px solid var(--ember)',
              paddingLeft: '20px',
              marginBottom: '40px',
            }}>
              <p style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                color: 'var(--gold-light)',
                lineHeight: 1.7,
              }}>
                "We don't use gas. We never have. Every fire is wood, every smoke is real, every event leaves a mark."
              </p>
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
                {/* Name row */}
                <div className="form-row-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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

                {/* Email + Phone row */}
                <div className="form-row-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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
                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </div>

                {/* Inquiry type */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>
                    Inquiry Type <span style={{ color: 'var(--ember)' }}>*</span>
                  </label>
                  <select
                    id="inquiry-type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={`form-input${errors.type ? ' error' : ''}`}
                    ref={selectRef}
                  >
                    {INQUIRY_TYPES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.type && <span style={errorStyle}>{errors.type}</span>}
                </div>

                {/* Guest count + Date/Location */}
                <div className="form-row-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px', marginBottom: '12px' }}>
                  <FormField
                    label="Guest Count"
                    name="guests"
                    type="number"
                    value={form.guests}
                    onChange={handleChange}
                    placeholder="Approx. count"
                    min="1"
                  />
                  <FormField
                    label="Event Date & Location"
                    name="dateLocation"
                    value={form.dateLocation}
                    onChange={handleChange}
                    placeholder="Date + city or venue"
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about the event. The fire is already lit."
                    rows={5}
                    className="form-input"
                    style={{ resize: 'vertical', minHeight: '120px', lineHeight: 1.6 }}
                  />
                </div>

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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    fontSize: '13px',
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
                  fontSize: '9px',
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

      <style>{`
        @media (max-width: 860px) {
          #booking { padding: 80px 0 !important; }
          #booking > div { padding: 0 24px !important; }
          #booking .booking-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          #booking .form-row-2col,
          #booking .form-row-3col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
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
  return (
    <div>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: 'var(--ember)' }}> *</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input${error ? ' error' : ''}`}
        min={min}
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
