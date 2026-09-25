import type { ThemeFamily } from '../types';

export const iron: ThemeFamily = {
  name: 'iron',
  label: 'Iron',
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
  colors: {
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
