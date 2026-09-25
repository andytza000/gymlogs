import { fireEvent, screen } from '@testing-library/react-native';
import { Pressable, Text, View } from 'react-native';

import { allThemes } from '@/test/allThemes';
import { renderWithTheme } from '@/test/renderWithTheme';

import { makeStyles } from '../makeStyles';
import { defaultFamilyName, themeFamilies } from '../tokens/themes';
import { useThemeFamily } from './useThemeFamily';

const defaultFamilyThemes = allThemes.filter((theme) => theme.familyName === defaultFamilyName);
const otherFamilyThemes = allThemes.filter((theme) => theme.familyName !== defaultFamilyName);

const useStyles = makeStyles((t) => ({
  surface: { backgroundColor: t.colors.surface, borderRadius: t.radius.card },
}));

function FamilyPicker() {
  const styles = useStyles();
  const { familyName, setFamilyName } = useThemeFamily();
  return (
    <View accessibilityLabel="Themed surface" style={styles.surface}>
      <Text>Active: {familyName}</Text>
      {themeFamilies.map(({ name, label }) => (
        <Pressable key={name} accessibilityRole="button" onPress={() => setFamilyName(name)}>
          <Text>Use {label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

test.each(defaultFamilyThemes)(
  'starts on the default family, $familyLabel $scheme',
  async (theme) => {
    await renderWithTheme(<FamilyPicker />, { scheme: theme.scheme });
    expect(screen.getByText(`Active: ${theme.familyName}`)).toBeOnTheScreen();
    expect(screen.getByLabelText('Themed surface')).toHaveStyle({
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.card,
    });
  },
);

test.each(otherFamilyThemes)(
  'switching to $familyLabel $scheme restyles everything below the provider',
  async (theme) => {
    await renderWithTheme(<FamilyPicker />, { scheme: theme.scheme });
    await fireEvent.press(screen.getByRole('button', { name: `Use ${theme.familyLabel}` }));
    expect(screen.getByText(`Active: ${theme.familyName}`)).toBeOnTheScreen();
    expect(screen.getByLabelText('Themed surface')).toHaveStyle({
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.card,
    });
  },
);
