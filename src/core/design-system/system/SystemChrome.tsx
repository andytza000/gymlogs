import { ThemeProvider as NavigationThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { type ReactNode, useEffect, useMemo } from 'react';

import { useTheme } from '../theming/useTheme';
import { buildNavigationTheme } from './buildNavigationTheme';

type Props = {
  children: ReactNode;
};

export function SystemChrome({ children }: Props) {
  const theme = useTheme();
  const navigationTheme = useMemo(() => buildNavigationTheme(theme), [theme]);
  const statusBarIconColor = theme.scheme === 'dark' ? 'light' : 'dark';

  // The native root view shows behind React content (keyboard, transitions).
  useEffect(() => {
    void setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={statusBarIconColor} />
      {children}
    </NavigationThemeProvider>
  );
}
