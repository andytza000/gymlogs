import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { useTheme } from '../theming/useTheme';
import { defaultFamilyName } from '../tokens/themes';
import { AppThemeProvider } from './AppThemeProvider';

function ThemeSummary() {
  const theme = useTheme();
  return (
    <Text>
      {theme.name} {theme.scheme}
    </Text>
  );
}

test('renders the default family in light when the phone sets no scheme', async () => {
  await render(
    <AppThemeProvider>
      <ThemeSummary />
    </AppThemeProvider>,
  );
  expect(screen.getByText(`${defaultFamilyName} light`)).toBeOnTheScreen();
});
