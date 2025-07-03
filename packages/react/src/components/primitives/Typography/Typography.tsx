/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {CSSProperties, FC, ReactNode, ComponentPropsWithoutRef, ElementType} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import clsx from 'clsx';

// Typography variants mapped to HTML elements and styling
export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'button';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  | 'textPrimary'
  | 'textSecondary'
  | 'inherit';

export interface TypographyProps {
  /**
   * The content to be rendered
   */
  children: ReactNode;
  /**
   * The typography variant to apply
   */
  variant?: TypographyVariant;
  /**
   * The HTML element or React component to render
   */
  component?: ElementType;
  /**
   * Text alignment
   */
  align?: TypographyAlign;
  /**
   * Color variant
   */
  color?: TypographyColor;
  /**
   * Whether the text should be clipped with ellipsis when it overflows
   */
  noWrap?: boolean;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: CSSProperties;
  /**
   * Whether the text should be displayed inline
   */
  inline?: boolean;
  /**
   * Custom font weight
   */
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | number;
  /**
   * Custom font size (overrides variant sizing)
   */
  fontSize?: string | number;
  /**
   * Line height
   */
  lineHeight?: string | number;
  /**
   * Whether to disable gutters (margin bottom)
   */
  gutterBottom?: boolean;
}

// Default component mapping for variants
const variantMapping: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span',
  button: 'span',
};

/**
 * Typography component for consistent text rendering throughout the application.
 * Integrates with the theme system and provides semantic HTML elements.
 */
const Typography: FC<TypographyProps> = ({
  children,
  variant = 'body1',
  component,
  align = 'left',
  color = 'textPrimary',
  noWrap = false,
  className,
  style = {},
  inline = false,
  fontWeight,
  fontSize,
  lineHeight,
  gutterBottom = false,
  ...rest
}) => {
  const {theme} = useTheme();

  // Determine the component to render
  const Component = component || variantMapping[variant] || 'span';

  // Get color value from theme
  const getColorValue = (colorVariant: TypographyColor): string => {
    switch (colorVariant) {
      case 'primary':
        return theme.colors.primary.main;
      case 'secondary':
        return theme.colors.secondary.main;
      case 'error':
        return theme.colors.error.main;
      case 'textPrimary':
        return theme.colors.text.primary;
      case 'textSecondary':
        return theme.colors.text.secondary;
      case 'inherit':
        return 'inherit';
      default:
        return theme.colors.text.primary;
    }
  };

  // Get variant styles
  const getVariantStyles = (variantName: TypographyVariant): CSSProperties => {
    const baseUnit = theme.spacing.unit;

    switch (variantName) {
      case 'h1':
        return {
          fontSize: theme.vars.typography.fontSizes['3xl'], // 34px
          fontWeight: 600,
          lineHeight: 1.235,
          letterSpacing: '-0.00735em',
        };
      case 'h2':
        return {
          fontSize: theme.vars.typography.fontSizes['2xl'], // 24px
          fontWeight: 600,
          lineHeight: 1.334,
          letterSpacing: '0em',
        };
      case 'h3':
        return {
          fontSize: theme.vars.typography.fontSizes.xl, // 20px
          fontWeight: 600,
          lineHeight: 1.6,
          letterSpacing: '0.0075em',
        };
      case 'h4':
        return {
          fontSize: theme.vars.typography.fontSizes.lg, // 18px
          fontWeight: 600,
          lineHeight: 1.5,
          letterSpacing: '0.00938em',
        };
      case 'h5':
        return {
          fontSize: theme.vars.typography.fontSizes.md, // 16px
          fontWeight: 600,
          lineHeight: 1.334,
          letterSpacing: '0em',
        };
      case 'h6':
        return {
          fontSize: theme.vars.typography.fontSizes.sm, // 14px
          fontWeight: 500,
          lineHeight: 1.6,
          letterSpacing: '0.0075em',
        };
      case 'subtitle1':
        return {
          fontSize: theme.vars.typography.fontSizes.md, // 16px
          fontWeight: 400,
          lineHeight: 1.75,
          letterSpacing: '0.00938em',
        };
      case 'subtitle2':
        return {
          fontSize: theme.vars.typography.fontSizes.sm, // 14px
          fontWeight: 500,
          lineHeight: 1.57,
          letterSpacing: '0.00714em',
        };
      case 'body1':
        return {
          fontSize: theme.vars.typography.fontSizes.md, // 16px
          fontWeight: 400,
          lineHeight: 1.5,
          letterSpacing: '0.00938em',
        };
      case 'body2':
        return {
          fontSize: theme.vars.typography.fontSizes.sm, // 14px
          fontWeight: 400,
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
        };
      case 'caption':
        return {
          fontSize: theme.vars.typography.fontSizes.xs, // 12px
          fontWeight: 400,
          lineHeight: 1.66,
          letterSpacing: '0.03333em',
        };
      case 'overline':
        return {
          fontSize: theme.vars.typography.fontSizes.xs, // 12px
          fontWeight: 400,
          lineHeight: 2.66,
          letterSpacing: '0.08333em',
          textTransform: 'uppercase',
        };
      case 'button':
        return {
          fontSize: theme.vars.typography.fontSizes.sm, // 14px
          fontWeight: 500,
          lineHeight: 1.75,
          letterSpacing: '0.02857em',
          textTransform: 'uppercase',
        };
      default:
        return {};
    }
  };

  const variantStyles = getVariantStyles(variant);

  const typographyStyle: CSSProperties = {
    margin: 0,
    color: getColorValue(color),
    textAlign: align,
    display: inline ? 'inline' : variantMapping[variant] === 'span' ? 'inline' : 'block',
    ...variantStyles,
    // Custom overrides
    ...(fontWeight && {fontWeight}),
    ...(fontSize && {fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize}),
    ...(lineHeight && {lineHeight}),
    ...(noWrap && {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
    ...(gutterBottom && {
      marginBottom: theme.spacing.unit + 'px',
    }),
    ...style,
  };

  const classes = clsx(
    'wso2-typography',
    `wso2-typography-${variant}`,
    {
      'wso2-typography-noWrap': noWrap,
      'wso2-typography-inline': inline,
      'wso2-typography-gutterBottom': gutterBottom,
    },
    className,
  );

  return (
    <Component className={classes} style={typographyStyle} {...rest}>
      {children}
    </Component>
  );
};

export default Typography;
