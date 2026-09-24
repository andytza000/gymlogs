import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { type ColorScheme, ThemeProvider, themes } from '@/core/design-system';

// A phone-sized frame with status/navigation bar insets, so safe-area hooks work.
const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 24, right: 0, bottom: 24, left: 0 },
};

export function renderWithTheme(
  ui: ReactElement,
  { scheme = 'light' }: { scheme?: ColorScheme } = {},
) {
  return render(
    <SafeAreaProvider initialMetrics={metrics}>
      <ThemeProvider theme={themes[scheme]}>{ui}</ThemeProvider>
    </SafeAreaProvider>,
  );
}
