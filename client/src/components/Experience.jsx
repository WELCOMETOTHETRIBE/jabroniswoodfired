import { useEffect, useRef, useState } from 'react'
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
    pronunciation: 'fem fəˈtäl',
    wordType: 'French · noun',
    etymology: 'femme "woman" + fatale "deadly"',
    definition: 'A woman of irresistible charm whose presence rearranges a room without effort. Power that is ambient, not performed. She doesn\'t enter — she arrives.',
    description: 'She arrives before the fire does. By the end of the night, your guests won\'t remember what they ate — only her. That\'s the point.',
  },
  {
    role: 'The Consigliere',
    pronunciation: 'kɔnsiʎˈʎɛːre',
    wordType: 'Italian · noun',
    etymology: 'from consiglio, "counsel"',
    definition: 'Senior adviser within a traditional Italian family structure. Outranks the capo. The one person whose opinion is always sought and never ignored.',
    description: 'Every table gets a visit. Every glass stays full. He knows your name before you introduce yourself, and he never explains how.',
  },
  {
    role: 'The Pit Boss',
    pronunciation: 'pɪt · bɒs',
    wordType: 'American English · noun',
    etymology: 'originally: the casino floor supervisor who watches every hand',
    definition: 'The one who commands the fire. Reads the heat, manages the cook, answers to no one. In a casino, he watches the table. Here, he is the table.',
    description: 'Commands the fire like a negotiation he\'s already won. The smoke doesn\'t follow the wind. It follows him.',
  },
  {
    role: 'The Racketeer',
    pronunciation: 'ˌrakəˈtɪr',
    wordType: 'noun · first recorded 1928, Chicago',
    etymology: 'from racket — a scheme of dubious legitimacy',
    definition: 'One who operates with confidence, charm, and just enough misdirection. He\'s never been caught because it never looks like a scheme. It just looks like a very good evening.',
    description: 'Works the room like it owes him something. Cards, sleight of hand, conversation — never caught, and your guests will love him for it.',
  },
  {
    role: 'The Chanteuse',
    pronunciation: 'ʃɑ̃ˈtøːz',
    wordType: 'French · noun, feminine',
    etymology: 'from chanter, "to sing"',
    definition: 'A cabaret singer who inhabits a room rather than performing for it. The art form predates the microphone. The best practitioners still don\'t need one.',
    description: 'No mic. No stage. Just a voice that stops the room mid-sentence and makes everyone feel like the evening was written for them personally.',
  },
]

export default function Experience() {
  const sectionRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
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
            'The ceremony begins when the wood catches. Two hours before the first guest arrives, olive wood and hickory go into the mouth of the oven. The fire is coaxed — not rushed — until the dome glows and the brick holds its heat like a memory. This is how it has been done in our family since 1933. The meal starts here, in the silence before anyone sits down.',
            'By the time your guests arrive, the smoke has already done something to the air. It carries differently — olive wood has a sweetness to it, hickory brings the depth. People lean toward the fire without knowing why. That pull is ancient. We didn\'t invent it. We just know how to use it.',
            'Between courses, the Femme Fatale owns the room. The Racketeer is already at the table next to yours. Nobody announced him. The Chanteuse doesn\'t need a stage. Every element moves with the fire — as the oven peaks, the room peaks with it.',
            'Course by course, act by act — until Pitmaster\'s Pride hits the board and Nonna\'s Ransom comes out of the brick, and the smoke and the performance and the table full of people who didn\'t know each other three hours ago all land exactly where this was always going.',
            'Communal. Ceremonial. Unrepeatable.',
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
            const isHovered = hoveredIndex === i
            // Anchor tooltip left for first card, right for last, centered otherwise
            const tooltipAlign = i === 0
              ? { left: 0, transform: 'none' }
              : i === 4
              ? { right: 0, left: 'auto', transform: 'none' }
              : { left: '50%', transform: 'translateX(-50%)' }

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
                  position: 'relative',
                  cursor: 'default',
                }}
                onMouseEnter={() => { setHoveredIndex(i) }}
                onMouseLeave={() => { setHoveredIndex(null) }}
              >
                {/* Definition tooltip */}
                <div
                  className={`cast-tooltip${isHovered ? ' cast-tooltip--visible' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 14px)',
                    width: '268px',
                    background: 'var(--stage)',
                    border: '1px solid var(--char)',
                    borderTop: '2px solid var(--gold)',
                    padding: '18px 20px 16px',
                    zIndex: 30,
                    pointerEvents: 'none',
                    ...tooltipAlign,
                  }}
                >
                  {/* Pronunciation + type */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '8px',
                    marginBottom: '6px',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                      color: 'var(--bone)',
                      opacity: 0.7,
                      letterSpacing: '0.3px',
                    }}>
                      /{member.pronunciation}/
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '8px',
                      letterSpacing: '1.5px',
                      color: 'var(--gold)',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}>
                      {member.wordType}
                    </span>
                  </div>

                  {/* Etymology */}
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8.5px',
                    letterSpacing: '1px',
                    color: 'var(--muted)',
                    marginBottom: '10px',
                    textTransform: 'none',
                    fontStyle: 'normal',
                    lineHeight: 1.5,
                  }}>
                    {member.etymology}
                  </p>

                  {/* Divider */}
                  <div style={{ height: '1px', background: 'var(--char)', marginBottom: '10px' }} />

                  {/* Definition */}
                  <p style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '0.95rem',
                    fontWeight: 300,
                    color: 'var(--bone)',
                    lineHeight: 1.65,
                    fontStyle: 'italic',
                    margin: 0,
                  }}>
                    {member.definition}
                  </p>

                  {/* Downward arrow */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-7px',
                    left: i === 0 ? '28px' : i === 4 ? 'auto' : '50%',
                    right: i === 4 ? '28px' : 'auto',
                    transform: (i === 0 || i === 4) ? 'none' : 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '7px solid transparent',
                    borderRight: '7px solid transparent',
                    borderTop: '7px solid var(--char)',
                  }} />
                </div>

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
        .cast-tooltip {
          opacity: 0;
          transform: translateX(var(--tt-x, -50%)) translateY(6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .cast-tooltip[style*="left: 0"] {
          --tt-x: 0px;
          transform: translateY(6px);
        }
        .cast-tooltip[style*="right: 0"] {
          transform: translateY(6px);
        }
        .cast-tooltip--visible {
          opacity: 1;
        }
        .cast-tooltip--visible[style*="left: 0"],
        .cast-tooltip--visible[style*="right: 0"] {
          transform: translateY(0);
        }
        .cast-tooltip--visible:not([style*="left: 0"]):not([style*="right: 0"]) {
          transform: translateX(-50%) translateY(0);
        }
        @media (max-width: 860px) {
          .cast-tooltip { display: none !important; }
        }
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
