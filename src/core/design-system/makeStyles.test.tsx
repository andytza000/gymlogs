import { screen } from '@testing-library/react-native';
import { View } from 'react-native';

import { allThemes, renderWithTheme } from '@/test/renderWithTheme';

import { makeStyles } from './makeStyles';

const useStyles = makeStyles((t) => ({
  box: { backgroundColor: t.colors.surface, borderRadius: t.radius.card, padding: t.spacing.lg },
}));

function Box() {
  const styles = useStyles();
  return <View accessibilityLabel="Styled box" style={styles.box} />;
}

test.each(allThemes.map((t) => [`${t.label} ${t.scheme}`, t] as const))(
  'styles follow the %s theme',
  async (_, theme) => {
    await renderWithTheme(<Box />, { name: theme.name, scheme: theme.scheme });
    expect(screen.getByLabelText('Styled box')).toHaveStyle({
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.card,
      padding: 16,
    });
  },
);
