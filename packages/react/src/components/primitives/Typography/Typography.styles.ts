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

import {css} from '@emotion/css';
import {useMemo} from 'react';
import {Theme} from '@asgardeo/browser';

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

/**
 * Creates styles for the Typography component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param variant - The typography variant
 * @param align - Text alignment
 * @param color - Color variant
 * @param noWrap - Whether text should be truncated with ellipsis
 * @param inline - Whether text should be displayed inline
 * @param gutterBottom - Whether to add bottom margin
 * @param fontWeight - Custom font weight
 * @param fontSize - Custom font size
 * @param lineHeight - Custom line height
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (
  theme: Theme,
  colorScheme: string,
  variant: TypographyVariant,
  align: TypographyAlign,
  color: TypographyColor,
  noWrap: boolean,
  inline: boolean,
  gutterBottom: boolean,
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | number,
  fontSize?: string | number,
  lineHeight?: string | number,
) => {
  return useMemo(() => {
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

    const getVariantStyles = (variantName: TypographyVariant) => {
      switch (variantName) {
        case 'h1':
          return {
            fontSize: theme.vars.typography.fontSizes['3xl'],
            fontWeight: 600,
            lineHeight: 1.235,
            letterSpacing: '-0.00735em',
          };
        case 'h2':
          return {
            fontSize: theme.vars.typography.fontSizes['2xl'],
            fontWeight: 600,
            lineHeight: 1.334,
            letterSpacing: '0em',
          };
        case 'h3':
          return {
            fontSize: theme.vars.typography.fontSizes.xl,
            fontWeight: 600,
            lineHeight: 1.6,
            letterSpacing: '0.0075em',
          };
        case 'h4':
          return {
            fontSize: theme.vars.typography.fontSizes.lg,
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: '0.00938em',
          };
        case 'h5':
          return {
            fontSize: theme.vars.typography.fontSizes.md,
            fontWeight: 600,
            lineHeight: 1.334,
            letterSpacing: '0em',
          };
        case 'h6':
          return {
            fontSize: theme.vars.typography.fontSizes.sm,
            fontWeight: 500,
            lineHeight: 1.6,
            letterSpacing: '0.0075em',
          };
        case 'subtitle1':
          return {
            fontSize: theme.vars.typography.fontSizes.md,
            fontWeight: 400,
            lineHeight: 1.75,
            letterSpacing: '0.00938em',
          };
        case 'subtitle2':
          return {
            fontSize: theme.vars.typography.fontSizes.sm,
            fontWeight: 500,
            lineHeight: 1.57,
            letterSpacing: '0.00714em',
          };
        case 'body1':
          return {
            fontSize: theme.vars.typography.fontSizes.md,
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: '0.00938em',
          };
        case 'body2':
          return {
            fontSize: theme.vars.typography.fontSizes.sm,
            fontWeight: 400,
            lineHeight: 1.43,
            letterSpacing: '0.01071em',
          };
        case 'caption':
          return {
            fontSize: theme.vars.typography.fontSizes.xs,
            fontWeight: 400,
            lineHeight: 1.66,
            letterSpacing: '0.03333em',
          };
        case 'overline':
          return {
            fontSize: theme.vars.typography.fontSizes.xs,
            fontWeight: 400,
            lineHeight: 2.66,
            letterSpacing: '0.08333em',
            textTransform: 'uppercase' as const,
          };
        case 'button':
          return {
            fontSize: theme.vars.typography.fontSizes.sm,
            fontWeight: 500,
            lineHeight: 1.75,
            letterSpacing: '0.02857em',
            textTransform: 'uppercase' as const,
          };
        default:
          return {};
      }
    };

    const variantStyles = getVariantStyles(variant);
    const colorValue = getColorValue(color);

    const typography = css`
      margin: 0;
      color: ${colorValue};
      text-align: ${align};
      display: ${inline ? 'inline' : 'block'};
      ${variantStyles.fontSize ? `font-size: ${variantStyles.fontSize};` : ''}
      ${variantStyles.fontWeight ? `font-weight: ${variantStyles.fontWeight};` : ''}
      ${variantStyles.lineHeight ? `line-height: ${variantStyles.lineHeight};` : ''}
      ${variantStyles.letterSpacing ? `letter-spacing: ${variantStyles.letterSpacing};` : ''}
      ${variantStyles.textTransform ? `text-transform: ${variantStyles.textTransform};` : ''}

      /* Custom overrides */
      ${fontWeight ? `font-weight: ${fontWeight} !important;` : ''}
      ${fontSize ? `font-size: ${typeof fontSize === 'number' ? `${fontSize}px` : fontSize} !important;` : ''}
      ${lineHeight ? `line-height: ${lineHeight} !important;` : ''}

      /* Conditional styles */
      ${noWrap
        ? `
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `
        : ''}

      ${gutterBottom
        ? `
        margin-bottom: ${theme.spacing.unit}px;
      `
        : ''}
    `;

    const typographyNoWrap = css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `;

    const typographyInline = css`
      display: inline;
    `;

    const typographyGutterBottom = css`
      margin-bottom: ${theme.spacing.unit}px;
    `;

    const typographyH1 = css`
      font-size: ${theme.vars.typography.fontSizes['3xl']};
      font-weight: 600;
      line-height: 1.235;
      letter-spacing: -0.00735em;
    `;

    const typographyH2 = css`
      font-size: ${theme.vars.typography.fontSizes['2xl']};
      font-weight: 600;
      line-height: 1.334;
      letter-spacing: 0em;
    `;

    const typographyH3 = css`
      font-size: ${theme.vars.typography.fontSizes.xl};
      font-weight: 600;
      line-height: 1.6;
      letter-spacing: 0.0075em;
    `;

    const typographyH4 = css`
      font-size: ${theme.vars.typography.fontSizes.lg};
      font-weight: 600;
      line-height: 1.5;
      letter-spacing: 0.00938em;
    `;

    const typographyH5 = css`
      font-size: ${theme.vars.typography.fontSizes.md};
      font-weight: 600;
      line-height: 1.334;
      letter-spacing: 0em;
    `;

    const typographyH6 = css`
      font-size: ${theme.vars.typography.fontSizes.sm};
      font-weight: 500;
      line-height: 1.6;
      letter-spacing: 0.0075em;
    `;

    const typographySubtitle1 = css`
      font-size: ${theme.vars.typography.fontSizes.md};
      font-weight: 400;
      line-height: 1.75;
      letter-spacing: 0.00938em;
    `;

    const typographySubtitle2 = css`
      font-size: ${theme.vars.typography.fontSizes.sm};
      font-weight: 500;
      line-height: 1.57;
      letter-spacing: 0.00714em;
    `;

    const typographyBody1 = css`
      font-size: ${theme.vars.typography.fontSizes.md};
      font-weight: 400;
      line-height: 1.5;
      letter-spacing: 0.00938em;
    `;

    const typographyBody2 = css`
      font-size: ${theme.vars.typography.fontSizes.sm};
      font-weight: 400;
      line-height: 1.43;
      letter-spacing: 0.01071em;
    `;

    const typographyCaption = css`
      font-size: ${theme.vars.typography.fontSizes.xs};
      font-weight: 400;
      line-height: 1.66;
      letter-spacing: 0.03333em;
    `;

    const typographyOverline = css`
      font-size: ${theme.vars.typography.fontSizes.xs};
      font-weight: 400;
      line-height: 2.66;
      letter-spacing: 0.08333em;
      text-transform: uppercase;
    `;

    const typographyButton = css`
      font-size: ${theme.vars.typography.fontSizes.sm};
      font-weight: 500;
      line-height: 1.75;
      letter-spacing: 0.02857em;
      text-transform: uppercase;
    `;

    return {
      typography,
      typographyNoWrap,
      typographyInline,
      typographyGutterBottom,
      typographyH1,
      typographyH2,
      typographyH3,
      typographyH4,
      typographyH5,
      typographyH6,
      typographySubtitle1,
      typographySubtitle2,
      typographyBody1,
      typographyBody2,
      typographyCaption,
      typographyOverline,
      typographyButton,
    };
  }, [theme, colorScheme, variant, align, color, noWrap, inline, gutterBottom, fontWeight, fontSize, lineHeight]);
};

export default useStyles;
