import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Typography } from '@/constants/Typography';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'medium';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const getVariantStyle = () => {
    switch (type) {
      case 'title': return styles.title;
      case 'subtitle': return styles.subtitle;
      case 'defaultSemiBold': return styles.defaultSemiBold;
      case 'medium': return styles.medium;
      case 'link': return styles.link;
      default: return styles.default;
    }
  };

  return (
    <Text
      style={[
        { color },
        getVariantStyle(),
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.normal,
    fontFamily: Typography.fonts.regular,
  },
  defaultSemiBold: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.normal,
    fontFamily: Typography.fonts.semiBold,
    fontWeight: '600',
  },
  medium: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.normal,
    fontFamily: Typography.fonts.medium,
    fontWeight: '500',
  },
  title: {
    fontSize: Typography.sizes.title,
    lineHeight: Typography.lineHeights.relaxed,
    fontFamily: Typography.fonts.bold,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fonts.bold,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: Typography.sizes.md,
    color: '#0a7ea4',
    fontFamily: Typography.fonts.regular,
  },
});
