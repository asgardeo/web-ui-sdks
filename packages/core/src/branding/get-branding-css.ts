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

import {BrandingPreferenceThemeInterface} from '../models/branding-api-response';
import isEmpty from '../utils/is-empty';

const getBrandingCSS = (theme: BrandingPreferenceThemeInterface): string => {
  if (!theme) {
    return '';
  }

  const footerFontColor: string = !isEmpty(theme[theme.activeTheme].footer.font.color)
    ? theme[theme.activeTheme].footer.font.color
    : 'inherit';
  const headingFontColor: string = !isEmpty(theme[theme.activeTheme].typography.heading.font.color)
    ? theme[theme.activeTheme].typography.heading.font.color
    : 'inherit';
  const loginBoxFontColor: string = !isEmpty(theme[theme.activeTheme].loginBox.font.color)
    ? theme[theme.activeTheme].loginBox.font.color
    : 'inherit';
  const inputBaseFontColor: string = !isEmpty(theme[theme.activeTheme].inputs.base.font.color)
    ? theme[theme.activeTheme].inputs.base.font.color
    : 'inherit';
  const inputBaseLabelFontColor: string = !isEmpty(theme[theme.activeTheme].inputs.base.labels.font.color)
    ? theme[theme.activeTheme].inputs.base.labels.font.color
    : 'inherit';

  return `
    ${
      theme[theme.activeTheme].typography.font.importURL
        ? `@import url(${theme[theme.activeTheme].typography.font.importURL});`
        : ''
    }

    :root {
    --asg-colors-primary-main: ${theme[theme.activeTheme].colors.primary.main};
    --asg-colors-secondary-main: ${theme[theme.activeTheme].colors.secondary.main};
    --asg-colors-background-body-main: ${theme[theme.activeTheme].colors.background?.body?.main};
    --asg-colors-background-surface-main: ${theme[theme.activeTheme].colors.background?.surface?.main};
    --asg-colors-background-surface-light: ${theme[theme.activeTheme].colors.background?.surface?.light};
    --asg-colors-background-surface-dark: ${theme[theme.activeTheme].colors.background?.surface?.dark};
    --asg-colors-background-surface-inverted: ${theme[theme.activeTheme].colors.background?.surface?.inverted};
    --asg-colors-outlined-default: ${theme[theme.activeTheme].colors.outlined?.default};
    --asg-colors-text-primary: ${theme[theme.activeTheme].colors.text?.primary};
    --asg-colors-text-secondary: ${theme[theme.activeTheme].colors.text?.secondary};
    --asg-colors-alerts-error-main: ${theme[theme.activeTheme].colors.alerts?.error?.main};
    --asg-colors-alerts-neutral-main: ${theme[theme.activeTheme].colors.alerts?.neutral?.main};
    --asg-colors-alerts-info-main: ${theme[theme.activeTheme].colors.alerts?.info?.main};
    --asg-colors-alerts-warning-main: ${theme[theme.activeTheme].colors.alerts?.warning?.main};
    --asg-colors-illustrations-primary-main: ${theme[theme.activeTheme].colors.illustrations?.primary?.main};
    --asg-colors-illustrations-secondary-main: ${theme[theme.activeTheme].colors.illustrations?.secondary?.main};
    --asg-colors-illustrations-accent1-main: ${theme[theme.activeTheme].colors.illustrations?.accent1?.main};
    --asg-colors-illustrations-accent2-main: ${theme[theme.activeTheme].colors.illustrations?.accent2?.main};
    --asg-colors-illustrations-accent3-main: ${theme[theme.activeTheme].colors.illustrations?.accent3?.main};

    /* Components */
    --asg-footer-text-color: ${footerFontColor};
    --asg-footer-border-color: ${
      theme[theme.activeTheme].footer?.border?.borderColor || 'var(--asg-colors-outlined-default)'
    };
    --asg-primary-font-family: ${theme[theme.activeTheme].typography.font.fontFamily};
    --asg-heading-text-color: ${headingFontColor};
    --asg-primary-button-base-text-color: ${theme[theme.activeTheme].buttons.primary.base.font.color};
    --asg-primary-button-base-border-radius: ${theme[theme.activeTheme].buttons.primary.base.border.borderRadius};
    --asg-secondary-button-base-text-color: ${theme[theme.activeTheme].buttons.secondary.base.font.color};
    --asg-secondary-button-base-border-radius: ${theme[theme.activeTheme].buttons.secondary.base.border.borderRadius};
    --asg-external-login-button-base-background-color: ${
      theme[theme.activeTheme].buttons.externalConnection.base.background.backgroundColor
    };
    --asg-external-login-button-base-text-color: ${theme[theme.activeTheme].buttons.externalConnection.base.font.color};
    --asg-external-login-button-base-border-radius: ${
      theme[theme.activeTheme].buttons.externalConnection.base.border.borderRadius
    };
    --asg-login-box-background-color: ${
      theme[theme.activeTheme].loginBox?.background?.backgroundColor || 'var(--asg-colors-background-surface-main)'
    };
    --asg-login-box-border-color: ${
      theme[theme.activeTheme].loginBox?.border?.borderColor || 'var(--asg-colors-outlined-default)'
    };
    --asg-login-box-border-width: ${theme[theme.activeTheme].loginBox.border.borderWidth};
    --asg-login-box-border-style: solid;
    --asg-login-box-border-radius: ${theme[theme.activeTheme].loginBox.border.borderRadius};
    --asg-login-box-text-color: ${loginBoxFontColor};
    --asg-login-page-background-color: ${
      theme[theme.activeTheme].loginPage?.background?.backgroundColor || 'var(--asg-colors-background-body-main)'
    };
    --asg-login-page-font-color: ${theme[theme.activeTheme].loginPage?.font?.color || 'var(--asg-colors-text-primary)'};
    --asg-input-field-base-text-color: ${inputBaseFontColor || 'var(--asg-colors-text-primary)'};
    --asg-input-field-base-background-color: ${theme[theme.activeTheme].inputs.base.background.backgroundColor};
    --asg-input-field-base-label-text-color: ${inputBaseLabelFontColor};
    --asg-input-field-base-border-color: ${
      theme[theme.activeTheme].inputs.base.border.borderColor || 'var(--asg-colors-outlined-default)'
    };
    --asg-input-field-base-border-radius: ${theme[theme.activeTheme].inputs.base.border.borderRadius};
    --language-selector-background-color: var(--asg-login-page-background-color) !important;
    --language-selector-text-color: var(--asg-footer-text-color) !important;
    --language-selector-border-color: var(--asg-colors-primary-main) !important;

    /* Oxygen UI variables */
    --oxygen-palette-text-primary: ${theme[theme.activeTheme].colors.text?.primary};
} `;
};

export default getBrandingCSS;
