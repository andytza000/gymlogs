import type { Theme } from '../tokens/types';
import { useThemeContext } from './useThemeContext';

export function useTheme(): Theme {
  return useThemeContext().theme;
}
