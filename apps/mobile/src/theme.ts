import { colors, radius, space, slogans } from '@dna/brand';
export { colors, radius, space, slogans };
export const type = {
  h1: { fontSize: 28, fontWeight: '900' as const, color: colors.deep, letterSpacing: -0.4 },
  h2: { fontSize: 21, fontWeight: '800' as const, color: colors.deep },
  h3: { fontSize: 16, fontWeight: '800' as const, color: colors.deep },
  body: { fontSize: 15, lineHeight: 22, color: colors.charcoal },
  small: { fontSize: 13, lineHeight: 18, color: '#5B685F' },
  eyebrow: { fontSize: 11, fontWeight: '800' as const, letterSpacing: 1.6, textTransform: 'uppercase' as const, color: colors.rust },
  mono: { fontFamily: 'Courier', fontWeight: '700' as const, letterSpacing: 0.6 },
};
