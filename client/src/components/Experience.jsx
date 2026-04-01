import { useEffect, useRef } from 'react'
import { JabroniIcon } from './JabroniSVG'

function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )
    const elements = ref.current.querySelectorAll('.reveal')
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

const cast = [
  {
    role: 'The Femme Fatale',
    description: 'She arrives before the fire does. By the end of the night, your guests won\'t remember what they ate — only her. That\'s the point.',
  },
  {
    role: 'The Consigliere',
    description: 'Every table gets a visit. Every glass stays full. He knows your name before you introduce yourself, and he never explains how.',
  },
  {
    role: 'The Pit Boss',
    description: 'Commands the fire like a negotiation he\'s already won. The smoke doesn\'t follow the wind. It follows him.',
  },
  {
    role: 'The Racketeer',
    description: 'Works the room like it owes him something. Cards, sleight of hand, conversation — never caught, and your guests will love him for it.',
  },
  {
    role: 'The Chanteuse',
    description: 'No mic. No stage. Just a voice that stops the room mid-sentence and makes everyone feel like the evening was written for them personally.',
  },
]

export default function Experience() {
  const sectionRef = useRef(null)
  useReveal(sectionRef)

  const scrollToBooking = (e) => {
    e.preventDefault()
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToPackages = (e) => {
    e.preventDefault()
    document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        background: 'var(--stage)',
        borderTop: '2px solid var(--ember)',
        borderBottom: '2px solid var(--ember)',
        position: 'relative',
        overflow: 'hidden',
        padding: '120px 0',
      }}
    >
      {/* Left curtain */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, bottom: 0, width: '120px',
        background: 'linear-gradient(to right, var(--curtain), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Right curtain */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0, width: '120px',
        background: 'linear-gradient(to left, var(--curtain), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(201, 75, 26, 0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: '1100px', margin: '0 auto',
        padding: '0 48px', textAlign: 'center',
      }}>

        {/* Section divider */}
        <div className="fire-rule reveal" style={{ marginBottom: '64px', justifyContent: 'center' }}>
          <span>Coming Soon</span>
          <JabroniIcon style={{ width: '28px', height: '28px', color: 'var(--ember)', flexShrink: 0 }} />
          <span>A Look Ahead</span>
        </div>

        {/* Eyebrow */}
        <div className="reveal reveal-delay-1" style={{ marginBottom: '12px' }}>
          <span className="eyebrow">A Look Ahead · Coming Soon</span>
        </div>

        {/* Headline */}
        <h2 className="reveal reveal-delay-2" style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 900,
          fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
          color: 'var(--cream)',
          marginBottom: '16px',
          lineHeight: 1.05,
          letterSpacing: '-0.5px',
        }}>
          A Jabroni's{' '}
          <em style={{ color: 'var(--ember-glow)', fontStyle: 'italic' }}>Evening</em>
        </h2>

        <p className="reveal reveal-delay-3" style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
          fontWeight: 300,
          color: 'var(--gold-light)',
          marginBottom: '32px',
          letterSpacing: '0.5px',
          fontStyle: 'italic',
        }}>
          This is not dinner and a show. This is dinner as the show.
        </p>

        {/* Look-ahead notice */}
        <div className="reveal reveal-delay-3" style={{
          display: 'inline-block',
          marginBottom: '48px',
          padding: '12px 24px',
          border: '1px solid var(--char)',
          background: 'rgba(201, 75, 26, 0.05)',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '2px',
            color: 'var(--bone)',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            This concept is in development — we're building toward it. Catering &amp; ovens are available now.
          </p>
        </div>

        {/* Body copy — prose form, left-aligned narrow column */}
        <div className="reveal reveal-delay-4" style={{
          maxWidth: '680px',
          margin: '0 auto 80px',
          textAlign: 'left',
        }}>
          {[
            'From the moment the fire is lit, the cast is working.',
            'Between courses, the Femme Fatale owns the room. Not a stage — the room. Your guests are the audience, the backdrop, and occasionally the act.',
            'The Racketeer never announces himself. He takes the table next to yours.',
            'Every element is choreographed to the meal. As the oven peaks, the room peaks with it. Course by course, act by act — until Pitmaster\'s Pride hits the board and Nonna\'s Ransom comes out of the fire, and the whole thing lands exactly where it was always going.',
            'You will not find this anywhere else in Southern California.',
          ].map((para, i) => (
            <p key={i} style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
              fontWeight: i === 4 ? 600 : 400,
              fontStyle: i === 4 ? 'italic' : 'normal',
              color: i === 4 ? 'var(--gold-light)' : 'var(--bone)',
              lineHeight: 1.85,
              letterSpacing: '0.2px',
              marginBottom: i < 4 ? '24px' : '0',
            }}>
              {para}
            </p>
          ))}
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'var(--muted)',
            marginTop: '20px',
            letterSpacing: '0.5px',
            lineHeight: 1.6,
          }}>
            That's the point.
          </p>
        </div>

        {/* Fire rule */}
        <div className="fire-rule reveal" style={{ marginBottom: '80px' }}>
          <span>The Cast</span>
        </div>

        {/* Cast grid — 5 members */}
        <div className="reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '2px',
          marginBottom: '80px',
        }}>
          {cast.map((member, i) => {
            const isMid = i === 2
            return (
              <div
                key={member.role}
                style={{
                  padding: '32px 24px',
                  background: isMid ? 'var(--ash)' : 'rgba(45, 41, 37, 0.4)',
                  borderTop: isMid ? '2px solid var(--ember)' : '1px solid var(--char)',
                  borderBottom: isMid ? '2px solid var(--ember)' : 'none',
                  transition: 'background 0.3s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--ash)'}
                onMouseLeave={e => e.currentTarget.style.background = isMid ? 'var(--ash)' : 'rgba(45, 41, 37, 0.4)'}
              >
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '3px',
                  color: 'var(--gold)',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--cream)',
                  marginBottom: '14px',
                  letterSpacing: '-0.2px',
                  lineHeight: 1.2,
                }}>
                  {member.role}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '0.95rem',
                  fontWeight: 300,
                  color: 'var(--bone)',
                  lineHeight: 1.75,
                }}>
                  {member.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Pricing block */}
        <div className="reveal" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '48px',
          flexWrap: 'wrap',
          marginBottom: '48px',
          padding: '32px 40px',
          border: '1px solid var(--char)',
          background: 'rgba(15, 13, 11, 0.5)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: '3.2rem',
              color: 'var(--cream)',
              letterSpacing: '2px',
              lineHeight: 1,
            }}>
              $300
            </div>
            <div className="eyebrow" style={{ marginTop: '6px', opacity: 0.7 }}>per head</div>
          </div>
          <div style={{ width: '1px', height: '48px', background: 'var(--char)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: '3.2rem',
              color: 'var(--cream)',
              letterSpacing: '2px',
              lineHeight: 1,
            }}>
              40
            </div>
            <div className="eyebrow" style={{ marginTop: '6px', opacity: 0.7 }}>minimum guests</div>
          </div>
          <div style={{ width: '1px', height: '48px', background: 'var(--char)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--cream)',
              lineHeight: 1.3,
            }}>
              Custom scripted
            </div>
            <div className="eyebrow" style={{ marginTop: '6px', opacity: 0.7 }}>to your event & venue</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="reveal" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#booking"
            onClick={scrollToBooking}
            className="btn btn-ghost"
            style={{ fontSize: '12px', letterSpacing: '2px', padding: '16px 32px' }}
          >
            Express Interest
          </a>
          <a
            href="#packages"
            onClick={scrollToPackages}
            className="btn btn-primary"
            style={{ fontSize: '12px', letterSpacing: '2px', padding: '16px 32px' }}
          >
            Book Catering Now →
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #experience [style*="repeat(5, 1fr)"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 860px) {
          #experience [style*="repeat(5, 1fr)"],
          #experience [style*="repeat(3, 1fr)"] {
            grid-template-columns: 1fr 1fr !important;
          }
          #experience [style*="padding: '0 48px'"] {
            padding: 0 24px !important;
          }
        }
        @media (max-width: 480px) {
          #experience [style*="repeat(5, 1fr)"],
          #experience [style*="repeat(3, 1fr)"],
          #experience [style*="1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
