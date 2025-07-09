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
import {bem, Theme} from '@asgardeo/browser';

/**
 * Creates styles for the BaseOrganizationSwitcher component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string) => {
  return useMemo(() => {
    const cssOrganizationSwitcher = css`
      /* Base styles for the organization switcher component */
      display: inline-block;
      position: relative;

      &__trigger {
        display: inline-flex;
        align-items: center;
        gap: ${theme.vars.spacing.unit};
        padding: calc(${theme.vars.spacing.unit} * 0.75) ${theme.vars.spacing.unit};
        border: 1px solid ${theme.vars.colors.border};
        background: ${theme.vars.colors.background.surface};
        cursor: pointer;
        border-radius: ${theme.vars.borderRadius.medium};
        min-width: 160px;

        &:hover {
          background-color: ${theme.vars.colors.background.surface};
        }
      }

      &__trigger-label {
        color: ${theme.vars.colors.text.primary};
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }

      &__content {
        min-width: 280px;
        max-width: 400px;
        background-color: ${theme.vars.colors.background.surface};
        border-radius: ${theme.vars.borderRadius.medium};
        box-shadow: ${theme.vars.shadows.medium};
        border: 1px solid ${theme.vars.colors.border};
        outline: none;
        z-index: 1000;
      }

      &__header {
        display: flex;
        align-items: center;
        gap: ${theme.vars.spacing.unit};
        padding: ${theme.vars.spacing.unit} calc(${theme.vars.spacing.unit} * 2);
      }

      &__header-info {
        display: flex;
        flex-direction: column;
        gap: calc(${theme.vars.spacing.unit} / 4);
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }

      &__header-name {
        color: ${theme.vars.colors.text.primary};
        font-size: 0.875rem;
        font-weight: 500;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__header-meta {
        color: ${theme.vars.colors.text.secondary};
        font-size: 0.75rem;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__header-role {
        color: ${theme.vars.colors.text.secondary};
        font-size: 0.75rem;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-transform: capitalize;
      }

      &__manage-button {
        min-width: auto;
        margin-left: auto;
      }

      &__menu {
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      &__menu-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: ${theme.vars.spacing.unit};
        padding: calc(${theme.vars.spacing.unit} * 1.5) calc(${theme.vars.spacing.unit} * 2);
        width: 100%;
        color: ${theme.vars.colors.text.primary};
        text-decoration: none;
        border: none;
        background-color: transparent;
        cursor: pointer;
        font-size: 0.875rem;
        text-align: left;
        border-radius: ${theme.vars.borderRadius.medium};
        transition: background-color 0.15s ease-in-out;

        &:hover {
          background-color: ${theme.vars.colors.action?.hover || 'rgba(0, 0, 0, 0.04)'};
        }
      }

      &__menu-divider {
        margin: calc(${theme.vars.spacing.unit} * 0.5) 0;
        border-bottom: 1px solid ${theme.vars.colors.border};
      }

      &__organization-info {
        display: flex;
        flex-direction: column;
        gap: calc(${theme.vars.spacing.unit} / 4);
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }

      &__organization-name {
        color: ${theme.vars.colors.text.primary};
        font-size: 0.875rem;
        font-weight: 500;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__organization-meta {
        color: ${theme.vars.colors.text.secondary};
        font-size: 0.75rem;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 80px;
        gap: ${theme.vars.spacing.unit};
      }

      &__loading-text {
        color: ${theme.vars.colors.text.secondary};
        font-size: 0.875rem;
      }

      &__error-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 80px;
        padding: calc(${theme.vars.spacing.unit} * 2);
      }

      &__error-text {
        color: ${theme.vars.colors.text.secondary};
        font-size: 0.875rem;
        text-align: center;
      }

      &__section-header {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: ${theme.vars.colors.text.secondary};
      }

      &__section-header-container {
        border-top: none;
        border-bottom: none;
        padding-bottom: calc(${theme.vars.spacing.unit} / 2);
      }

      &__role-capitalized {
        text-transform: capitalize;
      }
    `;

    return {
      organizationSwitcher: cssOrganizationSwitcher,
      organizationSwitcher__trigger: bem(cssOrganizationSwitcher, 'trigger'),
      organizationSwitcher__triggerLabel: bem(cssOrganizationSwitcher, 'trigger-label'),
      organizationSwitcher__content: bem(cssOrganizationSwitcher, 'content'),
      organizationSwitcher__header: bem(cssOrganizationSwitcher, 'header'),
      organizationSwitcher__headerInfo: bem(cssOrganizationSwitcher, 'header-info'),
      organizationSwitcher__headerName: bem(cssOrganizationSwitcher, 'header-name'),
      organizationSwitcher__headerMeta: bem(cssOrganizationSwitcher, 'header-meta'),
      organizationSwitcher__headerRole: bem(cssOrganizationSwitcher, 'header-role'),
      organizationSwitcher__manageButton: bem(cssOrganizationSwitcher, 'manage-button'),
      organizationSwitcher__menu: bem(cssOrganizationSwitcher, 'menu'),
      organizationSwitcher__menuItem: bem(cssOrganizationSwitcher, 'menu-item'),
      organizationSwitcher__menuDivider: bem(cssOrganizationSwitcher, 'menu-divider'),
      organizationSwitcher__organizationInfo: bem(cssOrganizationSwitcher, 'organization-info'),
      organizationSwitcher__organizationName: bem(cssOrganizationSwitcher, 'organization-name'),
      organizationSwitcher__organizationMeta: bem(cssOrganizationSwitcher, 'organization-meta'),
      organizationSwitcher__loadingContainer: bem(cssOrganizationSwitcher, 'loading-container'),
      organizationSwitcher__loadingText: bem(cssOrganizationSwitcher, 'loading-text'),
      organizationSwitcher__errorContainer: bem(cssOrganizationSwitcher, 'error-container'),
      organizationSwitcher__errorText: bem(cssOrganizationSwitcher, 'error-text'),
      organizationSwitcher__sectionHeader: bem(cssOrganizationSwitcher, 'section-header'),
      organizationSwitcher__sectionHeaderContainer: bem(cssOrganizationSwitcher, 'section-header-container'),
      organizationSwitcher__roleCapitalized: bem(cssOrganizationSwitcher, 'role-capitalized'),
    };
  }, [theme, colorScheme]);
};

export default useStyles;
