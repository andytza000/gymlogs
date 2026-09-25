import { createContext } from 'react';

import type { Theme, ThemeFamilyName } from '../tokens/types';

export type ThemeContextValue = {
  theme: Theme;
  setFamilyName: (familyName: ThemeFamilyName) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
