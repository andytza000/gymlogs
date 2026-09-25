import { themes } from '@/core/design-system';

export const allThemes = Object.values(themes).flatMap((themesByScheme) =>
  Object.values(themesByScheme),
);
