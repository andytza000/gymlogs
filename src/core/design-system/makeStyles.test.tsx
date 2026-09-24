import { screen } from '@testing-library/react-native';
import { View } from 'react-native';

import { renderWithTheme } from '@/test/renderWithTheme';

import { makeStyles } from './makeStyles';
import { themes } from './tokens';

const useStyles = makeStyles((t) => ({
  box: { backgroundColor: t.colors.surface, padding: t.spacing.lg },
}));

function Box() {
  const styles = useStyles();
  return <View accessibilityLabel="Styled box" style={styles.box} />;
}

test.each(['light', 'dark'] as const)('styles follow the %s theme', async (scheme) => {
  await renderWithTheme(<Box />, { scheme });
  expect(screen.getByLabelText('Styled box')).toHaveStyle({
    backgroundColor: themes[scheme].colors.surface,
    padding: 16,
  });
});
