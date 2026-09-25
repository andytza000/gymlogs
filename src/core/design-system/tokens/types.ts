import type { TextStyle } from 'react-native';

import type { sharedTokens } from './sharedTokens';

export type ColorScheme = 'light' | 'dark';

export type ThemeFamilyName = 'iron' | 'chalk';

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

// No fontFamily: every family uses Roboto, the Android system font.
export type TextVariantStyle = Pick<
  TextStyle,
  'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing' | 'textTransform'
>;

export type ThemeFamily = {
  name: ThemeFamilyName;
  label: string;
  radius: { control: number; card: number };
  typography: Record<TextVariant, TextVariantStyle>;
  colors: Record<ColorScheme, ThemeColors>;
};

export type Theme = Omit<ThemeFamily, 'name' | 'label' | 'colors'> &
  typeof sharedTokens & {
    familyName: ThemeFamilyName;
    familyLabel: string;
    scheme: ColorScheme;
    colors: ThemeColors;
  };
