import { Pressable, Text, View } from 'react-native';

import { makeStyles, themeFamilies, useThemeFamily } from '@/core/design-system';

export default function Index() {
  const styles = useStyles();
  const { familyName, setFamilyName } = useThemeFamily();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GymLogs</Text>
      <View style={styles.familyOptions}>
        {themeFamilies.map(({ name, label }) => {
          const selected = name === familyName;
          return (
            <Pressable
              key={name}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setFamilyName(name)}
              style={[styles.familyOption, selected && styles.familyOptionSelected]}
            >
              <Text
                style={[styles.familyOptionLabel, selected && styles.familyOptionLabelSelected]}
              >
                {label}
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
  familyOptions: {
    flexDirection: 'row',
    gap: t.spacing.sm,
  },
  familyOption: {
    minHeight: t.size.minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: t.spacing.xl,
    borderRadius: t.radius.control,
    borderWidth: t.borderWidth.hairline,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  familyOptionSelected: {
    borderColor: t.colors.accent,
    backgroundColor: t.colors.accent,
  },
  familyOptionLabel: {
    ...t.typography.heading,
    color: t.colors.text,
  },
  familyOptionLabelSelected: {
    color: t.colors.onAccent,
  },
}));
