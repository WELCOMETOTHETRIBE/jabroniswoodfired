/**
 * The Jabroni — Mascot SVG Components
 * A 1930s Italian-American crime boss in a suit, fedora, and cigar.
 * Used throughout the site as accents, dividers, and dramatic moments.
 */

// Full Jabroni — facing right, regal posture
export function JabroniMascot({ className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 280"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Suit body */}
      <rect x="52" y="155" width="96" height="110" rx="0" fill="currentColor" />
      {/* Lapels */}
      <polygon points="100,165 80,155 90,200" fill="#1a1714" opacity="0.5" />
      <polygon points="100,165 120,155 110,200" fill="#1a1714" opacity="0.5" />
      {/* Tie */}
      <polygon points="100,170 95,185 100,220 105,185" fill="#C94B1A" />
      {/* Shirt */}
      <rect x="93" y="165" width="14" height="35" fill="#F5EFE4" opacity="0.9" />
      {/* Pocket square */}
      <polygon points="115,165 122,165 120,172 112,170" fill="#C9952A" />

      {/* Left arm */}
      <rect x="28" y="158" width="26" height="72" rx="0" fill="currentColor" transform="rotate(-8 41 194)" />
      {/* Right arm */}
      <rect x="146" y="158" width="26" height="72" rx="0" fill="currentColor" transform="rotate(8 159 194)" />
      {/* Left hand */}
      <ellipse cx="32" cy="228" rx="12" ry="10" fill="#C9952A" opacity="0.9" />
      {/* Right hand - holding cigar */}
      <ellipse cx="168" cy="228" rx="12" ry="10" fill="#C9952A" opacity="0.9" />

      {/* Cigar */}
      <rect x="170" y="222" width="28" height="5" rx="2" fill="#8B6914" />
      <rect x="195" y="221" width="6" height="7" rx="1" fill="#C94B1A" opacity="0.8" />
      {/* Cigar smoke */}
      <path d="M198 218 Q202 212 198 206 Q202 200 198 194" stroke="#3D3530" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* Neck */}
      <rect x="86" y="128" width="28" height="32" rx="0" fill="#C9952A" opacity="0.85" />

      {/* Pig Head */}
      <ellipse cx="100" cy="115" rx="46" ry="42" fill="#C9952A" opacity="0.9" />

      {/* Snout */}
      <ellipse cx="100" cy="126" rx="18" ry="13" fill="#B8824A" opacity="0.9" />
      {/* Nostrils */}
      <ellipse cx="93" cy="126" rx="5" ry="5" fill="#7A4A20" />
      <ellipse cx="107" cy="126" rx="5" ry="5" fill="#7A4A20" />

      {/* Eyes */}
      <ellipse cx="82" cy="107" rx="8" ry="8" fill="#1A1714" />
      <ellipse cx="118" cy="107" rx="8" ry="8" fill="#1A1714" />
      <ellipse cx="84" cy="105" rx="2.5" ry="2.5" fill="#F5EFE4" />
      <ellipse cx="120" cy="105" rx="2.5" ry="2.5" fill="#F5EFE4" />

      {/* Ears */}
      <ellipse cx="58" cy="96" rx="14" ry="16" fill="#C9952A" opacity="0.85" />
      <ellipse cx="142" cy="96" rx="14" ry="16" fill="#C9952A" opacity="0.85" />
      <ellipse cx="58" cy="96" rx="8" ry="10" fill="#B8824A" opacity="0.6" />
      <ellipse cx="142" cy="96" rx="8" ry="10" fill="#B8824A" opacity="0.6" />

      {/* Eyebrows — stern */}
      <rect x="74" y="96" width="18" height="3" rx="1" fill="#1A1714" transform="rotate(-8 83 97.5)" />
      <rect x="108" y="96" width="18" height="3" rx="1" fill="#1A1714" transform="rotate(8 117 97.5)" />

      {/* Fedora brim */}
      <ellipse cx="100" cy="76" rx="58" ry="10" fill="#1A1714" />
      {/* Fedora crown */}
      <path d="M55 76 Q58 40 100 38 Q142 40 145 76" fill="#1A1714" />
      {/* Fedora band */}
      <rect x="54" y="70" width="92" height="8" rx="0" fill="#C94B1A" opacity="0.8" />
      {/* Fedora indent */}
      <path d="M78 50 Q100 44 122 50" stroke="#3D3530" strokeWidth="2" fill="none" opacity="0.5" />

      {/* Legs */}
      <rect x="62" y="260" width="28" height="20" rx="0" fill="#1A1714" />
      <rect x="110" y="260" width="28" height="20" rx="0" fill="#1A1714" />
      {/* Shoes */}
      <rect x="56" y="275" width="36" height="12" rx="0" fill="#0F0D0B" />
      <rect x="108" y="275" width="36" height="12" rx="0" fill="#0F0D0B" />
    </svg>
  )
}

// Jabroni silhouette — for watermarks and subtle accents
export function JabroniSilhouette({ className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 280"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Simplified silhouette shape */}
      <g fill="currentColor">
        {/* Fedora */}
        <ellipse cx="100" cy="76" rx="58" ry="10" />
        <path d="M55 76 Q58 40 100 38 Q142 40 145 76" />
        {/* Head */}
        <ellipse cx="100" cy="115" rx="46" ry="42" />
        {/* Ears */}
        <ellipse cx="58" cy="96" rx="14" ry="16" />
        <ellipse cx="142" cy="96" rx="14" ry="16" />
        {/* Neck */}
        <rect x="86" y="128" width="28" height="32" />
        {/* Body */}
        <rect x="52" y="155" width="96" height="110" />
        {/* Arms */}
        <rect x="28" y="158" width="26" height="72" transform="rotate(-8 41 194)" />
        <rect x="146" y="158" width="26" height="72" transform="rotate(8 159 194)" />
        {/* Hands */}
        <ellipse cx="32" cy="228" rx="12" ry="10" />
        <ellipse cx="168" cy="228" rx="12" ry="10" />
        {/* Cigar */}
        <rect x="170" y="222" width="30" height="5" rx="2" />
        {/* Legs */}
        <rect x="62" y="258" width="28" height="22" />
        <rect x="110" y="258" width="28" height="22" />
        <rect x="56" y="274" width="36" height="14" />
        <rect x="108" y="274" width="36" height="14" />
      </g>
    </svg>
  )
}

// Jabroni tipping his fedora — booking confirmation
export function JabroniTipHat({ className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 280"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Body */}
      <rect x="52" y="155" width="96" height="110" rx="0" fill="#1A1714" />
      <polygon points="100,165 80,155 90,200" fill="#0F0D0B" opacity="0.7" />
      <polygon points="100,165 120,155 110,200" fill="#0F0D0B" opacity="0.7" />
      <polygon points="100,170 95,185 100,220 105,185" fill="#C94B1A" />
      <rect x="93" y="165" width="14" height="35" fill="#F5EFE4" opacity="0.9" />

      {/* Right arm raised — tipping hat */}
      <rect x="146" y="120" width="26" height="72" rx="0" fill="#1A1714" transform="rotate(-45 159 156)" />
      {/* Left arm */}
      <rect x="28" y="158" width="26" height="72" rx="0" fill="#1A1714" transform="rotate(-8 41 194)" />

      {/* Right hand raised */}
      <ellipse cx="152" cy="88" rx="12" ry="10" fill="#C9952A" opacity="0.9" />

      {/* Left hand */}
      <ellipse cx="32" cy="228" rx="12" ry="10" fill="#C9952A" opacity="0.9" />
      {/* Cigar */}
      <rect x="32" y="234" width="28" height="5" rx="2" fill="#8B6914" />

      {/* Neck */}
      <rect x="86" y="128" width="28" height="32" rx="0" fill="#C9952A" opacity="0.85" />
      {/* Head */}
      <ellipse cx="100" cy="115" rx="46" ry="42" fill="#C9952A" opacity="0.9" />
      {/* Snout */}
      <ellipse cx="100" cy="126" rx="18" ry="13" fill="#B8824A" opacity="0.9" />
      <ellipse cx="93" cy="126" rx="5" ry="5" fill="#7A4A20" />
      <ellipse cx="107" cy="126" rx="5" ry="5" fill="#7A4A20" />
      {/* Eyes — winking */}
      <ellipse cx="82" cy="107" rx="8" ry="8" fill="#1A1714" />
      {/* Wink line for right eye */}
      <path d="M112 107 Q118 103 124 107" stroke="#1A1714" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="84" cy="105" rx="2.5" ry="2.5" fill="#F5EFE4" />
      {/* Smile */}
      <path d="M88 132 Q100 140 112 132" stroke="#7A4A20" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Ears */}
      <ellipse cx="58" cy="96" rx="14" ry="16" fill="#C9952A" opacity="0.85" />
      <ellipse cx="142" cy="96" rx="14" ry="16" fill="#C9952A" opacity="0.85" />

      {/* Fedora — tilted, being tipped */}
      <ellipse cx="100" cy="66" rx="58" ry="10" fill="#1A1714" transform="rotate(-15 100 66)" />
      <path d="M60 62 Q65 28 100 26 Q135 28 142 62" fill="#1A1714" transform="rotate(-15 100 44)" />
      <rect x="58" y="58" width="92" height="8" rx="0" fill="#C94B1A" opacity="0.8" transform="rotate(-15 104 62)" />

      {/* Legs */}
      <rect x="62" y="260" width="28" height="20" rx="0" fill="#1A1714" />
      <rect x="110" y="260" width="28" height="20" rx="0" fill="#1A1714" />
      <rect x="56" y="275" width="36" height="12" rx="0" fill="#0F0D0B" />
      <rect x="108" y="275" width="36" height="12" rx="0" fill="#0F0D0B" />
    </svg>
  )
}

// Jabroni shrugging — 404 page
export function JabroniShrug({ className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 280"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Body */}
      <rect x="62" y="155" width="96" height="110" rx="0" fill="#1A1714" />
      <polygon points="110,165 90,155 100,200" fill="#0F0D0B" opacity="0.7" />
      <polygon points="110,165 130,155 120,200" fill="#0F0D0B" opacity="0.7" />
      <polygon points="110,170 105,185 110,220 115,185" fill="#C94B1A" />

      {/* Both arms raised in shrug */}
      <rect x="24" y="128" width="26" height="60" rx="0" fill="#1A1714" transform="rotate(-50 37 158)" />
      <rect x="166" y="128" width="26" height="60" rx="0" fill="#1A1714" transform="rotate(50 179 158)" />

      {/* Hands shrugging */}
      <ellipse cx="28" cy="124" rx="12" ry="10" fill="#C9952A" opacity="0.9" />
      <ellipse cx="192" cy="124" rx="12" ry="10" fill="#C9952A" opacity="0.9" />

      {/* Cigar in mouth area */}
      <rect x="128" y="130" width="30" height="5" rx="2" fill="#8B6914" />
      <ellipse cx="156" cy="129" rx="5" ry="6" fill="#C94B1A" opacity="0.7" />

      {/* Neck */}
      <rect x="96" y="128" width="28" height="32" rx="0" fill="#C9952A" opacity="0.85" />
      {/* Head */}
      <ellipse cx="110" cy="112" rx="46" ry="42" fill="#C9952A" opacity="0.9" />
      {/* Snout */}
      <ellipse cx="110" cy="124" rx="18" ry="13" fill="#B8824A" opacity="0.9" />
      <ellipse cx="103" cy="124" rx="5" ry="5" fill="#7A4A20" />
      <ellipse cx="117" cy="124" rx="5" ry="5" fill="#7A4A20" />
      {/* Eyes — unimpressed */}
      <ellipse cx="92" cy="104" rx="8" ry="7" fill="#1A1714" />
      <ellipse cx="128" cy="104" rx="8" ry="7" fill="#1A1714" />
      {/* Half-lidded lines */}
      <line x1="84" y1="100" x2="100" y2="100" stroke="#C9952A" strokeWidth="2.5" />
      <line x1="120" y1="100" x2="136" y2="100" stroke="#C9952A" strokeWidth="2.5" />
      <ellipse cx="94" cy="103" rx="2.5" ry="2" fill="#F5EFE4" />
      <ellipse cx="130" cy="103" rx="2.5" ry="2" fill="#F5EFE4" />
      {/* Flat mouth */}
      <line x1="100" y1="133" x2="120" y2="132" stroke="#7A4A20" strokeWidth="2.5" strokeLinecap="round" />

      {/* Ears */}
      <ellipse cx="68" cy="92" rx="14" ry="16" fill="#C9952A" opacity="0.85" />
      <ellipse cx="152" cy="92" rx="14" ry="16" fill="#C9952A" opacity="0.85" />

      {/* Fedora */}
      <ellipse cx="110" cy="72" rx="58" ry="10" fill="#1A1714" />
      <path d="M65 72 Q68 36 110 34 Q152 36 155 72" fill="#1A1714" />
      <rect x="64" y="66" width="92" height="8" rx="0" fill="#C94B1A" opacity="0.8" />

      {/* Legs */}
      <rect x="72" y="260" width="28" height="20" rx="0" fill="#1A1714" />
      <rect x="120" y="260" width="28" height="20" rx="0" fill="#1A1714" />
      <rect x="66" y="275" width="36" height="12" rx="0" fill="#0F0D0B" />
      <rect x="118" y="275" width="36" height="12" rx="0" fill="#0F0D0B" />
    </svg>
  )
}

// Small Jabroni icon — for section dividers
export function JabroniIcon({ className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 72"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Compact head + fedora */}
      <ellipse cx="30" cy="35" rx="16" ry="14" fill="currentColor" />
      <ellipse cx="23" cy="28" rx="5" ry="6" fill="currentColor" />
      <ellipse cx="37" cy="28" rx="5" ry="6" fill="currentColor" />
      {/* Snout */}
      <ellipse cx="30" cy="39" rx="7" ry="5" fill="currentColor" opacity="0.7" />
      {/* Fedora brim */}
      <ellipse cx="30" cy="23" rx="20" ry="4" fill="currentColor" />
      {/* Crown */}
      <path d="M14 23 Q16 10 30 9 Q44 10 46 23" fill="currentColor" />
      {/* Band */}
      <rect x="13" y="20" width="34" height="4" fill="#C94B1A" opacity="0.8" />
      {/* Body hint */}
      <rect x="18" y="48" width="24" height="24" fill="currentColor" opacity="0.9" />
      {/* Cigar */}
      <rect x="42" y="36" width="14" height="3" rx="1" fill="currentColor" opacity="0.7" />
    </svg>
  )
}
