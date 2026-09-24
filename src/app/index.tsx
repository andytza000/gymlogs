import { Pressable, Text, View } from 'react-native';

import { makeStyles, themeNames, themes, useThemeChoice } from '@/core/design-system';

// Placeholder with a temporary theme switcher, until the component gallery (#8)
// replaces it.
export default function Index() {
  const styles = useStyles();
  const { name, setName } = useThemeChoice();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GymLogs</Text>
      <View style={styles.row}>
        {themeNames.map((option) => {
          const selected = option === name;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setName(option)}
              style={[styles.choice, selected && styles.choiceSelected]}
            >
              <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
                {themes[option].light.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.spacing.xl,
    backgroundColor: t.colors.background,
  },
  title: {
    ...t.typography.title,
    color: t.colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: t.spacing.sm,
  },
  choice: {
    minHeight: t.size.hitTarget,
    justifyContent: 'center',
    paddingHorizontal: t.spacing.xl,
    borderRadius: t.radius.control,
    borderWidth: t.borderWidth.hairline,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  choiceSelected: {
    borderColor: t.colors.accent,
    backgroundColor: t.colors.accent,
  },
  choiceText: {
    ...t.typography.heading,
    color: t.colors.text,
  },
  choiceTextSelected: {
    color: t.colors.onAccent,
  },
}));
