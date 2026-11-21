import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { typography, type TypeStyle, type TypographyVariant } from '@/src/theme/typography';
import { useTheme } from '@/src/theme/ThemeProvider';
import type { ThemeColors } from '@/src/theme/themes';

export type TextTone =
  | 'text'
  | 'textSecondary'
  | 'textTertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'onAccent';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  tone?: TextTone;
  color?: string;
  align?: TextStyle['textAlign'];
}

export function Text({
  variant = 'body',
  tone = 'text',
  color,
  align,
  style,
  allowFontScaling = true,
  ...rest
}: TextProps) {
  const { colors } = useTheme();
  const type: TypeStyle = typography[variant];

  return (
    <RNText
      allowFontScaling={allowFontScaling}
      style={[
        {
          fontFamily: type.fontFamily,
          fontSize: type.fontSize,
          lineHeight: type.lineHeight,
          fontWeight: type.fontWeight,
          letterSpacing: type.letterSpacing,
          textTransform: type.textTransform,
          color: color ?? colors[tone as keyof ThemeColors],
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    />
  );
}
