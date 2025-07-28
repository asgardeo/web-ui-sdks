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

import {BrandingPreference, ThemeVariant} from '../models/branding-preference';
import {Theme, ThemeConfig} from '../theme/types';
import createTheme from '../theme/createTheme';

/**
 * Safely extracts a color value from the branding preference structure
 */
type ColorVariant = {main?: string; dark?: string; contrastText?: string};
type TextColors = {primary?: string; secondary?: string; dark?: string};

const extractColorValue = (colorVariant?: ColorVariant, preferDark = false): string | undefined => {
  if (preferDark && colorVariant?.dark && colorVariant.dark.trim()) {
    return colorVariant.dark;
  }
  return colorVariant?.main;
};

/**
 * Safely extracts contrast text color from the branding preference structure
 */
const extractContrastText = (colorVariant?: {main?: string; contrastText?: string}) => {
  return colorVariant?.contrastText;
};

/**
 * Transforms a ThemeVariant from branding preference to ThemeConfig
 */
const transformThemeVariant = (themeVariant: ThemeVariant, isDark = false): Partial<ThemeConfig> => {
  const colors = themeVariant.colors;
  const buttons = themeVariant.buttons;
  const inputs = themeVariant.inputs;
  const images = themeVariant.images;

  const config: Partial<ThemeConfig> = {
    colors: {
      action: {
        active: isDark ? 'rgba(255, 255, 255, 0.70)' : 'rgba(0, 0, 0, 0.54)',
        hover: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
        hoverOpacity: 0.04,
        selected: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        selectedOpacity: 0.08,
        disabled: isDark ? 'rgba(255, 255, 255, 0.26)' : 'rgba(0, 0, 0, 0.26)',
        disabledBackground: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        disabledOpacity: 0.38,
        focus: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
      },
      primary: {
        main: extractColorValue(colors?.primary as ColorVariant, isDark),
        contrastText: extractContrastText(colors?.primary),
        dark: colors?.primary?.dark || (colors?.primary as ColorVariant)?.main,
      },
      secondary: {
        main: extractColorValue(colors?.secondary as ColorVariant, isDark),
        contrastText: extractContrastText(colors?.secondary),
        dark: colors?.secondary?.dark || (colors?.secondary as ColorVariant)?.main,
      },
      background: {
        surface: extractColorValue(colors?.background?.surface as ColorVariant, isDark),
        disabled: extractColorValue(colors?.background?.surface as ColorVariant, isDark),
        dark:
          (colors?.background?.surface as ColorVariant)?.dark || (colors?.background?.surface as ColorVariant)?.main,
        body: {
          main: extractColorValue(colors?.background?.body as ColorVariant, isDark),
          dark: (colors?.background?.body as ColorVariant)?.dark || (colors?.background?.body as ColorVariant)?.main,
        },
      },
      text: {
        primary: (colors?.text as TextColors)?.primary,
        secondary: (colors?.text as TextColors)?.secondary,
        dark: (colors?.text as TextColors)?.dark || (colors?.text as TextColors)?.primary,
      },
      border: colors?.outlined?.default,
      error: {
        main: extractColorValue(colors?.alerts?.error as ColorVariant, isDark),
        contrastText: extractContrastText(colors?.alerts?.error),
        dark: (colors?.alerts?.error as ColorVariant)?.dark || (colors?.alerts?.error as ColorVariant)?.main,
      },
      info: {
        main: extractColorValue(colors?.alerts?.info as ColorVariant, isDark),
        contrastText: extractContrastText(colors?.alerts?.info),
        dark: (colors?.alerts?.info as ColorVariant)?.dark || (colors?.alerts?.info as ColorVariant)?.main,
      },
      success: {
        main: extractColorValue(colors?.alerts?.neutral as ColorVariant, isDark),
        contrastText: extractContrastText(colors?.alerts?.neutral),
        dark: (colors?.alerts?.neutral as ColorVariant)?.dark || (colors?.alerts?.neutral as ColorVariant)?.main,
      },
      warning: {
        main: extractColorValue(colors?.alerts?.warning as ColorVariant, isDark),
        contrastText: extractContrastText(colors?.alerts?.warning),
        dark: (colors?.alerts?.warning as ColorVariant)?.dark || (colors?.alerts?.warning as ColorVariant)?.main,
      },
    },
    images: {
      favicon: images?.favicon
        ? {
            url: images.favicon.imgURL,
            title: images.favicon.title,
            alt: images.favicon.altText,
          }
        : undefined,
      logo: images?.logo
        ? {
            url: images.logo.imgURL,
            title: images.logo.title,
            alt: images.logo.altText,
          }
        : undefined,
    },
  };

  // --- COMPONENT OVERRIDES: Button borderRadius ---
  const buttonBorderRadius = buttons?.primary?.base?.border?.borderRadius;
  if (buttonBorderRadius) {
    config.components = {
      Button: {
        styleOverrides: {
          root: {
            borderRadius: buttonBorderRadius,
          },
        },
      },
    };
  }

  return config;
};

/**
 * Transforms branding preference response to Theme object
 *
 * @param brandingPreference - The branding preference response from getBrandingPreference
 * @param forceTheme - Optional parameter to force a specific theme ('light' or 'dark'),
 *                     if not provided, will use the activeTheme from branding preference
 * @returns Theme object that can be used with the theme system
 *
 * The function extracts the following from branding preference:
 * - Colors (primary, secondary, background, text, alerts, etc.)
 * - Border radius from buttons and inputs
 * - Images (logo and favicon with their URLs, titles, and alt text)
 * - Typography settings
 *
 * @example
 * ```typescript
 * const brandingPreference = await getBrandingPreference({ baseUrl: "..." });
 * const theme = transformBrandingPreferenceToTheme(brandingPreference);
 *
 * // Access image URLs via CSS variables
 * // Logo: var(--wso2-image-logo-url)
 * // Favicon: var(--wso2-image-favicon-url)
 *
 * // Force light theme regardless of branding preference activeTheme
 * const lightTheme = transformBrandingPreferenceToTheme(brandingPreference, 'light');
 * ```
 */
export const transformBrandingPreferenceToTheme = (
  brandingPreference: BrandingPreference,
  forceTheme?: 'light' | 'dark',
): Theme => {
  // Extract theme configuration
  const themeConfig = brandingPreference?.preference?.theme;

  if (!themeConfig) {
    // If no theme config is provided, return default light theme
    return createTheme({}, false);
  }

  // Determine which theme variant to use
  let activeThemeKey: string;
  if (forceTheme) {
    activeThemeKey = forceTheme.toUpperCase();
  } else {
    activeThemeKey = themeConfig.activeTheme || 'LIGHT';
  }

  // Get the theme variant (LIGHT or DARK)
  const themeVariant = themeConfig[activeThemeKey as keyof typeof themeConfig] as ThemeVariant;

  if (!themeVariant) {
    // If the specified theme variant doesn't exist, fallback to light theme
    const fallbackVariant = themeConfig.LIGHT || themeConfig.DARK;
    if (fallbackVariant) {
      const transformedConfig = transformThemeVariant(fallbackVariant, activeThemeKey === 'DARK');
      return createTheme(transformedConfig, activeThemeKey === 'DARK');
    }
    // If no theme variants exist, return default theme
    return createTheme({}, activeThemeKey === 'DARK');
  }

  // Transform the theme variant to ThemeConfig
  const transformedConfig = transformThemeVariant(themeVariant, activeThemeKey === 'DARK');

  // Create the theme using the transformed config
  return createTheme(transformedConfig, activeThemeKey === 'DARK');
};

export default transformBrandingPreferenceToTheme;
