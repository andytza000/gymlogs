import { screen } from '@testing-library/react-native';

import Index from '@/app/index';
import { renderWithTheme } from '@/test/renderWithTheme';

test('renders the home screen', async () => {
  await renderWithTheme(<Index />);
  expect(screen.getByText('GymLogs')).toBeOnTheScreen();
});
