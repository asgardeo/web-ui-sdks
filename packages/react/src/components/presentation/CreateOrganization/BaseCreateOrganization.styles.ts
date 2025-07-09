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
 * Creates styles for the BaseCreateOrganization component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string) => {
  return useMemo(() => {
    const cssCreateOrganization = css`
      padding: calc(${theme.vars.spacing.unit} * 4);
      min-width: 600px;
      margin: 0 auto;

      &--card {
        background: ${theme.vars.colors.background.surface};
        border-radius: ${theme.vars.borderRadius.large};
        padding: calc(${theme.vars.spacing.unit} * 4);
      }

      &__content {
        display: flex;
        flex-direction: column;
        gap: calc(${theme.vars.spacing.unit} * 2);
      }

      &__form {
        display: flex;
        flex-direction: column;
        gap: calc(${theme.vars.spacing.unit} * 2);
        width: 100%;
      }

      &__header {
        display: flex;
        align-items: center;
        gap: calc(${theme.vars.spacing.unit} * 1.5);
        margin-bottom: calc(${theme.vars.spacing.unit} * 1.5);
      }

      &__field {
        display: flex;
        align-items: center;
        padding: ${theme.vars.spacing.unit} 0;
        border-bottom: 1px solid ${theme.vars.colors.border};
        min-height: 32px;
      }

      &__field-group {
        display: flex;
        flex-direction: column;
        gap: calc(${theme.vars.spacing.unit} * 0.5);
      }

      &__textarea {
        width: 100%;
        padding: ${theme.vars.spacing.unit} calc(${theme.vars.spacing.unit} * 1.5);
        border: 1px solid ${theme.vars.colors.border};
        border-radius: ${theme.vars.borderRadius.medium};
        font-size: ${theme.vars.typography.fontSizes.md};
        color: ${theme.vars.colors.text.primary};
        background-color: ${theme.vars.colors.background.surface};
        font-family: inherit;
        min-height: 80px;
        resize: vertical;
        outline: none;

        &:focus {
          border-color: ${theme.vars.colors.primary.main};
          box-shadow: 0 0 0 2px ${theme.vars.colors.primary.main}20;
        }

        &:disabled {
          background-color: ${theme.vars.colors.background.disabled};
          color: ${theme.vars.colors.text.secondary};
          cursor: not-allowed;
        }

        &--error {
          border-color: ${theme.vars.colors.error.main};
        }
      }

      &__input {
        /* Base input styles will be handled by TextField component */
      }

      &__avatar-container {
        align-items: flex-start;
        display: flex;
        gap: calc(${theme.vars.spacing.unit} * 2);
        margin-bottom: ${theme.vars.spacing.unit};
      }

      &__actions {
        display: flex;
        gap: ${theme.vars.spacing.unit};
        justify-content: flex-end;
        padding-top: calc(${theme.vars.spacing.unit} * 2);
      }

      &__info-container {
        display: flex;
        flex-direction: column;
        gap: ${theme.vars.spacing.unit};
      }

      &__value {
        color: ${theme.vars.colors.text.primary};
        flex: 1;
        display: flex;
        align-items: center;
        gap: ${theme.vars.spacing.unit};
        overflow: hidden;
        min-height: 32px;
        line-height: 32px;
      }

      &__popup {
        padding: calc(${theme.vars.spacing.unit} * 2);
      }

      &__error-alert {
        margin-bottom: calc(${theme.vars.spacing.unit} * 2);
      }
    `;

    const cssCreateOrganizationCard = css`
      background: ${theme.vars.colors.background.surface};
      border-radius: ${theme.vars.borderRadius.large};
      padding: calc(${theme.vars.spacing.unit} * 4);
    `;

    const cssCreateOrganizationContent = css`
      display: flex;
      flex-direction: column;
      gap: calc(${theme.vars.spacing.unit} * 2);
    `;

    const cssCreateOrganizationForm = css`
      display: flex;
      flex-direction: column;
      gap: calc(${theme.vars.spacing.unit} * 2);
      width: 100%;
    `;

    const cssCreateOrganizationHeader = css`
      display: flex;
      align-items: center;
      gap: calc(${theme.vars.spacing.unit} * 1.5);
      margin-bottom: calc(${theme.vars.spacing.unit} * 1.5);
    `;

    const cssCreateOrganizationField = css`
      display: flex;
      align-items: center;
      padding: ${theme.vars.spacing.unit} 0;
      border-bottom: 1px solid ${theme.vars.colors.border};
      min-height: 32px;
    `;

    const cssCreateOrganizationFieldGroup = css`
      display: flex;
      flex-direction: column;
      gap: calc(${theme.vars.spacing.unit} * 0.5);
    `;

    const cssCreateOrganizationTextarea = css`
      width: 100%;
      padding: ${theme.vars.spacing.unit} calc(${theme.vars.spacing.unit} * 1.5);
      border: 1px solid ${theme.vars.colors.border};
      border-radius: ${theme.vars.borderRadius.medium};
      font-size: ${theme.vars.typography.fontSizes.md};
      color: ${theme.vars.colors.text.primary};
      background-color: ${theme.vars.colors.background.surface};
      font-family: inherit;
      min-height: 80px;
      resize: vertical;
      outline: none;

      &:focus {
        border-color: ${theme.vars.colors.primary.main};
        box-shadow: 0 0 0 2px ${theme.vars.colors.primary.main}20;
      }

      &:disabled {
        background-color: ${theme.vars.colors.background.disabled};
        color: ${theme.vars.colors.text.secondary};
        cursor: not-allowed;
      }
    `;

    const cssCreateOrganizationTextareaError = css`
      border-color: ${theme.vars.colors.error.main};
    `;

    const cssCreateOrganizationInput = css`
      /* Base input styles will be handled by TextField component */
    `;

    const cssCreateOrganizationAvatarContainer = css`
      align-items: flex-start;
      display: flex;
      gap: calc(${theme.vars.spacing.unit} * 2);
      margin-bottom: ${theme.vars.spacing.unit};
    `;

    const cssCreateOrganizationActions = css`
      display: flex;
      gap: ${theme.vars.spacing.unit};
      justify-content: flex-end;
      padding-top: calc(${theme.vars.spacing.unit} * 2);
    `;

    const cssCreateOrganizationInfoContainer = css`
      display: flex;
      flex-direction: column;
      gap: ${theme.vars.spacing.unit};
    `;

    const cssCreateOrganizationValue = css`
      color: ${theme.vars.colors.text.primary};
      flex: 1;
      display: flex;
      align-items: center;
      gap: ${theme.vars.spacing.unit};
      overflow: hidden;
      min-height: 32px;
      line-height: 32px;
    `;

    const cssCreateOrganizationPopup = css`
      padding: calc(${theme.vars.spacing.unit} * 2);
    `;

    const cssCreateOrganizationErrorAlert = css`
      margin-bottom: calc(${theme.vars.spacing.unit} * 2);
    `;

    return {
      createOrganization: cssCreateOrganization,
      createOrganizationCard: cssCreateOrganizationCard,
      createOrganizationContent: cssCreateOrganizationContent,
      createOrganizationForm: cssCreateOrganizationForm,
      createOrganizationHeader: cssCreateOrganizationHeader,
      createOrganizationField: cssCreateOrganizationField,
      createOrganizationFieldGroup: cssCreateOrganizationFieldGroup,
      createOrganizationTextarea: cssCreateOrganizationTextarea,
      createOrganizationTextareaError: cssCreateOrganizationTextareaError,
      createOrganizationInput: cssCreateOrganizationInput,
      createOrganizationAvatarContainer: cssCreateOrganizationAvatarContainer,
      createOrganizationActions: cssCreateOrganizationActions,
      createOrganizationInfoContainer: cssCreateOrganizationInfoContainer,
      createOrganizationValue: cssCreateOrganizationValue,
      createOrganizationPopup: cssCreateOrganizationPopup,
      createOrganizationErrorAlert: cssCreateOrganizationErrorAlert,
    };
  }, [theme, colorScheme]);
};

export default useStyles;
