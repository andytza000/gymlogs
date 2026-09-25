import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { useEffect } from 'react';

import { useTheme } from '../theming/useTheme';

export function SystemChrome() {
  const theme = useTheme();
  const statusBarIconColor = theme.scheme === 'dark' ? 'light' : 'dark';

  // The native root view shows behind React content (keyboard, transitions).
  useEffect(() => {
    void setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  return <StatusBar style={statusBarIconColor} />;
}
