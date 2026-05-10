/** @type {import('tailwindcss').Config} */

/**
 * Canonical breakpoint set for the Jabroni's homepage (Sprint 2 — LP2).
 *
 * The pre-LP2 codebase had hand-written @media blocks scattered across 17
 * components using 480 / 640 / 700 / 860 / 1024 widths. We consolidate to a
 * single Tailwind responsive system below.
 *
 *   xs  = 480px  (CUSTOM)        — Packages/Experience collapse-to-1col;
 *                                  the 320–414px viewports the April-2 mobile
 *                                  horizontal-scroll bug regressed at.
 *   sm  = 640px  (Tailwind dflt) — eyebrow / .btn padding tweaks
 *   md  = 860px  (CUSTOM ovrd)   — the major desktop ↔ tablet/mobile split.
 *                                  Sprint 1's sticky-mobile-CTA gate, the
 *                                  hamburger gate in Nav, and every grid
 *                                  collapse all anchor on 860, not Tailwind's
 *                                  default 768. Shifting it 92px would
 *                                  regress sprint 1's verified visuals.
 *   lg  = 1024px (Tailwind dflt) — Menu mains 3→2 col; Experience cast 5→3.
 *   xl  = 1280px (Tailwind dflt) — page max-width container.
 *
 * The 700px breakpoint that lived in the dead-code PhaseBanner was not
 * migrated (component is unimported as of sprint 1).
 */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Override the default screens. We set them explicitly rather than via
    // `extend.screens` so `md` actually takes the new value (Tailwind merges
    // `extend.screens` rather than replacing). `xs` is a brand-new breakpoint;
    // `sm`, `lg`, `xl`, `2xl` keep their default values.
    screens: {
      xs: '480px',
      sm: '640px',
      md: '860px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        ember: '#B53F14',
        'ember-glow': '#E8622A',
        'ember-deep': '#7A2710',
        smoke: '#1A1714',
        ash: '#2D2925',
        char: '#3D3530',
        cream: '#F5EFE4',
        gold: '#C9952A',
        'gold-light': '#E8B84B',
        bone: '#E8DDD0',
        stage: '#0F0D0B',
        curtain: '#1E1510',
      },
      // Named spacing tokens that the homepage uses repeatedly. Avoids
      // peppering arbitrary `py-[120px]` calls across every section.
      spacing: {
        'section-y': '120px',
        'section-y-mobile': '80px',
      },
      // Map the codebase's 1280px content max-width to a named token.
      maxWidth: {
        page: '1280px',
        'page-narrow': '1100px',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        bebas: ['"Bebas Neue"', 'cursive'],
        mono: ['"DM Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ember-flicker': 'emberFlicker 4s ease-in-out infinite',
      },
      keyframes: {
        emberFlicker: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
