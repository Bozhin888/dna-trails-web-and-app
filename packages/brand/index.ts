// DNA Trails brand tokens (brand book Sep 2025, logo Aug 2025, pivot brief Nov 2026).
// Gold = confirmed stamp, mint = live and open, rust = warning.
export const colors = {
  green: '#1C562B',
  deep: '#132B18',
  gold: '#B8A559',
  rust: '#B3602A',
  mint: '#D0E8D6',
  charcoal: '#383838',
  offwhite: '#F8F8F8',
  white: '#FFFFFF',
} as const;

export const fonts = {
  body: 'Lato',          // logo, body, navigation
  heading: 'Panton',     // headings (licensed; Lato is the web fallback)
  type: 'Courier Prime', // pass codes, stamps, receipts
} as const;

export const radius = { sm: 6, md: 8, lg: 14, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 } as const;

export const slogans = {
  main: "Go where you're expected.",
  layers: 'Hidden stories. Forgotten flavors. Roads less traveled.',
  passport: 'Your Passport to Authenticity',
  tag: '#FOLLOWTHETRAIL',
} as const;
