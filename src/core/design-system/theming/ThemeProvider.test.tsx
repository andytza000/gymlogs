import { fireEvent, screen } from '@testing-library/react-native';
import { Pressable, Text, View } from 'react-native';

import { renderWithTheme } from '@/test/renderWithTheme';

import { makeStyles } from '../makeStyles';
import { defaultFamilyName, themes } from '../tokens/themes';
import type { ColorScheme } from '../tokens/types';
import { useThemeChoice } from './useThemeChoice';

const schemes: ColorScheme[] = ['light', 'dark'];

const useStyles = makeStyles((t) => ({
  surface: { backgroundColor: t.colors.surface, borderRadius: t.radius.card },
}));

function FamilyPicker() {
  const styles = useStyles();
  const { familyName, setFamilyName } = useThemeChoice();
  return (
    <View accessibilityLabel="Themed surface" style={styles.surface}>
      <Text>Active: {familyName}</Text>
      <Pressable accessibilityRole="button" onPress={() => setFamilyName('chalk')}>
        <Text>Use Chalk</Text>
      </Pressable>
    </View>
  );
}

test.each(schemes)('starts on the default family (%s)', async (scheme) => {
  await renderWithTheme(<FamilyPicker />, { scheme });
  const defaultTheme = themes[defaultFamilyName][scheme];
  expect(screen.getByText(`Active: ${defaultFamilyName}`)).toBeOnTheScreen();
  expect(screen.getByLabelText('Themed surface')).toHaveStyle({
    backgroundColor: defaultTheme.colors.surface,
    borderRadius: defaultTheme.radius.card,
  });
});

test.each(schemes)('switching the family restyles everything below it (%s)', async (scheme) => {
  await renderWithTheme(<FamilyPicker />, { scheme });
  await fireEvent.press(screen.getByRole('button', { name: 'Use Chalk' }));
  expect(screen.getByText('Active: chalk')).toBeOnTheScreen();
  expect(screen.getByLabelText('Themed surface')).toHaveStyle({
    backgroundColor: themes.chalk[scheme].colors.surface,
    borderRadius: themes.chalk[scheme].radius.card,
  });
});
