import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { useTheme } from '../theming/useTheme';
import { defaultFamilyName } from '../tokens/themes';
import { SystemThemeProvider } from './SystemThemeProvider';

function ThemeSummary() {
  const theme = useTheme();
  return (
    <Text>
      {theme.familyName} {theme.scheme}
    </Text>
  );
}

test('renders the default family in light when the phone sets no scheme', async () => {
  await render(
    <SystemThemeProvider>
      <ThemeSummary />
    </SystemThemeProvider>,
  );
  expect(screen.getByText(`${defaultFamilyName} light`)).toBeOnTheScreen();
});
