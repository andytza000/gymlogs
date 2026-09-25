import { screen } from '@testing-library/react-native';
import { View } from 'react-native';

import { allThemes } from '@/test/allThemes';
import { renderWithTheme } from '@/test/renderWithTheme';

import { makeStyles } from './makeStyles';

const useStyles = makeStyles((t) => ({
  box: { backgroundColor: t.colors.surface, borderRadius: t.radius.card, padding: t.spacing.lg },
}));

function Box() {
  const styles = useStyles();
  return <View accessibilityLabel="Styled box" style={styles.box} />;
}

test.each(allThemes)('styles follow the $familyName $scheme theme', async (theme) => {
  await renderWithTheme(<Box />, { familyName: theme.familyName, scheme: theme.scheme });
  expect(screen.getByLabelText('Styled box')).toHaveStyle({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
  });
});
