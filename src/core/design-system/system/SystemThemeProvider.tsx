import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { NavigationThemeProvider } from '../navigation/NavigationThemeProvider';
import { ThemeProvider } from '../theming/ThemeProvider';
import { SystemChrome } from './SystemChrome';

type Props = {
  children: ReactNode;
};

export function SystemThemeProvider({ children }: Props) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return (
    <ThemeProvider scheme={scheme}>
      <SystemChrome />
      <NavigationThemeProvider>{children}</NavigationThemeProvider>
    </ThemeProvider>
  );
}
