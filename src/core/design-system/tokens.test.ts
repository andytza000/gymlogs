import { allThemes } from '@/test/renderWithTheme';

import appConfig from '../../../app.json';

import { defaultThemeName, type ThemeColors, themes } from './tokens';

// WCAG 2.x relative luminance and contrast ratio.
function luminance(hex: string): number {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const readablePairs: [keyof ThemeColors, keyof ThemeColors][] = [
  ['text', 'background'],
  ['text', 'surface'],
  ['text', 'surfaceMuted'],
  ['textMuted', 'background'],
  ['textMuted', 'surface'],
  ['textMuted', 'surfaceMuted'],
  ['accent', 'background'],
  ['accent', 'surface'],
  ['onAccent', 'accent'],
  ['onAccentSoft', 'accentSoft'],
  ['danger', 'background'],
  ['danger', 'surface'],
];

describe.each(allThemes.map((t) => [`${t.label} ${t.scheme}`, t] as const))('%s', (_, theme) => {
  test.each(readablePairs)('%s on %s reaches 4.5:1 contrast', (fg, bg) => {
    expect(contrast(theme.colors[fg], theme.colors[bg])).toBeGreaterThanOrEqual(4.5);
  });
});

test('the splash screen uses the default theme backgrounds', () => {
  const splash = appConfig.expo.plugins.find(
    (plugin) => Array.isArray(plugin) && plugin[0] === 'expo-splash-screen',
  );
  expect(splash?.[1]).toEqual({
    backgroundColor: themes[defaultThemeName].light.colors.background,
    dark: { backgroundColor: themes[defaultThemeName].dark.colors.background },
  });
});
