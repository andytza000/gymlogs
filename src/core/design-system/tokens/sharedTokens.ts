import type { TextStyle } from 'react-native';

const tabularNumbers: Pick<TextStyle, 'fontVariant'> = { fontVariant: ['tabular-nums'] };

export const sharedTokens = {
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  borderWidth: { hairline: 1, focus: 2 },
  size: { minTouchTarget: 44, primaryActionHeight: 52 },
  tabularNumbers,
};
