import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  type ColorScheme,
  defaultThemeName,
  type ThemeName,
  ThemeProvider,
  themes,
} from '@/core/design-system';

// A phone-sized frame with status/navigation bar insets, so safe-area hooks work.
const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 24, right: 0, bottom: 24, left: 0 },
};

type Options = { name?: ThemeName; scheme?: ColorScheme };

export function renderWithTheme(
  ui: ReactElement,
  { name = defaultThemeName, scheme = 'light' }: Options = {},
) {
  return render(
    <SafeAreaProvider initialMetrics={metrics}>
      <ThemeProvider theme={themes[name][scheme]}>{ui}</ThemeProvider>
    </SafeAreaProvider>,
  );
}

// Every theme family in both schemes, for test.each.
export const allThemes = Object.values(themes).flatMap((family) => Object.values(family));
