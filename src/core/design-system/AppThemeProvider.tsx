import { ThemeProvider as NavigationThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { navigationTheme } from './navigationTheme';
import { ThemeChoiceContext } from './themeChoiceContext';
import { ThemeProvider } from './ThemeProvider';
import { defaultThemeName, type ThemeName, themes } from './tokens';

type Props = {
  children: ReactNode;
};

// App root: light/dark follows the phone; the theme family is chosen in the app.
// The choice lives in memory until a settings feature persists it.
export function AppThemeProvider({ children }: Props) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [name, setName] = useState<ThemeName>(defaultThemeName);
  const theme = themes[name][scheme];
  const choice = useMemo(() => ({ name, setName }), [name]);

  // The native root view shows behind React content (keyboard, transitions).
  useEffect(() => {
    void setBackgroundColorAsync(theme.colors.background);
  }, [theme]);

  return (
    <ThemeChoiceContext value={choice}>
      <ThemeProvider theme={theme}>
        <NavigationThemeProvider value={navigationTheme(theme)}>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          {children}
        </NavigationThemeProvider>
      </ThemeProvider>
    </ThemeChoiceContext>
  );
}
