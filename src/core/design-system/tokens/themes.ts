import { chalk } from './families/chalk';
import { iron } from './families/iron';
import { sharedTokens } from './sharedTokens';
import type { ColorScheme, Theme, ThemeFamily, ThemeFamilyName } from './types';

const families: Record<ThemeFamilyName, ThemeFamily> = { iron, chalk };

function buildTheme(family: ThemeFamily, scheme: ColorScheme): Theme {
  return {
    ...sharedTokens,
    familyName: family.name,
    scheme,
    colors: family.colors[scheme],
    radius: family.radius,
    typography: family.typography,
  };
}

export const themeFamilies = Object.values(families);

export const themes = Object.fromEntries(
  themeFamilies.map((family) => [
    family.name,
    { light: buildTheme(family, 'light'), dark: buildTheme(family, 'dark') },
  ]),
) as Record<ThemeFamilyName, Record<ColorScheme, Theme>>;

export const defaultFamilyName: ThemeFamilyName = 'iron';
