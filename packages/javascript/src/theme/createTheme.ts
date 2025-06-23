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

import { RecursivePartial } from '../models/utility-types';
import {Theme, ThemeConfig} from './types';

const lightTheme: ThemeConfig = {
  colors: {
    primary: {
      main: '#1a73e8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#424242',
      contrastText: '#ffffff',
    },
    background: {
      surface: '#ffffff',
      disabled: '#f0f0f0',
      body: {
        main: '#1a1a1a',
      },
    },
    error: {
      main: '#d32f2f',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
    border: '#e0e0e0',
  },
  spacing: {
    unit: 8,
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.15)',
    large: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
};

const darkTheme: ThemeConfig = {
  colors: {
    primary: {
      main: '#1a73e8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#424242',
      contrastText: '#ffffff',
    },
    background: {
      surface: '#121212',
      disabled: '#1f1f1f',
      body: {
        main: '#ffffff',
      },
    },
    error: {
      main: '#d32f2f',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    border: '#404040',
  },
  spacing: {
    unit: 8,
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.4)',
    large: '0 8px 32px rgba(0, 0, 0, 0.5)',
  },
};

const toCssVariables = (theme: RecursivePartial<ThemeConfig>): Record<string, string> => {
  const cssVars: Record<string, string> = {};

  // Colors
  cssVars['--asgardeo-color-primary-main'] = theme.colors.primary.main;
  cssVars['--asgardeo-color-primary-contrastText'] = theme.colors.primary.contrastText;
  cssVars['--asgardeo-color-secondary-main'] = theme.colors.secondary.main;
  cssVars['--asgardeo-color-secondary-contrastText'] = theme.colors.secondary.contrastText;
  cssVars['--asgardeo-color-background-surface'] = theme.colors.background.surface;
  cssVars['--asgardeo-color-background-disabled'] = theme.colors.background.disabled;
  cssVars['--asgardeo-color-background-body-main'] = theme.colors.background.body.main;
  cssVars['--asgardeo-color-error-main'] = theme.colors.error.main;
  cssVars['--asgardeo-color-error-contrastText'] = theme.colors.error.contrastText;
  cssVars['--asgardeo-color-success-main'] = theme.colors.success.main;
  cssVars['--asgardeo-color-success-contrastText'] = theme.colors.success.contrastText;
  cssVars['--asgardeo-color-warning-main'] = theme.colors.warning.main;
  cssVars['--asgardeo-color-warning-contrastText'] = theme.colors.warning.contrastText;
  cssVars['--asgardeo-color-text-primary'] = theme.colors.text.primary;
  cssVars['--asgardeo-color-text-secondary'] = theme.colors.text.secondary;
  cssVars['--asgardeo-color-border'] = theme.colors.border;

  // Spacing
  cssVars['--asgardeo-spacing-unit'] = `${theme.spacing.unit}px`;

  // Border Radius
  cssVars['--asgardeo-border-radius-small'] = theme.borderRadius.small;
  cssVars['--asgardeo-border-radius-medium'] = theme.borderRadius.medium;
  cssVars['--asgardeo-border-radius-large'] = theme.borderRadius.large;

  // Shadows
  cssVars['--asgardeo-shadow-small'] = theme.shadows.small;
  cssVars['--asgardeo-shadow-medium'] = theme.shadows.medium;
  cssVars['--asgardeo-shadow-large'] = theme.shadows.large;

  return cssVars;
};

const createTheme = (config: RecursivePartial<ThemeConfig> = {}, isDark = false): Theme => {
  const baseTheme = isDark ? darkTheme : lightTheme;
  const mergedConfig = {
    ...baseTheme,
    ...config,
    colors: {
      ...baseTheme.colors,
      ...config.colors,
      secondary: {
        ...baseTheme.colors.secondary,
        ...(config.colors?.secondary || {}),
      },
    },
    spacing: {
      ...baseTheme.spacing,
      ...config.spacing,
    },
    borderRadius: {
      ...baseTheme.borderRadius,
      ...config.borderRadius,
    },
    shadows: {
      ...baseTheme.shadows,
      ...config.shadows,
    },
  } as ThemeConfig;

  return {
    ...mergedConfig,
    cssVariables: toCssVariables(mergedConfig),
  };
};

export default createTheme;
