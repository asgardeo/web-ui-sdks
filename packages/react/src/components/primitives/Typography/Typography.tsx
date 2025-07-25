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
import {cx} from '@emotion/css';
import {withVendorCSSClassPrefix, bem} from '@asgardeo/browser';
import useStyles, {TypographyVariant, TypographyAlign, TypographyColor} from './Typography.styles';

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
  const {theme, colorScheme} = useTheme();
  const styles = useStyles(
    theme,
    colorScheme,
    variant,
    align,
    color,
    noWrap,
    inline,
    gutterBottom,
    fontWeight,
    fontSize,
    lineHeight,
  );

  const Component = component || variantMapping[variant] || 'span';

  const getVariantClass = (variantName: TypographyVariant) => {
    switch (variantName) {
      case 'h1':
        return styles.typographyH1;
      case 'h2':
        return styles.typographyH2;
      case 'h3':
        return styles.typographyH3;
      case 'h4':
        return styles.typographyH4;
      case 'h5':
        return styles.typographyH5;
      case 'h6':
        return styles.typographyH6;
      case 'subtitle1':
        return styles.typographySubtitle1;
      case 'subtitle2':
        return styles.typographySubtitle2;
      case 'body1':
        return styles.typographyBody1;
      case 'body2':
        return styles.typographyBody2;
      case 'caption':
        return styles.typographyCaption;
      case 'overline':
        return styles.typographyOverline;
      case 'button':
        return styles.typographyButton;
      default:
        return '';
    }
  };

  const typographyClassName = cx(
    withVendorCSSClassPrefix(bem('typography')),
    withVendorCSSClassPrefix(bem('typography', variant)),
    styles.typography,
    getVariantClass(variant),
    noWrap && styles.typographyNoWrap,
    inline && styles.typographyInline,
    gutterBottom && styles.typographyGutterBottom,
    className,
  );

  return (
    <Component className={typographyClassName} style={style} {...rest}>
      {children}
    </Component>
  );
};

export default Typography;
