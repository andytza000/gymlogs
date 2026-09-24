import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import type { Theme } from './tokens';
import { useTheme } from './useTheme';

// Styles are built from the active theme when used, never at module load,
// so switching themes at runtime restyles everything.
//   const useStyles = makeStyles((t) => ({ card: { backgroundColor: t.colors.surface } }));
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: Theme) => T,
): () => T {
  return function useStyles() {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
