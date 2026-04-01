export const Typography = {
  fonts: {
    regular: 'Inter',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 32,
  },
  lineHeights: {
    tight: 20,
    normal: 24,
    relaxed: 32,
  },
} as const;

export type TypographyVariant = keyof typeof Typography.fonts;
