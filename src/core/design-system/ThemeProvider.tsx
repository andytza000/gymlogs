import type { ReactNode } from 'react';

import { ThemeContext } from './themeContext';
import type { Theme } from './tokens';

type Props = {
  theme: Theme;
  children: ReactNode;
};

// The theme is a prop, never read from the OS here: the app root picks it,
// and tests render light and dark without mocking.
export function ThemeProvider({ theme, children }: Props) {
  return <ThemeContext value={theme}>{children}</ThemeContext>;
}
