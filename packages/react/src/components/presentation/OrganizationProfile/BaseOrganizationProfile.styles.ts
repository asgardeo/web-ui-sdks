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

/**
 * Creates styles for the BaseOrganizationProfile component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string) => {
  return useMemo(() => {
    return {
      root: css`
        padding: calc(${theme.vars.spacing.unit} * 4);
        min-width: 600px;
        margin: 0 auto;
      `,
      card: css`
        background: ${theme.vars.colors.background.surface};
        border-radius: ${theme.vars.borderRadius.large};
      `,
      header: css`
        display: flex;
        align-items: center;
        gap: calc(${theme.vars.spacing.unit} * 2);
        margin-bottom: calc(${theme.vars.spacing.unit} * 3);
        padding-bottom: calc(${theme.vars.spacing.unit} * 2);
      `,
      orgInfo: css`
        flex: 1;
      `,
      name: css`
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: ${theme.vars.colors.text.primary};
      `,
      handle: css`
        font-size: 1rem;
        color: ${theme.vars.colors.text.secondary};
        margin: 0;
        font-family: monospace;
      `,
      infoContainer: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.vars.spacing.unit};
      `,
      field: css`
        display: flex;
        align-items: flex-start;
        padding: calc(${theme.vars.spacing.unit} / 2) 0;
        border-bottom: 1px solid ${theme.vars.colors.border};
        min-height: 28px;
        gap: ${theme.vars.spacing.unit};
      `,
      fieldLast: css`
        border-bottom: none;
      `,
      fieldContent: css`
        flex: 1;
        display: flex;
        align-items: center;
        gap: ${theme.vars.spacing.unit};
      `,
      fieldActions: css`
        display: flex;
        align-items: center;
        gap: calc(${theme.vars.spacing.unit} / 2);
      `,
      label: css`
        font-size: 0.875rem;
        font-weight: 500;
        color: ${theme.vars.colors.text.secondary};
        width: 120px;
        flex-shrink: 0;
        line-height: 28px;
      `,
      value: css`
        color: ${theme.vars.colors.text.primary};
        flex: 1;
        display: flex;
        align-items: center;
        gap: ${theme.vars.spacing.unit};
        overflow: hidden;
        min-height: 28px;
        line-height: 28px;
        word-break: break-word;
      `,
      valueEmpty: css`
        font-style: italic;
        opacity: 0.7;
      `,
      statusBadge: css`
        padding: calc(${theme.vars.spacing.unit} / 2) ${theme.vars.spacing.unit};
        border-radius: ${theme.vars.borderRadius.small};
        font-size: 0.75rem;
        font-weight: 500;
        color: white;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      `,
      permissionsList: css`
        display: flex;
        flex-wrap: wrap;
        gap: calc(${theme.vars.spacing.unit} / 2);
      `,
      permissionBadge: css`
        padding: calc(${theme.vars.spacing.unit} / 4) ${theme.vars.spacing.unit};
        border-radius: ${theme.vars.borderRadius.small};
        font-size: 0.75rem;
        background-color: ${theme.vars.colors.primary.main};
        color: ${theme.vars.colors.primary.contrastText};
        border: 1px solid ${theme.vars.colors.border};
      `,
      attributesList: css`
        display: flex;
        flex-direction: column;
        gap: calc(${theme.vars.spacing.unit} / 4);
      `,
      attributeItem: css`
        display: flex;
        gap: ${theme.vars.spacing.unit};
        padding: calc(${theme.vars.spacing.unit} / 4) 0;
        align-items: center;
      `,
      attributeKey: css`
        font-size: 0.75rem;
        font-weight: 500;
        color: ${theme.vars.colors.text.secondary};
        min-width: 80px;
        flex-shrink: 0;
      `,
      attributeValue: css`
        font-size: 0.75rem;
        color: ${theme.vars.colors.text.primary};
        word-break: break-word;
        flex: 1;
      `,
      popup: css`
        padding: calc(${theme.vars.spacing.unit} * 2);
      `,
      editButton: css`
        min-width: auto;
        padding: calc(${theme.vars.spacing.unit} / 2);
        min-height: auto;
      `,
      placeholderButton: css`
        font-style: italic;
        text-decoration: underline;
        opacity: 0.7;
        padding: 0;
        min-height: auto;
      `,
      fieldInput: css`
        margin-bottom: 0;
      `,
    };
  }, [theme, colorScheme]);
};

export default useStyles;
