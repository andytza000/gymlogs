import { fireEvent, render, screen } from '@testing-library/react-native';
import { Pressable, Text, View } from 'react-native';

import { AppThemeProvider } from './AppThemeProvider';
import { makeStyles } from './makeStyles';
import { themes } from './tokens';
import { useThemeChoice } from './useThemeChoice';

const useStyles = makeStyles((t) => ({
  surface: { backgroundColor: t.colors.surface, borderRadius: t.radius.card },
}));

function Probe() {
  const styles = useStyles();
  const { name, setName } = useThemeChoice();
  return (
    <View accessibilityLabel="Themed surface" style={styles.surface}>
      <Text>Active: {name}</Text>
      <Pressable accessibilityRole="button" onPress={() => setName('chalk')}>
        <Text>Use Chalk</Text>
      </Pressable>
    </View>
  );
}

test('starts on Iron', async () => {
  await render(
    <AppThemeProvider>
      <Probe />
    </AppThemeProvider>,
  );
  expect(screen.getByText('Active: iron')).toBeOnTheScreen();
  expect(screen.getByLabelText('Themed surface')).toHaveStyle({
    borderRadius: themes.iron.light.radius.card,
  });
});

test('switching the theme restyles everything below it', async () => {
  await render(
    <AppThemeProvider>
      <Probe />
    </AppThemeProvider>,
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Use Chalk' }));
  expect(screen.getByText('Active: chalk')).toBeOnTheScreen();
  expect(screen.getByLabelText('Themed surface')).toHaveStyle({
    backgroundColor: themes.chalk.light.colors.surface,
    borderRadius: themes.chalk.light.radius.card,
  });
});
