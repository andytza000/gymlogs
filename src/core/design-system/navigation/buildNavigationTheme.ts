import { DefaultTheme, type Theme as NavigationTheme } from 'expo-router';

import type { Theme } from '../tokens/types';

export function buildNavigationTheme(theme: Theme): NavigationTheme {
  return {
    dark: theme.scheme === 'dark',
    fonts: DefaultTheme.fonts,
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
