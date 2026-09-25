import { allThemes } from '@/test/allThemes';

import appConfig from '../../../../app.json';

import { defaultFamilyName, themes } from './themes';
import type { ThemeColors } from './types';

function hexToRgb(hex: string): [number, number, number] {
  const channel = (offset: number) => parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return [channel(1), channel(3), channel(5)];
}

// WCAG 2.x relative luminance and contrast ratio.
function linearize(channel: number): number {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const [red, green, blue] = hexToRgb(hex);
  return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
}

function contrastRatio(foreground: string, background: string): number {
  const luminances = [relativeLuminance(foreground), relativeLuminance(background)];
  return (Math.max(...luminances) + 0.05) / (Math.min(...luminances) + 0.05);
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

describe.each(allThemes)('$familyLabel $scheme', (theme) => {
  test.each(readablePairs)('%s on %s reaches 4.5:1 contrast', (foreground, background) => {
    expect(
      contrastRatio(theme.colors[foreground], theme.colors[background]),
    ).toBeGreaterThanOrEqual(4.5);
  });
});

test("the splash screen uses the default family's light and dark backgrounds", () => {
  const splash = appConfig.expo.plugins.find(
    (plugin) => Array.isArray(plugin) && plugin[0] === 'expo-splash-screen',
  );
  expect(splash?.[1]).toEqual({
    backgroundColor: themes[defaultFamilyName].light.colors.background,
    dark: { backgroundColor: themes[defaultFamilyName].dark.colors.background },
  });
});
