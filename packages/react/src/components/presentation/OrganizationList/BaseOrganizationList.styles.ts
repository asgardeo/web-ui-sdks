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
 * Creates styles for the BaseOrganizationList component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string) => {
  return useMemo(() => {
    const cssOrganizationList = css`
      padding: calc(${theme.vars.spacing.unit} * 4);
      min-width: 600px;
      margin: 0 auto;
      background: ${theme.vars.colors.background.surface};
      border-radius: ${theme.vars.borderRadius.large};

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: calc(${theme.vars.spacing.unit} * 3);
        padding-bottom: calc(${theme.vars.spacing.unit} * 2);
        border-bottom: 1px solid ${theme.vars.colors.border};
      }

      &__header-info {
        flex: 1;
      }

      &__title {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: ${theme.vars.colors.text.primary};
      }

      &__subtitle {
        color: ${theme.vars.colors.text.secondary};
        font-size: 0.875rem;
        margin: 0;
      }

      &__refresh-button {
        background-color: ${theme.vars.colors.background.surface};
        border: 1px solid ${theme.vars.colors.border};
        border-radius: ${theme.vars.borderRadius.small};
        color: ${theme.vars.colors.text.primary};
        cursor: pointer;
        font-size: 0.875rem;
        padding: ${theme.vars.spacing.unit} calc(${theme.vars.spacing.unit} * 2);
        transition: all 0.2s;

        &:hover {
          background-color: ${theme.vars.colors.background.surface};
          border-color: ${theme.vars.colors.primary.main};
        }
      }

      &__list-container {
        display: flex;
        flex-direction: column;
        gap: calc(${theme.vars.spacing.unit} * 1.5);
      }

      &__organization-item {
        border: 1px solid ${theme.vars.colors.border};
        border-radius: ${theme.vars.borderRadius.medium};
        display: flex;
        justify-content: space-between;
        padding: calc(${theme.vars.spacing.unit} * 2);
        transition: all 0.2s;
        background-color: ${theme.vars.colors.background.surface};

        &:hover {
          border-color: ${theme.vars.colors.primary.main};
          box-shadow: 0 2px 8px ${theme.vars.colors.primary.main}20;
        }
      }

      &__organization-content {
        display: flex;
        align-items: center;
        gap: calc(${theme.vars.spacing.unit} * 2);
        flex: 1;
      }

      &__organization-info {
        flex: 1;
      }

      &__organization-name {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 4px 0;
        color: ${theme.vars.colors.text.primary};
      }

      &__organization-handle {
        color: ${theme.vars.colors.text.secondary};
        font-size: 0.875rem;
        margin: 0 0 4px 0;
        font-family: monospace;
      }

      &__organization-status {
        color: ${theme.vars.colors.text.secondary};
        font-size: 0.875rem;
        margin: 0;
      }

      &__status-text {
        font-weight: 500;

        &--active {
          color: ${theme.vars.colors.success.main};
        }

        &--inactive {
          color: ${theme.vars.colors.error.main};
        }
      }

      &__organization-actions {
        display: flex;
        align-items: center;
      }

      &__badge {
        border-radius: ${theme.vars.borderRadius.large};
        font-size: 0.75rem;
        font-weight: 500;
        padding: calc(${theme.vars.spacing.unit} / 2) calc(${theme.vars.spacing.unit} * 1.5);
        text-transform: uppercase;
        letter-spacing: 0.5px;

        &--success {
          background-color: color-mix(in srgb, ${theme.vars.colors.success.main} 20%, transparent);
          color: ${theme.vars.colors.success.main};
        }

        &--error {
          background-color: color-mix(in srgb, ${theme.vars.colors.error.main} 20%, transparent);
          color: ${theme.vars.colors.error.main};
        }
      }

      &__loading-container {
        padding: calc(${theme.vars.spacing.unit} * 4);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: calc(${theme.vars.spacing.unit} * 2);
      }

      &__loading-text {
        margin-top: ${theme.vars.spacing.unit};
      }

      &__error-container {
        background-color: color-mix(in srgb, ${theme.vars.colors.error.main} 20%, transparent);
        border: 1px solid ${theme.vars.colors.error.main};
        border-radius: ${theme.vars.borderRadius.medium};
        color: ${theme.vars.colors.error.main};
        padding: calc(${theme.vars.spacing.unit} * 2);
      }

      &__empty-container {
        padding: calc(${theme.vars.spacing.unit} * 4);
        text-align: center;
      }

      &__empty-text {
        color: ${theme.vars.colors.text.secondary};
        font-size: 1rem;
      }

      &__load-more-button {
        background-color: ${theme.vars.colors.primary.main};
        border: none;
        border-radius: ${theme.vars.borderRadius.medium};
        color: ${theme.vars.colors.primary.contrastText};
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        padding: calc(${theme.vars.spacing.unit} * 1.5) calc(${theme.vars.spacing.unit} * 3);
        width: 100%;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          background-color: ${theme.vars.colors.primary.main};
          opacity: 0.9;
        }

        &:disabled {
          background-color: ${theme.vars.colors.text.secondary};
          cursor: not-allowed;
          opacity: 0.6;
        }
      }

      &__error-margin {
        margin-top: calc(${theme.vars.spacing.unit} * 2);
      }

      &__load-more-margin {
        margin-top: calc(${theme.vars.spacing.unit} * 3);
      }

      &__popup-content {
        padding: ${theme.vars.spacing.unit};
      }
    `;

    return {
      organizationList: cssOrganizationList,
      organizationList__header: bem(cssOrganizationList, 'header'),
      organizationList__headerInfo: bem(cssOrganizationList, 'header-info'),
      organizationList__title: bem(cssOrganizationList, 'title'),
      organizationList__subtitle: bem(cssOrganizationList, 'subtitle'),
      organizationList__refreshButton: bem(cssOrganizationList, 'refresh-button'),
      organizationList__listContainer: bem(cssOrganizationList, 'list-container'),
      organizationList__organizationItem: bem(cssOrganizationList, 'organization-item'),
      organizationList__organizationContent: bem(cssOrganizationList, 'organization-content'),
      organizationList__organizationInfo: bem(cssOrganizationList, 'organization-info'),
      organizationList__organizationName: bem(cssOrganizationList, 'organization-name'),
      organizationList__organizationHandle: bem(cssOrganizationList, 'organization-handle'),
      organizationList__organizationStatus: bem(cssOrganizationList, 'organization-status'),
      organizationList__statusText: bem(cssOrganizationList, 'status-text'),
      'organizationList__statusText--active': bem(cssOrganizationList, 'status-text', 'active'),
      'organizationList__statusText--inactive': bem(cssOrganizationList, 'status-text', 'inactive'),
      organizationList__organizationActions: bem(cssOrganizationList, 'organization-actions'),
      organizationList__badge: bem(cssOrganizationList, 'badge'),
      'organizationList__badge--success': bem(cssOrganizationList, 'badge', 'success'),
      'organizationList__badge--error': bem(cssOrganizationList, 'badge', 'error'),
      organizationList__loadingContainer: bem(cssOrganizationList, 'loading-container'),
      organizationList__loadingText: bem(cssOrganizationList, 'loading-text'),
      organizationList__errorContainer: bem(cssOrganizationList, 'error-container'),
      organizationList__emptyContainer: bem(cssOrganizationList, 'empty-container'),
      organizationList__emptyText: bem(cssOrganizationList, 'empty-text'),
      organizationList__loadMoreButton: bem(cssOrganizationList, 'load-more-button'),
      organizationList__errorMargin: bem(cssOrganizationList, 'error-margin'),
      organizationList__loadMoreMargin: bem(cssOrganizationList, 'load-more-margin'),
      organizationList__popupContent: bem(cssOrganizationList, 'popup-content'),
    };
  }, [theme, colorScheme]);
};

export default useStyles;
