/**
 * OPSMIND ENTERPRISE DESIGN SYSTEM TOKENS
 * Inspired by IBM Carbon Design System & Modern Cloud Observability Platforms
 */

export const colors = {
  // IBM Carbon Neutral Surface Layers (Dark Theme Default for Mission-Control)
  background: '#161616',
  layer01: '#262626',
  layer02: '#393939',
  layer03: '#525252',
  layerHover: '#333333',
  layerSelected: '#353535',

  // Light Mode Equivalents (For tokens & documentation)
  light: {
    background: '#FFFFFF',
    layer01: '#F4F4F4',
    layer02: '#FFFFFF',
    layer03: '#F4F4F4',
    borderSubtle: '#E0E0E0',
    borderStrong: '#8D8D8D',
    textPrimary: '#161616',
    textSecondary: '#525252',
    textTertiary: '#6F6F6F',
  },

  // Borders
  borderSubtle: '#393939',
  borderStrong: '#525252',
  borderInteractive: '#0F62FE',

  // Text
  textPrimary: '#F4F4F4',
  textSecondary: '#C6C6C6',
  textTertiary: '#8D8D8D',
  textInverse: '#161616',

  // Primary Interaction - IBM Carbon Blue
  blue: {
    10: '#EDF5FF',
    20: '#D0E2FF',
    30: '#A6C8FF',
    40: '#78A9FF',
    50: '#4589FF', // Primary dark interaction
    60: '#0F62FE', // Primary light interaction
    70: '#0043CE',
    80: '#002D9C',
    hover: '#0353E9',
    active: '#0043CE',
  },

  // OpsMind AI Color Language
  ai: {
    primary: '#4589FF',
    light: '#EDF5FF',
    accent: '#78A9FF',
    tint: 'rgba(69, 137, 255, 0.12)',
    border: 'rgba(69, 137, 255, 0.35)',
  },

  // Severity System (Always Color + Icon + Text Label)
  severity: {
    critical: {
      color: '#DA1E28',
      bg: 'rgba(218, 30, 40, 0.12)',
      border: 'rgba(218, 30, 40, 0.35)',
      label: 'CRITICAL',
    },
    high: {
      color: '#FF832B',
      bg: 'rgba(255, 131, 43, 0.12)',
      border: 'rgba(255, 131, 43, 0.35)',
      label: 'HIGH',
    },
    medium: {
      color: '#F1C21B',
      bg: 'rgba(241, 194, 27, 0.12)',
      border: 'rgba(241, 194, 27, 0.35)',
      label: 'MEDIUM',
    },
    low: {
      color: '#24A148',
      bg: 'rgba(36, 161, 72, 0.12)',
      border: 'rgba(36, 161, 72, 0.35)',
      label: 'LOW',
    },
    info: {
      color: '#0F62FE',
      bg: 'rgba(15, 98, 254, 0.12)',
      border: 'rgba(15, 98, 254, 0.35)',
      label: 'INFO',
    },
  },

  // System Status
  status: {
    success: '#24A148',
    warning: '#F1C21B',
    error: '#DA1E28',
    info: '#0F62FE',
    unknown: '#8D8D8D',
  },
} as const;

export const spacing = {
  2: '0.125rem',  // 2px
  4: '0.25rem',   // 4px
  8: '0.5rem',    // 8px
  12: '0.75rem',  // 12px
  16: '1rem',     // 16px
  20: '1.25rem',  // 20px
  24: '1.5rem',   // 24px
  32: '2rem',     // 32px
  40: '2.5rem',   // 40px
  48: '3rem',     // 48px
  64: '4rem',     // 64px
  80: '5rem',     // 80px
} as const;

export const radius = {
  none: '0px',
  sm: '2px',
  md: '4px',
  lg: '6px',
  // Strict enterprise rule: No 16px, 20px, 24px, 32px
} as const;

export const motion = {
  instant: '80ms',
  fast: '120ms',
  standard: '180ms',
  emphasis: '240ms',
  easeStandard: 'cubic-bezier(0.2, 0, 0.38, 0.9)',
  easeEnter: 'cubic-bezier(0, 0, 0.38, 0.9)',
  easeExit: 'cubic-bezier(0.2, 0, 1, 0.9)',
} as const;

export const zIndex = {
  base: 0,
  card: 1,
  header: 20,
  sidebar: 30,
  popover: 40,
  drawer: 50,
  modal: 60,
  toast: 70,
} as const;
