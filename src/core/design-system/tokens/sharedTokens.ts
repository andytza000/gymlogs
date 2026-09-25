import type { TextStyle } from 'react-native';

export const sharedTokens = {
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  borderWidth: { default: 1, focus: 2 },
  size: { minTouchTarget: 48, primaryActionHeight: 52 },
  tabularNumbers: { fontVariant: ['tabular-nums'] } satisfies TextStyle,
};
