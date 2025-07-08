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
 * Creates styles for the OrganizationList component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string) => {
  return useMemo(() => {
    const cssOrganizationListWrapper = css`
      /* Container wrapper styles for OrganizationList component */
      width: 100%;

      &__container {
        position: relative;
        width: 100%;
      }

      &__error-state {
        padding: calc(${theme.vars.spacing.unit} * 2);
        background-color: color-mix(in srgb, ${theme.vars.colors.error.main} 10%, transparent);
        border: 1px solid ${theme.vars.colors.error.main};
        border-radius: ${theme.vars.borderRadius.medium};
        color: ${theme.vars.colors.error.main};
        text-align: center;
      }

      &__loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: color-mix(in srgb, ${theme.vars.colors.background.surface} 80%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: ${theme.vars.borderRadius.large};
        backdrop-filter: blur(2px);
      }
    `;

    return {
      organizationListWrapper: cssOrganizationListWrapper,
      organizationListWrapper__container: bem(cssOrganizationListWrapper, 'container'),
      organizationListWrapper__errorState: bem(cssOrganizationListWrapper, 'error-state'),
      organizationListWrapper__loadingOverlay: bem(cssOrganizationListWrapper, 'loading-overlay'),
    };
  }, [theme, colorScheme]);
};

export default useStyles;
