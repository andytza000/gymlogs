import { useThemeContext } from './useThemeContext';

export function useThemeFamily() {
  const { theme, setFamilyName } = useThemeContext();
  return { familyName: theme.familyName, setFamilyName };
}
