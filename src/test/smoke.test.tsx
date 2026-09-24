import { render, screen } from '@testing-library/react-native';

import Index from '@/app/index';
import { AppThemeProvider } from '@/core/design-system';

test('renders the home screen', async () => {
  await render(
    <AppThemeProvider>
      <Index />
    </AppThemeProvider>,
  );
  expect(screen.getByText('GymLogs')).toBeOnTheScreen();
});
