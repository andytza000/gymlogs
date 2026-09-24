import { use } from 'react';

import { type ThemeChoice, ThemeChoiceContext } from './themeChoiceContext';

// The active theme family and a way to change it (inside AppThemeProvider).
export function useThemeChoice(): ThemeChoice {
  const choice = use(ThemeChoiceContext);
  if (!choice) {
    throw new Error('useThemeChoice must be used inside <AppThemeProvider>.');
  }
  return choice;
}
