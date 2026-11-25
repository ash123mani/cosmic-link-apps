import type { TextStyle } from 'react-native';

const DISPLAY = 'Poppins_700Bold';
const HEADING = 'Poppins_600SemiBold';
const BODY = 'Poppins_400Regular';

export interface TypeStyle {
  fontFamily?: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
  letterSpacing?: number;
  textTransform?: TextStyle['textTransform'];
}

export const typography = {
  display: {
    fontFamily: DISPLAY,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  title1: {
    fontFamily: DISPLAY,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  title2: {
    fontFamily: HEADING,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  title3: {
    fontFamily: HEADING,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
  },
  headline: {
    fontFamily: HEADING,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  },
  body: {
    fontFamily: BODY,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodyStrong: {
    fontFamily: HEADING,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  bodySm: {
    fontFamily: BODY,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  label: {
    fontFamily: HEADING,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  caption: {
    fontFamily: BODY,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  overline: {
    fontFamily: HEADING,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
} satisfies Record<string, TypeStyle>;

export type TypographyVariant = keyof typeof typography;
