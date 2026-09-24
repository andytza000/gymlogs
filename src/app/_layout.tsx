import { Stack } from 'expo-router';

import { AppThemeProvider } from '@/core/design-system';

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'GymLogs' }} />
      </Stack>
    </AppThemeProvider>
  );
}
