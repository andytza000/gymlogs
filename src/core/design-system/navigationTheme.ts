import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from 'expo-router';

import type { Theme } from './tokens';

// expo-router's own theme (screen backgrounds, headers) built from our tokens,
// so navigation chrome never falls back to its default white.
export function navigationTheme(theme: Theme): NavigationTheme {
  const base = theme.scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: theme.scheme === 'dark',
    colors: {
      primary: theme.colors.accent,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.danger,
    },
  };
}
