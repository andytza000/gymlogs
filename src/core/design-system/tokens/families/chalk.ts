import type { ThemeFamily } from '../types';

export const chalk: ThemeFamily = {
  name: 'chalk',
  label: 'Chalk',
  radius: { control: 12, card: 16 },
  typography: {
    display: { fontSize: 44, lineHeight: 48, fontWeight: '500' },
    title: { fontSize: 26, lineHeight: 32, fontWeight: '500' },
    heading: { fontSize: 18, lineHeight: 24, fontWeight: '500' },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
    label: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.24 },
  },
  colors: {
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
