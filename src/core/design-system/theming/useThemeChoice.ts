import { useThemeContext } from './useThemeContext';

export function useThemeChoice() {
  const { theme, setFamilyName } = useThemeContext();
  return { familyName: theme.name, setFamilyName };
}
