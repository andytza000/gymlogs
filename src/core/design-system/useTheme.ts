import { use } from 'react';

import { ThemeContext } from './themeContext';
import type { Theme } from './tokens';

export function useTheme(): Theme {
  const theme = use(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used inside <ThemeProvider>.');
  }
  return theme;
}
