import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { ThemeProvider } from '../theming/ThemeProvider';
import { SystemChrome } from './SystemChrome';

type Props = {
  children: ReactNode;
};

export function AppThemeProvider({ children }: Props) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return (
    <ThemeProvider scheme={scheme}>
      <SystemChrome>{children}</SystemChrome>
    </ThemeProvider>
  );
}
