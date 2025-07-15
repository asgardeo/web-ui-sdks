/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

export type InputLabelVariant = 'block' | 'inline';

/**
 * Creates styles for the InputLabel component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param variant - The display variant of the label
 * @param error - Whether the label has an error state
 * @param marginBottom - Custom margin bottom value
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (
  theme: Theme,
  colorScheme: string,
  variant: InputLabelVariant,
  error: boolean,
  marginBottom?: string,
) => {
  return useMemo(() => {
    const baseLabel = css`
      display: ${variant};
      margin-bottom: ${marginBottom || (variant === 'block' ? `calc(${theme.vars.spacing.unit} + 1px)` : '0')};
      color: ${error ? theme.vars.colors.error.main : theme.vars.colors.text.secondary};
      font-size: ${theme.vars.typography.fontSizes.sm};
      font-weight: ${variant === 'block' ? 500 : 'normal'};
    `;

    const errorLabel = css`
      color: ${theme.vars.colors.error.main};
    `;

    const requiredIndicator = css`
      color: ${theme.vars.colors.error.main};
    `;

    const blockVariant = css`
      display: block;
      font-weight: 500;
      margin-bottom: ${marginBottom || `calc(${theme.vars.spacing.unit} + 1px)`};
    `;

    const inlineVariant = css`
      display: inline;
      font-weight: normal;
      margin-bottom: 0;
    `;

    return {
      label: baseLabel,
      error: errorLabel,
      requiredIndicator,
      block: blockVariant,
      inline: inlineVariant,
    };
  }, [theme, colorScheme, variant, error, marginBottom]);
};

export default useStyles;
