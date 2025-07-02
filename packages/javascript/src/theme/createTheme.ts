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

import {Theme, ThemeConfig, ThemeVars} from './types';
import {RecursivePartial} from '../models/utility-types';
import VendorConstants from '../constants/VendorConstants';

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

const toCssVariables = (theme: ThemeConfig): Record<string, string> => {
  const cssVars: Record<string, string> = {};
  const prefix = theme.cssVarPrefix || VendorConstants.VENDOR_PREFIX;

  // Colors - Primary
  if (theme.colors?.primary?.main) {
    cssVars[`--${prefix}-color-primary-main`] = theme.colors.primary.main;
  }
  if (theme.colors?.primary?.contrastText) {
    cssVars[`--${prefix}-color-primary-contrastText`] = theme.colors.primary.contrastText;
  }

  // Colors - Secondary
  if (theme.colors?.secondary?.main) {
    cssVars[`--${prefix}-color-secondary-main`] = theme.colors.secondary.main;
  }
  if (theme.colors?.secondary?.contrastText) {
    cssVars[`--${prefix}-color-secondary-contrastText`] = theme.colors.secondary.contrastText;
  }

  // Colors - Background
  if (theme.colors?.background?.surface) {
    cssVars[`--${prefix}-color-background-surface`] = theme.colors.background.surface;
  }
  if (theme.colors?.background?.disabled) {
    cssVars[`--${prefix}-color-background-disabled`] = theme.colors.background.disabled;
  }
  if (theme.colors?.background?.body?.main) {
    cssVars[`--${prefix}-color-background-body-main`] = theme.colors.background.body.main;
  }

  // Colors - Error
  if (theme.colors?.error?.main) {
    cssVars[`--${prefix}-color-error-main`] = theme.colors.error.main;
  }
  if (theme.colors?.error?.contrastText) {
    cssVars[`--${prefix}-color-error-contrastText`] = theme.colors.error.contrastText;
  }

  // Colors - Success
  if (theme.colors?.success?.main) {
    cssVars[`--${prefix}-color-success-main`] = theme.colors.success.main;
  }
  if (theme.colors?.success?.contrastText) {
    cssVars[`--${prefix}-color-success-contrastText`] = theme.colors.success.contrastText;
  }

  // Colors - Warning
  if (theme.colors?.warning?.main) {
    cssVars[`--${prefix}-color-warning-main`] = theme.colors.warning.main;
  }
  if (theme.colors?.warning?.contrastText) {
    cssVars[`--${prefix}-color-warning-contrastText`] = theme.colors.warning.contrastText;
  }

  // Colors - Text
  if (theme.colors?.text?.primary) {
    cssVars[`--${prefix}-color-text-primary`] = theme.colors.text.primary;
  }
  if (theme.colors?.text?.secondary) {
    cssVars[`--${prefix}-color-text-secondary`] = theme.colors.text.secondary;
  }

  // Colors - Border
  if (theme.colors?.border) {
    cssVars[`--${prefix}-color-border`] = theme.colors.border;
  }

  // Spacing
  if (theme.spacing?.unit !== undefined) {
    cssVars[`--${prefix}-spacing-unit`] = `${theme.spacing.unit}px`;
  }

  // Border Radius
  if (theme.borderRadius?.small) {
    cssVars[`--${prefix}-border-radius-small`] = theme.borderRadius.small;
  }
  if (theme.borderRadius?.medium) {
    cssVars[`--${prefix}-border-radius-medium`] = theme.borderRadius.medium;
  }
  if (theme.borderRadius?.large) {
    cssVars[`--${prefix}-border-radius-large`] = theme.borderRadius.large;
  }

  // Shadows
  if (theme.shadows?.small) {
    cssVars[`--${prefix}-shadow-small`] = theme.shadows.small;
  }
  if (theme.shadows?.medium) {
    cssVars[`--${prefix}-shadow-medium`] = theme.shadows.medium;
  }
  if (theme.shadows?.large) {
    cssVars[`--${prefix}-shadow-large`] = theme.shadows.large;
  }

  return cssVars;
};

const toThemeVars = (theme: ThemeConfig): ThemeVars => {
  const prefix = theme.cssVarPrefix || VendorConstants.VENDOR_PREFIX;
  
  return {
    colors: {
      primary: {
        main: `var(--${prefix}-color-primary-main)`,
        contrastText: `var(--${prefix}-color-primary-contrastText)`,
      },
      secondary: {
        main: `var(--${prefix}-color-secondary-main)`,
        contrastText: `var(--${prefix}-color-secondary-contrastText)`,
      },
      background: {
        surface: `var(--${prefix}-color-background-surface)`,
        disabled: `var(--${prefix}-color-background-disabled)`,
        body: {
          main: `var(--${prefix}-color-background-body-main)`,
        },
      },
      error: {
        main: `var(--${prefix}-color-error-main)`,
        contrastText: `var(--${prefix}-color-error-contrastText)`,
      },
      success: {
        main: `var(--${prefix}-color-success-main)`,
        contrastText: `var(--${prefix}-color-success-contrastText)`,
      },
      warning: {
        main: `var(--${prefix}-color-warning-main)`,
        contrastText: `var(--${prefix}-color-warning-contrastText)`,
      },
      text: {
        primary: `var(--${prefix}-color-text-primary)`,
        secondary: `var(--${prefix}-color-text-secondary)`,
      },
      border: `var(--${prefix}-color-border)`,
    },
    spacing: {
      unit: `var(--${prefix}-spacing-unit)`,
    },
    borderRadius: {
      small: `var(--${prefix}-border-radius-small)`,
      medium: `var(--${prefix}-border-radius-medium)`,
      large: `var(--${prefix}-border-radius-large)`,
    },
    shadows: {
      small: `var(--${prefix}-shadow-small)`,
      medium: `var(--${prefix}-shadow-medium)`,
      large: `var(--${prefix}-shadow-large)`,
    },
  };
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
    vars: toThemeVars(mergedConfig),
  };
};

export default createTheme;
