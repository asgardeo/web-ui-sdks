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

import {Theme, ThemeConfig} from './types';

const lightTheme: ThemeConfig = {
  colors: {
    primary: {
      main: '#1a73e8',
      contrastText: '#ffffff',
    },
    background: {
      surface: '#f5f5f5',
      disabled: '#f0f0f0',
      body: {
        main: '#1a1a1a',
      },
    },
    error: {
      main: '#d32f2f',
      contrastText: '#ffffff',
    },
    surface: '#f5f5f5',
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
};

const darkTheme: ThemeConfig = {
  colors: {
    primary: {
      main: '#1a73e8',
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
    surface: '#2d2d2d',
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
};

const toCssVariables = (theme: ThemeConfig): Record<string, string> => {
  const cssVars: Record<string, string> = {};

  // Colors
  cssVars['--asgardeo-color-primary-main'] = theme.colors.primary.main;
  cssVars['--asgardeo-color-primary-contrastText'] = theme.colors.primary.contrastText;
  cssVars['--asgardeo-color-background-surface'] = theme.colors.background.surface;
  cssVars['--asgardeo-color-background-disabled'] = theme.colors.background.disabled;
  cssVars['--asgardeo-color-background-body-main'] = theme.colors.background.body.main;
  cssVars['--asgardeo-color-error-main'] = theme.colors.error.main;
  cssVars['--asgardeo-color-error-contrastText'] = theme.colors.error.contrastText;
  cssVars['--asgardeo-color-surface'] = theme.colors.surface;
  cssVars['--asgardeo-color-text-primary'] = theme.colors.text.primary;
  cssVars['--asgardeo-color-text-secondary'] = theme.colors.text.secondary;
  cssVars['--asgardeo-color-border'] = theme.colors.border;

  // Spacing
  cssVars['--asgardeo-spacing-unit'] = `${theme.spacing.unit}px`;

  // Border Radius
  cssVars['--asgardeo-border-radius-small'] = theme.borderRadius.small;
  cssVars['--asgardeo-border-radius-medium'] = theme.borderRadius.medium;
  cssVars['--asgardeo-border-radius-large'] = theme.borderRadius.large;

  return cssVars;
};

const createTheme = (config: Partial<ThemeConfig> = {}, isDark = false): Theme => {
  const baseTheme = isDark ? darkTheme : lightTheme;
  const mergedConfig = {
    ...baseTheme,
    ...config,
    colors: {
      ...baseTheme.colors,
      ...config.colors,
    },
    spacing: {
      ...baseTheme.spacing,
      ...config.spacing,
    },
    borderRadius: {
      ...baseTheme.borderRadius,
      ...config.borderRadius,
    },
  };

  return {
    ...mergedConfig,
    cssVariables: toCssVariables(mergedConfig),
  };
};

export default createTheme;
