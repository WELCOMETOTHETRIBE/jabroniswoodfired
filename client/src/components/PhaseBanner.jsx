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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '1.5px',
          color: 'var(--bone)',
          textAlign: 'center',
          margin: 0,
        }}>
          Block parties · Graduations · Small weddings — Coachella Valley &amp; South Bay LA
        </p>
        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          color: 'var(--bone)',
          opacity: 0.6,
          textAlign: 'center',
          margin: 0,
          letterSpacing: '0.3px',
        }}>
          Pitmaster's Pride · Nonna's Ransom · Holy Smoke · Calabrian Slaw · Campfire Caruso
        </p>
      </div>

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
