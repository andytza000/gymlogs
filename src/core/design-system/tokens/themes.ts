import { chalk } from './families/chalk';
import { iron } from './families/iron';
import { sharedTokens } from './sharedTokens';
import type { ColorScheme, Theme, ThemeFamily, ThemeFamilyName } from './types';

const families: Record<ThemeFamilyName, ThemeFamily> = { iron, chalk };

function buildTheme({ name, label, colors, ...family }: ThemeFamily, scheme: ColorScheme): Theme {
  return {
    ...family,
    ...sharedTokens,
    familyName: name,
    familyLabel: label,
    scheme,
    colors: colors[scheme],
  };
}

function buildThemes(family: ThemeFamily): Record<ColorScheme, Theme> {
  return { light: buildTheme(family, 'light'), dark: buildTheme(family, 'dark') };
}

export const themeFamilies = Object.values(families);

export const themes = Object.fromEntries(
  themeFamilies.map((family) => [family.name, buildThemes(family)]),
) as Record<ThemeFamilyName, Record<ColorScheme, Theme>>;

export const defaultFamilyName: ThemeFamilyName = 'iron';
