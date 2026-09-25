import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { type ColorScheme, type ThemeFamilyName, ThemeProvider } from '@/core/design-system';

// Safe-area hooks need initial metrics in tests: a phone-sized frame with
// status and navigation bar insets.
const phoneMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 24, right: 0, bottom: 24, left: 0 },
};

type Options = { familyName?: ThemeFamilyName; scheme?: ColorScheme };

export function renderWithTheme(ui: ReactElement, { familyName, scheme = 'light' }: Options = {}) {
  return render(
    <SafeAreaProvider initialMetrics={phoneMetrics}>
      <ThemeProvider scheme={scheme} initialFamilyName={familyName}>
        {ui}
      </ThemeProvider>
    </SafeAreaProvider>,
  );
}
