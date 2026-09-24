import { allThemes } from '@/test/renderWithTheme';

import { navigationTheme } from './navigationTheme';

test.each(allThemes.map((t) => [`${t.label} ${t.scheme}`, t] as const))(
  '%s navigation chrome uses the theme colors',
  (_, theme) => {
    expect(navigationTheme(theme)).toMatchObject({
      dark: theme.scheme === 'dark',
      colors: {
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        primary: theme.colors.accent,
      },
    });
  },
);
