import { Stack } from 'expo-router';

import { SystemThemeProvider } from '@/core/design-system';

export default function RootLayout() {
  return (
    <SystemThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'GymLogs' }} />
      </Stack>
    </SystemThemeProvider>
  );
}
