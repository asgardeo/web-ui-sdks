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

import {BrandingPreferenceThemeInterface, ThemeConfigInterface} from '../models/branding-api-response';
import isEmpty from 'lodash.isempty';

const getBrandingCSS = (theme: BrandingPreferenceThemeInterface): string => {
  if (!theme) {
    return '';
  }
  const activeTheme: ThemeConfigInterface = theme[theme.activeTheme];

  const footerFontColor: string = !isEmpty(activeTheme.footer.font.color) ? activeTheme.footer.font.color : 'inherit';
  const headingFontColor: string = !isEmpty(activeTheme.typography.heading.font.color)
    ? activeTheme.typography.heading.font.color
    : 'inherit';
  const loginBoxFontColor: string = !isEmpty(activeTheme.loginBox.font.color)
    ? activeTheme.loginBox.font.color
    : 'inherit';
  const inputBaseFontColor: string = !isEmpty(activeTheme.inputs.base.font.color)
    ? activeTheme.inputs.base.font.color
    : 'inherit';
  const inputBaseLabelFontColor: string = !isEmpty(activeTheme.inputs.base.labels.font.color)
    ? activeTheme.inputs.base.labels.font.color
    : 'inherit';

  return `
    ${activeTheme.typography.font.importURL ? `@import url(${activeTheme.typography.font.importURL});` : ''}

    :root {
    --asg-colors-primary-main: ${activeTheme.colors.primary.main};
    --asg-colors-secondary-main: ${activeTheme.colors.secondary.main};
    --asg-colors-background-body-main: ${activeTheme.colors.background?.body?.main};
    --asg-colors-background-surface-main: ${activeTheme.colors.background?.surface?.main};
    --asg-colors-background-surface-light: ${activeTheme.colors.background?.surface?.light};
    --asg-colors-background-surface-dark: ${activeTheme.colors.background?.surface?.dark};
    --asg-colors-background-surface-inverted: ${activeTheme.colors.background?.surface?.inverted};
    --asg-colors-outlined-default: ${activeTheme.colors.outlined?.default};
    --asg-colors-text-primary: ${activeTheme.colors.text?.primary};
    --asg-colors-text-secondary: ${activeTheme.colors.text?.secondary};
    --asg-colors-alerts-error-main: ${activeTheme.colors.alerts?.error?.main};
    --asg-colors-alerts-neutral-main: ${activeTheme.colors.alerts?.neutral?.main};
    --asg-colors-alerts-info-main: ${activeTheme.colors.alerts?.info?.main};
    --asg-colors-alerts-warning-main: ${activeTheme.colors.alerts?.warning?.main};
    --asg-colors-illustrations-primary-main: ${activeTheme.colors.illustrations?.primary?.main};
    --asg-colors-illustrations-secondary-main: ${activeTheme.colors.illustrations?.secondary?.main};
    --asg-colors-illustrations-accent1-main: ${activeTheme.colors.illustrations?.accent1?.main};
    --asg-colors-illustrations-accent2-main: ${activeTheme.colors.illustrations?.accent2?.main};
    --asg-colors-illustrations-accent3-main: ${activeTheme.colors.illustrations?.accent3?.main};

    /* Components */
    --asg-footer-text-color: ${footerFontColor};
    --asg-footer-border-color: ${activeTheme.footer?.border?.borderColor || 'var(--asg-colors-outlined-default)'};
    --asg-primary-font-family: ${activeTheme.typography.font.fontFamily};
    --asg-heading-text-color: ${headingFontColor};
    --asg-primary-button-base-text-color: ${activeTheme.buttons.primary.base.font.color};
    --asg-primary-button-base-border-radius: ${activeTheme.buttons.primary.base.border.borderRadius};
    --asg-secondary-button-base-text-color: ${activeTheme.buttons.secondary.base.font.color};
    --asg-secondary-button-base-border-radius: ${activeTheme.buttons.secondary.base.border.borderRadius};
    --asg-external-login-button-base-background-color: ${
      activeTheme.buttons.externalConnection.base.background.backgroundColor
    };
    --asg-external-login-button-base-text-color: ${activeTheme.buttons.externalConnection.base.font.color};
    --asg-external-login-button-base-border-radius: ${activeTheme.buttons.externalConnection.base.border.borderRadius};
    --asg-login-box-background-color: ${
      activeTheme.loginBox?.background?.backgroundColor || 'var(--asg-colors-background-surface-main)'
    };
    --asg-login-box-border-color: ${activeTheme.loginBox?.border?.borderColor || 'var(--asg-colors-outlined-default)'};
    --asg-login-box-border-width: ${activeTheme.loginBox.border.borderWidth};
    --asg-login-box-border-style: solid;
    --asg-login-box-border-radius: ${activeTheme.loginBox.border.borderRadius};
    --asg-login-box-text-color: ${loginBoxFontColor};
    --asg-login-page-background-color: ${
      activeTheme.loginPage?.background?.backgroundColor || 'var(--asg-colors-background-body-main)'
    };
    --asg-login-page-font-color: ${activeTheme.loginPage?.font?.color || 'var(--asg-colors-text-primary)'};
    --asg-input-field-base-text-color: ${inputBaseFontColor || 'var(--asg-colors-text-primary)'};
    --asg-input-field-base-background-color: ${activeTheme.inputs.base.background.backgroundColor};
    --asg-input-field-base-label-text-color: ${inputBaseLabelFontColor};
    --asg-input-field-base-border-color: ${
      activeTheme.inputs.base.border.borderColor || 'var(--asg-colors-outlined-default)'
    };
    --asg-input-field-base-border-radius: ${activeTheme.inputs.base.border.borderRadius};
    --language-selector-background-color: var(--asg-login-page-background-color) !important;
    --language-selector-text-color: var(--asg-footer-text-color) !important;
    --language-selector-border-color: var(--asg-colors-primary-main) !important;

    /* Oxygen UI variables */
    --oxygen-palette-text-primary: ${activeTheme.colors.text?.primary};
} `;
};

export default getBrandingCSS;
