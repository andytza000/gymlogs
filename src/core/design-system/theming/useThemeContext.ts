import { use } from 'react';

import { ThemeContext, type ThemeContextValue } from './themeContext';

export function useThemeContext(): ThemeContextValue {
  const value = use(ThemeContext);
  if (!value) {
    throw new Error('Theme hooks must be used inside <ThemeProvider>.');
  }
  return value;
}
