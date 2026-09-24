import { createContext } from 'react';

import type { ThemeName } from './tokens';

export type ThemeChoice = {
  name: ThemeName;
  setName: (name: ThemeName) => void;
};

export const ThemeChoiceContext = createContext<ThemeChoice | null>(null);
