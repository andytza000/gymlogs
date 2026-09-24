import type { TextStyle } from 'react-native';

export type ColorScheme = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  onAccent: string;
  accentSoft: string;
  onAccentSoft: string;
  danger: string;
};

export type TextVariant = 'display' | 'title' | 'heading' | 'body' | 'bodySmall' | 'label';

// Iron, chosen in the September 2026 mockup round. Every text/background pair
// must stay at 4.5:1 or better (enforced by tokens.test.ts).
const ironLight: ThemeColors = {
  background: '#F2F4F7',
  surface: '#FFFFFF',
  surfaceMuted: '#E8ECF1',
  text: '#0E141B',
  textMuted: '#4A5563',
  border: '#D6DCE4',
  accent: '#2350D8',
  onAccent: '#FFFFFF',
  accentSoft: '#E2E9FC',
  onAccentSoft: '#1B3FAE',
  danger: '#B42318',
};

const ironDark: ThemeColors = {
  background: '#0B0E13',
  surface: '#141922',
  surfaceMuted: '#1D2430',
  text: '#E8EDF4',
  textMuted: '#9AA6B6',
  border: '#283142',
  accent: '#7C9CFF',
  onAccent: '#0A1024',
  accentSoft: '#1B2542',
  onAccentSoft: '#AFC1FF',
  danger: '#FF8A80',
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;

const radius = { control: 4, card: 6 } as const;

const borderWidth = { hairline: 1, focus: 2 } as const;

// Minimum touch target, and the taller primary action.
const size = { hitTarget: 44, primaryAction: 52 } as const;

// Roboto (the Android system font): no fontFamily needed.
const typography: Record<TextVariant, TextStyle> = {
  display: { fontSize: 48, lineHeight: 52, fontWeight: '700' },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  heading: { fontSize: 16, lineHeight: 22, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
};

// Fixed-width digits, so weights and reps line up in columns.
const numeric: TextStyle = { fontVariant: ['tabular-nums'] };

export type Theme = {
  scheme: ColorScheme;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  borderWidth: typeof borderWidth;
  size: typeof size;
  typography: Record<TextVariant, TextStyle>;
  numeric: TextStyle;
};

const shared = { spacing, radius, borderWidth, size, typography, numeric };

export const themes: Record<ColorScheme, Theme> = {
  light: { scheme: 'light', colors: ironLight, ...shared },
  dark: { scheme: 'dark', colors: ironDark, ...shared },
};
