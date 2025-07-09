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
 * Creates styles for the BaseOrganizationProfile component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string) => {
  return useMemo(() => {
    const cssOrganizationProfile = css`
      padding: calc(${theme.vars.spacing.unit} * 4);
      min-width: 600px;
      margin: 0 auto;

      &--card {
        background: ${theme.vars.colors.background.surface};
        border-radius: ${theme.vars.borderRadius.large};
      }

      &__header {
        display: flex;
        align-items: center;
        gap: calc(${theme.vars.spacing.unit} * 2);
        margin-bottom: calc(${theme.vars.spacing.unit} * 3);
        padding-bottom: calc(${theme.vars.spacing.unit} * 2);
      }

      &__org-info {
        flex: 1;
      }

      &__name {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: ${theme.vars.colors.text.primary};
      }

      &__handle {
        font-size: 1rem;
        color: ${theme.vars.colors.text.secondary};
        margin: 0;
        font-family: monospace;
      }

      &__info-container {
        display: flex;
        flex-direction: column;
        gap: ${theme.vars.spacing.unit};
      }

      &__field {
        display: flex;
        align-items: flex-start;
        padding: calc(${theme.vars.spacing.unit} / 2) 0;
        border-bottom: 1px solid ${theme.vars.colors.border};
        min-height: 28px;
        gap: ${theme.vars.spacing.unit};

        &--last {
          border-bottom: none;
        }
      }

      &__field-content {
        flex: 1;
        display: flex;
        align-items: center;
        gap: ${theme.vars.spacing.unit};
      }

      &__field-actions {
        display: flex;
        align-items: center;
        gap: calc(${theme.vars.spacing.unit} / 2);
      }

      &__label {
        font-size: 0.875rem;
        font-weight: 500;
        color: ${theme.vars.colors.text.secondary};
        width: 120px;
        flex-shrink: 0;
        line-height: 28px;
      }

      &__value {
        color: ${theme.vars.colors.text.primary};
        flex: 1;
        display: flex;
        align-items: center;
        gap: ${theme.vars.spacing.unit};
        overflow: hidden;
        min-height: 28px;
        line-height: 28px;
        word-break: break-word;

        &--empty {
          font-style: italic;
          opacity: 0.7;
        }
      }

      &__status-badge {
        padding: calc(${theme.vars.spacing.unit} / 2) ${theme.vars.spacing.unit};
        border-radius: ${theme.vars.borderRadius.small};
        font-size: 0.75rem;
        font-weight: 500;
        color: white;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      &__permissions-list {
        display: flex;
        flex-wrap: wrap;
        gap: calc(${theme.vars.spacing.unit} / 2);
      }

      &__permission-badge {
        padding: calc(${theme.vars.spacing.unit} / 4) ${theme.vars.spacing.unit};
        border-radius: ${theme.vars.borderRadius.small};
        font-size: 0.75rem;
        background-color: ${theme.vars.colors.primary.main};
        color: ${theme.vars.colors.primary.contrastText};
        border: 1px solid ${theme.vars.colors.border};
      }

      &__attributes-list {
        display: flex;
        flex-direction: column;
        gap: calc(${theme.vars.spacing.unit} / 4);
      }

      &__attribute-item {
        display: flex;
        gap: ${theme.vars.spacing.unit};
        padding: calc(${theme.vars.spacing.unit} / 4) 0;
        align-items: center;
      }

      &__attribute-key {
        font-size: 0.75rem;
        font-weight: 500;
        color: ${theme.vars.colors.text.secondary};
        min-width: 80px;
        flex-shrink: 0;
      }

      &__attribute-value {
        font-size: 0.75rem;
        color: ${theme.vars.colors.text.primary};
        word-break: break-word;
        flex: 1;
      }

      &__popup {
        padding: calc(${theme.vars.spacing.unit} * 2);
      }

      &__edit-button {
        min-width: auto;
        padding: calc(${theme.vars.spacing.unit} / 2);
        min-height: auto;
      }

      &__placeholder-button {
        font-style: italic;
        text-decoration: underline;
        opacity: 0.7;
        padding: 0;
        min-height: auto;
      }

      &__field-input {
        margin-bottom: 0;
      }
    `;

    return {
      organizationProfile: cssOrganizationProfile,
      'organizationProfile--card': bem(cssOrganizationProfile, null, 'card'),
      organizationProfile__header: bem(cssOrganizationProfile, 'header'),
      organizationProfile__orgInfo: bem(cssOrganizationProfile, 'org-info'),
      organizationProfile__name: bem(cssOrganizationProfile, 'name'),
      organizationProfile__handle: bem(cssOrganizationProfile, 'handle'),
      organizationProfile__infoContainer: bem(cssOrganizationProfile, 'info-container'),
      organizationProfile__field: bem(cssOrganizationProfile, 'field'),
      'organizationProfile__field--last': bem(cssOrganizationProfile, 'field', 'last'),
      organizationProfile__fieldContent: bem(cssOrganizationProfile, 'field-content'),
      organizationProfile__fieldActions: bem(cssOrganizationProfile, 'field-actions'),
      organizationProfile__label: bem(cssOrganizationProfile, 'label'),
      organizationProfile__value: bem(cssOrganizationProfile, 'value'),
      'organizationProfile__value--empty': bem(cssOrganizationProfile, 'value', 'empty'),
      organizationProfile__statusBadge: bem(cssOrganizationProfile, 'status-badge'),
      organizationProfile__permissionsList: bem(cssOrganizationProfile, 'permissions-list'),
      organizationProfile__permissionBadge: bem(cssOrganizationProfile, 'permission-badge'),
      organizationProfile__attributesList: bem(cssOrganizationProfile, 'attributes-list'),
      organizationProfile__attributeItem: bem(cssOrganizationProfile, 'attribute-item'),
      organizationProfile__attributeKey: bem(cssOrganizationProfile, 'attribute-key'),
      organizationProfile__attributeValue: bem(cssOrganizationProfile, 'attribute-value'),
      organizationProfile__popup: bem(cssOrganizationProfile, 'popup'),
      organizationProfile__editButton: bem(cssOrganizationProfile, 'edit-button'),
      organizationProfile__placeholderButton: bem(cssOrganizationProfile, 'placeholder-button'),
      organizationProfile__fieldInput: bem(cssOrganizationProfile, 'field-input'),
    };
  }, [theme, colorScheme]);
};

export default useStyles;
