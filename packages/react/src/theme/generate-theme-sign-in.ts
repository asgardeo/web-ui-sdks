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

import {BrandingPreferenceTheme, ThemeConfig} from '@asgardeo/js';
import {extendTheme, Theme} from '@oxygen-ui/react';

/**
 * This function generates the theme for the sign-in component.
 *
 * @param {BrandingPreferenceTheme} brandingPreferenceTheme - The branding preference theme.
 *
 * @return {Theme} The generated theme.
 */
const generateThemeSignIn: (brandingPreferenceTheme: BrandingPreferenceTheme) => Theme = (
  brandingPreferenceTheme: BrandingPreferenceTheme,
) => {
  const mode: string = brandingPreferenceTheme?.activeTheme.toLowerCase() ?? 'light';
  const brandingTheme: ThemeConfig = brandingPreferenceTheme[mode.toUpperCase()];

  return extendTheme({
    colorSchemes: {
      dark: {
        brand: {
          logo: {
            main: brandingTheme?.images?.myAccountLogo?.imgURL ?? `../assets/asgardeo-logo.svg`,
          },
        },
        palette: {
          primary: {
            main: brandingTheme?.colors?.primary?.main ?? 'var(--oxygen-palette-primary-main)',
          },
        },
      },
      light: {
        brand: {
          logo: {
            main: brandingTheme?.images?.myAccountLogo?.imgURL ?? `../assets/asgardeo-logo.svg`,
          },
        },
        palette: {
          primary: {
            main: brandingTheme?.colors?.primary?.main ?? 'var(--oxygen-palette-primary-main)',
          },
        },
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: brandingTheme?.buttons?.primary?.base?.border?.borderRadius,
            color: brandingTheme?.buttons?.primary?.base?.font?.color,
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            background: brandingTheme?.inputs?.base?.background?.backgroundColor,
            borderColor: brandingTheme?.inputs?.base?.border?.borderColor,
            borderRadius: brandingTheme?.inputs?.base?.border?.borderRadius,
            color: brandingTheme?.inputs?.base?.font?.color,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: `${brandingTheme?.inputs?.base?.border?.borderRadius} !important`,
            color: brandingTheme?.inputs?.base?.font?.color,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: `${
              brandingTheme?.inputs?.base?.labels?.font?.color !== ''
                ? brandingTheme?.inputs?.base?.labels?.font?.color
                : brandingTheme?.colors?.text?.primary
            } !important`,
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: `${brandingTheme?.colors?.text?.primary} !important`,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            '&::placeholder': {
              color: 'var(--oxygen-palette-text-secondary)',
            },
            padding: '0.67857143em 1em',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            '.OxygenSignInButton-social': {
              backgroundColor: brandingTheme?.buttons.externalConnection.base.background.backgroundColor,
              borderRadius: brandingTheme?.buttons.externalConnection.base.border.borderRadius,
              color: brandingTheme?.buttons.externalConnection.base.font.color,
            },
            background: brandingTheme?.colors?.background?.surface?.main,
            borderColor: brandingTheme?.loginBox?.border?.borderColor ?? brandingTheme?.colors?.outlined?.default,
            borderRadius: brandingTheme?.loginBox?.border?.borderRadius,
            borderWidth: brandingTheme?.loginBox?.border?.borderWidth,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            color: 'purple',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: brandingTheme?.colors?.text?.primary,
          },
        },
      },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontFamily: brandingTheme?.typography.font.fontFamily ?? 'Gilmer, sans-serif',
      h1: {
        fontWeight: 700,
      },
    },
  });
};

export default generateThemeSignIn;
