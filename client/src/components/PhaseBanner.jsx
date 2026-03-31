export default function PhaseBanner() {
  return (
    <div style={{
      background: 'var(--ash)',
      borderTop: '1px solid var(--char)',
      borderBottom: '1px solid var(--char)',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      flexWrap: 'wrap',
    }}>
      {/* Live booking indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          display: 'inline-block',
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: 'var(--gold)',
          animation: 'pulseDot 2.5s ease-in-out infinite',
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          whiteSpace: 'nowrap',
        }}>
          Now Booking
        </span>
      </div>

      <span style={{ color: 'var(--char)', fontSize: '14px', flexShrink: 0 }}>·</span>

      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '1.5px',
        color: 'var(--bone)',
        textAlign: 'center',
        margin: 0,
      }}>
        Live-fire catering in the Coachella Valley and South Bay LA
        <span style={{ color: 'var(--char)', margin: '0 10px' }}>·</span>
        Wood-fired pizza, A Jabroni's Evening &amp; oven commissions — inquire for availability
      </p>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
        @media (max-width: 700px) {
          #phase-banner { flex-direction: column; gap: 8px; text-align: center; }
        }
      `}</style>
    </div>
  )
}
