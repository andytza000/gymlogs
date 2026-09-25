import { allThemes } from '@/test/allThemes';

import { buildNavigationTheme } from './buildNavigationTheme';

test.each(allThemes)('$familyName $scheme navigation chrome uses the theme colors', (theme) => {
  expect(buildNavigationTheme(theme)).toMatchObject({
    dark: theme.scheme === 'dark',
    colors: {
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      primary: theme.colors.accent,
    },
  });
});
