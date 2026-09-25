import { type ReactNode, useMemo, useState } from 'react';

import { defaultFamilyName, themes } from '../tokens/themes';
import type { ColorScheme, ThemeFamilyName } from '../tokens/types';
import { ThemeContext } from './themeContext';

type Props = {
  scheme: ColorScheme;
  initialFamilyName?: ThemeFamilyName;
  children: ReactNode;
};

// The scheme is a prop, never read from the OS here: the app root passes the
// phone's setting, and tests render light and dark without mocking.
export function ThemeProvider({ scheme, initialFamilyName = defaultFamilyName, children }: Props) {
  const [familyName, setFamilyName] = useState(initialFamilyName);
  const theme = themes[familyName][scheme];
  const value = useMemo(() => ({ theme, setFamilyName }), [theme]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}
