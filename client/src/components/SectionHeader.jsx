import { JabroniIcon } from './JabroniSVG'

/**
 * SectionHeader — shared scaffold for section intros.
 *
 * Every primary section repeats the same rhythm:
 *   fire-rule kicker (left/right text, mascot in the middle)
 *   eyebrow label
 *   <h2> with an italic ember-glow accent
 *   3-line Cormorant intro paragraph
 *
 * Pulling that into one component keeps rhythm consistent and means a future
 * tweak to e.g. the fire-rule spacing happens in one place, not five.
 *
 * Props:
 *   kicker:  { left, right }     — the two halves of the fire-rule line
 *   eyebrow: string              — small mono label above the headline
 *   title:   string              — the headline up to the italic accent
 *   accent:  string              — the italic ember-glow continuation of the headline
 *   body:    string              — paragraph beneath the headline
 *   align:   'left' | 'center'   — alignment for the whole block (default 'left')
 *   maxWidth: string             — body paragraph max-width (default '560px')
 *   bodyTone: 'default' | 'gold' — whether the body uses bone or gold-light copy
 *   bottomMargin: string         — override for the trailing margin
 *   children:                    — optional extra nodes appended after the body
 */
export default function SectionHeader({
  kicker = { left: '', right: '' },
  eyebrow,
  title,
  accent,
  body,
  align = 'left',
  maxWidth = '560px',
  bodyTone = 'default',
  bottomMargin = '48px',
  children,
}) {
  const isCenter = align === 'center'

  return (
    <div style={{ marginBottom: bottomMargin }}>
      {/* Fire-rule kicker */}
      {(kicker.left || kicker.right) && (
        <div
          className="fire-rule reveal"
          style={{
            marginBottom: '32px',
            justifyContent: isCenter ? 'center' : 'flex-start',
          }}
        >
          {kicker.left && <span>{kicker.left}</span>}
          <JabroniIcon style={{ width: '24px', height: '24px', color: 'var(--ember)', flexShrink: 0 }} />
          {kicker.right && <span>{kicker.right}</span>}
        </div>
      )}

      {/* Eyebrow */}
      {eyebrow && (
        <div className="reveal reveal-delay-1" style={{ marginBottom: '8px', textAlign: isCenter ? 'center' : 'left' }}>
          <span className="eyebrow">{eyebrow}</span>
        </div>
      )}

      {/* Headline */}
      {(title || accent) && (
        <h2
          className="reveal reveal-delay-2"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            color: 'var(--cream)',
            margin: '12px 0 20px',
            letterSpacing: '-0.5px',
            textAlign: isCenter ? 'center' : 'left',
            lineHeight: 1.1,
          }}
        >
          {title}
          {title && accent && ' '}
          {accent && (
            <em style={{ color: 'var(--ember-glow)', fontStyle: 'italic' }}>{accent}</em>
          )}
        </h2>
      )}

      {/* Body */}
      {body && (
        <p
          className="reveal reveal-delay-2"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.1rem',
            fontWeight: 300,
            color: bodyTone === 'gold' ? 'var(--gold-light)' : 'var(--bone)',
            lineHeight: 1.75,
            maxWidth,
            margin: isCenter ? '0 auto' : 0,
            textAlign: isCenter ? 'center' : 'left',
          }}
        >
          {body}
        </p>
      )}

      {children}
    </div>
  )
}
