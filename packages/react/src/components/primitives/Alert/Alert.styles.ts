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
import {Theme, bem} from '@asgardeo/browser';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

/**
 * Creates styles for the Alert component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param variant - The alert variant
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string, variant: AlertVariant) => {
  return useMemo(() => {
    const baseAlert = css`
      padding: calc(${theme.vars.spacing.unit} * 2);
      border-radius: ${theme.vars.borderRadius.medium};
      border: 1px solid;
      display: flex;
      gap: calc(${theme.vars.spacing.unit} * 1.5);
      align-items: flex-start;
    `;

    const variantStyles = {
      success: css`
        background-color: ${theme.vars.colors.success.main};
        border-color: ${theme.vars.colors.success.main};
        color: ${theme.vars.colors.success.main};
      `,
      error: css`
        background-color: ${theme.vars.colors.error.main};
        border-color: ${theme.vars.colors.error.main};
        color: ${theme.vars.colors.error.main};
      `,
      warning: css`
        background-color: ${theme.vars.colors.warning.main};
        border-color: ${theme.vars.colors.warning.main};
        color: ${theme.vars.colors.warning.main};
      `,
      info: css`
        background-color: ${theme.vars.colors.info.main};
        border-color: ${theme.vars.colors.info.main};
        color: ${theme.vars.colors.info.main};
      `,
    };

    const iconStyles = css`
      flex-shrink: 0;
      margin-top: calc(${theme.vars.spacing.unit} * 0.25);
      width: calc(${theme.vars.spacing.unit} * 2.5);
      height: calc(${theme.vars.spacing.unit} * 2.5);
      color: ${theme.vars.colors[variant]?.contrastText};
    `;

    const contentStyles = css`
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: ${theme.vars.spacing.unit};
    `;

    const titleStyles = css`
      margin: 0;
      font-size: ${theme.vars.typography.fontSizes.sm};
      font-weight: 600;
      line-height: 1.4;
      color: ${theme.vars.colors[variant]?.contrastText};
    `;

    const descriptionStyles = css`
      margin: 0;
      font-size: ${theme.vars.typography.fontSizes.sm};
      line-height: 1.4;
      color: ${theme.vars.colors.text.secondary};
    `;

    return {
      alert: baseAlert,
      variant: variantStyles[variant],
      icon: iconStyles,
      content: contentStyles,
      title: titleStyles,
      description: descriptionStyles,
    };
  }, [theme, colorScheme, variant]);
};

export default useStyles;
