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

export type CardVariant = 'default' | 'outlined' | 'elevated';

/**
 * Creates styles for the Card component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param variant - The card variant
 * @param clickable - Whether the card is clickable
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string, variant: CardVariant, clickable: boolean) => {
  return useMemo(() => {
    const baseCard = css`
      border-radius: ${theme.vars.borderRadius.medium};
      background-color: ${theme.vars.colors.background.surface};
      transition: all 0.2s ease-in-out;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: calc(${theme.vars.spacing.unit} * 2);
    `;

    const variantStyles = {
      default: css`
        /* Base styles only */
      `,
      outlined: css`
        border: 1px solid ${theme.vars.colors.border};
      `,
      elevated: css`
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: none;
      `,
    };

    const clickableStyles = css`
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    `;

    const headerStyles = css`
      padding: calc(${theme.vars.spacing.unit} * 2) calc(${theme.vars.spacing.unit} * 2) 0;
      display: flex;
      flex-direction: column;
      gap: ${theme.vars.spacing.unit};
    `;

    const titleStyles = css`
      margin: 0;
      /* Typography component will handle color, fontSize, fontWeight, lineHeight */
    `;

    const descriptionStyles = css`
      margin: 0;
      color: ${theme.vars.colors.text.secondary};
      font-size: ${theme.vars.typography.fontSizes.sm};
      line-height: 1.5;
    `;

    const actionStyles = css`
      margin-top: ${theme.vars.spacing.unit};
    `;

    const contentStyles = css`
      padding: calc(${theme.vars.spacing.unit} * 2);
      flex: 1;
    `;

    const footerStyles = css`
      padding: 0 calc(${theme.vars.spacing.unit} * 2) calc(${theme.vars.spacing.unit} * 2);
      display: flex;
      align-items: center;
      gap: ${theme.vars.spacing.unit};
    `;

    return {
      card: baseCard,
      variant: variantStyles[variant],
      clickable: clickable ? clickableStyles : '',
      header: headerStyles,
      title: titleStyles,
      description: descriptionStyles,
      action: actionStyles,
      content: contentStyles,
      footer: footerStyles,
    };
  }, [theme, colorScheme, variant, clickable]);
};

export default useStyles;
