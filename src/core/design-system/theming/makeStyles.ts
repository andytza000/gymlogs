import { StyleSheet } from 'react-native';

import type { Theme } from '../tokens/types';
import { useTheme } from './useTheme';

// Styles are built from the active theme when used, never at module load,
// so switching themes at runtime restyles everything.
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  buildStyles: (theme: Theme) => T,
): () => T {
  const stylesByTheme = new WeakMap<Theme, T>();
  return function useStyles() {
    const theme = useTheme();
    let styles = stylesByTheme.get(theme);
    if (!styles) {
      styles = StyleSheet.create(buildStyles(theme));
      stylesByTheme.set(theme, styles);
    }
    return styles;
  };
}
