import { navigationTheme } from './navigationTheme';
import { themes } from './tokens';

test.each(['light', 'dark'] as const)('%s navigation chrome uses the theme colors', (scheme) => {
  const theme = themes[scheme];
  expect(navigationTheme(theme)).toMatchObject({
    dark: scheme === 'dark',
    colors: {
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      primary: theme.colors.accent,
    },
  });
});
