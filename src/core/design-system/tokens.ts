import type { TextStyle } from 'react-native';

export type ColorScheme = 'light' | 'dark';

export type ThemeName = 'iron' | 'chalk';

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
  // Must stay distinguishable from accent (an error border vs a focused one).
  danger: string;
};

export type TextVariant = 'display' | 'title' | 'heading' | 'body' | 'bodySmall' | 'label';

export type Theme = {
  name: ThemeName;
  label: string;
  scheme: ColorScheme;
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  radius: { control: number; card: number };
  borderWidth: { hairline: number; focus: number };
  size: { hitTarget: number; primaryAction: number };
  typography: Record<TextVariant, TextStyle>;
  numeric: TextStyle;
};

// A theme family: its identity, shape and type, plus one palette per scheme.
type ThemeFamily = Omit<Theme, 'scheme' | 'colors'> & {
  palettes: Record<ColorScheme, ThemeColors>;
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };

const borderWidth = { hairline: 1, focus: 2 };

// Minimum touch target, and the taller primary action.
const size = { hitTarget: 44, primaryAction: 52 };

// Fixed-width digits, so weights and reps line up in columns.
const numeric: TextStyle = { fontVariant: ['tabular-nums'] };

// Every text/background pair must stay at 4.5:1 or better (tokens.test.ts).
// Typefaces are Roboto, the Android system font, so no fontFamily is set.

// Iron: the default look, chosen in the September 2026 mockup round.
const iron: ThemeFamily = {
  name: 'iron',
  label: 'Iron',
  spacing,
  borderWidth,
  size,
  numeric,
  radius: { control: 4, card: 6 },
  typography: {
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
  },
  palettes: {
    light: {
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
    },
    dark: {
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
    },
  },
};

// Chalk: warm, softer shapes, medium-weight type (mockup option A).
const chalk: ThemeFamily = {
  name: 'chalk',
  label: 'Chalk',
  spacing,
  borderWidth,
  size,
  numeric,
  radius: { control: 12, card: 16 },
  typography: {
    display: { fontSize: 44, lineHeight: 48, fontWeight: '500' },
    title: { fontSize: 26, lineHeight: 32, fontWeight: '500' },
    heading: { fontSize: 18, lineHeight: 24, fontWeight: '500' },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
    label: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.24 },
  },
  palettes: {
    light: {
      background: '#F6F3EE',
      surface: '#FFFFFF',
      surfaceMuted: '#EFE9E0',
      text: '#1F1B16',
      textMuted: '#5E564C',
      border: '#E3DBCF',
      accent: '#B8461B',
      onAccent: '#FFFFFF',
      accentSoft: '#F7E4D9',
      onAccentSoft: '#8A3212',
      danger: '#9B1C1C',
    },
    dark: {
      background: '#161412',
      surface: '#211E1B',
      surfaceMuted: '#2C2824',
      text: '#F2EDE6',
      textMuted: '#B3AA9E',
      border: '#3A3531',
      accent: '#F0895B',
      onAccent: '#1F1208',
      accentSoft: '#3A2419',
      onAccentSoft: '#F6B08F',
      danger: '#FFB4AB',
    },
  },
};

function schemes({ palettes, ...family }: ThemeFamily): Record<ColorScheme, Theme> {
  return {
    light: { ...family, scheme: 'light', colors: palettes.light },
    dark: { ...family, scheme: 'dark', colors: palettes.dark },
  };
}

export const themes: Record<ThemeName, Record<ColorScheme, Theme>> = {
  iron: schemes(iron),
  chalk: schemes(chalk),
};

export const themeNames = Object.keys(themes) as ThemeName[];

export const defaultThemeName: ThemeName = 'iron';
