import { Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { navigationTheme, ThemeProvider, themes } from '@/core/design-system';

export default function RootLayout() {
  const theme = themes[useColorScheme() === 'dark' ? 'dark' : 'light'];

  // The native root view shows behind React content (keyboard, transitions).
  useEffect(() => {
    void setBackgroundColorAsync(theme.colors.background);
  }, [theme]);

  return (
    <ThemeProvider theme={theme}>
      <NavigationThemeProvider value={navigationTheme(theme)}>
        <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen name="index" options={{ title: 'GymLogs' }} />
        </Stack>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
