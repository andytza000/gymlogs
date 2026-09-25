import { ThemeProvider as ExpoRouterThemeProvider } from 'expo-router';
import { type ReactNode, useMemo } from 'react';

import { useTheme } from '../theming/useTheme';
import { buildNavigationTheme } from './buildNavigationTheme';

type Props = {
  children: ReactNode;
};

export function NavigationThemeProvider({ children }: Props) {
  const theme = useTheme();
  const navigationTheme = useMemo(() => buildNavigationTheme(theme), [theme]);
  return <ExpoRouterThemeProvider value={navigationTheme}>{children}</ExpoRouterThemeProvider>;
}
