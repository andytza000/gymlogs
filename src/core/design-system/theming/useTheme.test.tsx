import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { renderWithTheme } from '@/test/renderWithTheme';

import { useTheme } from './useTheme';

function SchemeName() {
  return <Text>{useTheme().scheme}</Text>;
}

test('returns the theme for the scheme given to ThemeProvider', async () => {
  await renderWithTheme(<SchemeName />, { scheme: 'dark' });
  expect(screen.getByText('dark')).toBeOnTheScreen();
});

test('fails loudly outside a ThemeProvider', async () => {
  await expect(render(<SchemeName />)).rejects.toThrow('inside <ThemeProvider>');
});
