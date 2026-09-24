import { createContext } from 'react';

import type { Theme } from './tokens';

export const ThemeContext = createContext<Theme | null>(null);
