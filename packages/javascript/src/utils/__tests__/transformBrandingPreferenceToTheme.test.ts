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

import {describe, it, expect} from 'vitest';
import {transformBrandingPreferenceToTheme} from '../transformBrandingPreferenceToTheme';
import {BrandingPreference} from '../../models/branding-preference';

describe('transformBrandingPreferenceToTheme', () => {
  const mockBrandingPreference: BrandingPreference = {
    locale: 'en-US',
    name: 'dxlab',
    preference: {
      configs: {
        isBrandingEnabled: true,
        removeDefaultBranding: false,
      },
      layout: {
        activeLayout: 'centered',
      },
      organizationDetails: {
        displayName: '',
        supportEmail: '',
      },
      theme: {
        activeTheme: 'LIGHT',
        LIGHT: {
          buttons: {
            externalConnection: {
              base: {
                background: {
                  backgroundColor: '#FFFFFF',
                },
                border: {
                  borderRadius: '8px',
                },
                font: {
                  color: '#000000de',
                },
              },
            },
            primary: {
              base: {
                border: {
                  borderRadius: '8px',
                },
                font: {
                  color: '#ffffffe6',
                },
              },
            },
            secondary: {
              base: {
                border: {
                  borderRadius: '8px',
                },
                font: {
                  color: '#000000de',
                },
              },
            },
          },
          colors: {
            alerts: {
              error: {
                contrastText: '',
                dark: '',
                inverted: '',
                light: '',
                main: '#ffd8d8',
              },
              info: {
                contrastText: '',
                dark: '',
                inverted: '',
                light: '',
                main: '#eff7fd',
              },
              neutral: {
                contrastText: '',
                dark: '',
                inverted: '',
                light: '',
                main: '#f8f8f9',
              },
              warning: {
                contrastText: '',
                dark: '',
                inverted: '',
                light: '',
                main: '#fff6e7',
              },
            },
            background: {
              body: {
                contrastText: '',
                dark: '',
                inverted: '',
                light: '',
                main: '#fbfbfb',
              },
              surface: {
                contrastText: '',
                dark: '#F6F4F2',
                inverted: '#212A32',
                light: '#f9fafb',
                main: '#ffffff',
              },
            },
            illustrations: {
              accent1: {
                contrastText: '',
                dark: '',
                inverted: '',
                light: '',
                main: '#3865B5',
              },
              accent2: {
                contrastText: '',
                dark: '',
                inverted: '',
                light: '',
                main: '#19BECE',
              },
              accent3: {
                contrastText: '',
                dark: '',
                inverted: '',
                light: '',
                main: '#FFFFFF',
              },
              primary: {
                contrastText: '',
                dark: '',
                inverted: '',
                light: '',
                main: '#FF7300',
              },
              secondary: {
                contrastText: '',
                dark: '',
                inverted: '',
                light: '',
                main: '#E0E1E2',
              },
            },
            outlined: {
              default: '#dadce0',
            },
            primary: {
              contrastText: '',
              dark: '',
              inverted: '',
              light: '',
              main: '#2563eb',
            },
            secondary: {
              contrastText: '',
              dark: '',
              inverted: '',
              light: '',
              main: '#E0E1E2',
            },
            text: {
              primary: '#000000de',
              secondary: '#00000066',
            },
          },
          footer: {
            border: {
              borderColor: '',
            },
            font: {
              color: '',
            },
          },
          images: {
            favicon: {},
            logo: {
              imgURL:
                'https://cdn.statically.io/gh/brionmario/javascript/refs/heads/next/samples/teamspace-react/public/teamspace-logo.png',
            },
            myAccountLogo: {
              title: 'Account',
            },
          },
          inputs: {
            base: {
              background: {
                backgroundColor: '#FFFFFF',
              },
              border: {
                borderColor: '',
                borderRadius: '8px',
              },
              font: {
                color: '',
              },
              labels: {
                font: {
                  color: '',
                },
              },
            },
          },
          loginBox: {
            background: {
              backgroundColor: '',
            },
            border: {
              borderColor: '',
              borderRadius: '12px',
              borderWidth: '1px',
            },
            font: {
              color: '',
            },
          },
          loginPage: {
            background: {
              backgroundColor: '',
            },
            font: {
              color: '',
            },
          },
          typography: {
            font: {
              fontFamily: 'Gilmer',
              importURL: '',
            },
            heading: {
              font: {
                color: '',
              },
            },
          },
        },
        DARK: {
          buttons: {
            externalConnection: {
              base: {
                background: {
                  backgroundColor: '#24292e',
                },
                border: {
                  borderRadius: '22px',
                },
                font: {
                  color: '#ffffff',
                },
              },
            },
            primary: {
              base: {
                border: {
                  borderRadius: '22px',
                },
                font: {
                  color: '#ffffff',
                },
              },
            },
            secondary: {
              base: {
                border: {
                  borderRadius: '22px',
                },
                font: {
                  color: '#000000',
                },
              },
            },
          },
          colors: {
            alerts: {
              error: {
                contrastText: '',
                dark: '',
                inverted: '',
                light: '',
                main: '#ff000054',
              },
              info: {
                contrastText: '',
                dark: '#01579b',
                inverted: '',
                light: '',
                main: '#0288d1',
              },
            },
            background: {
              body: {
                contrastText: '',
                dark: '',
                inverted: '',
                light: '',
                main: '#121212',
              },
              surface: {
                contrastText: '',
                dark: '#1e1e1e',
                inverted: '#ffffff',
                light: '#2c2c2c',
                main: '#1a1a1a',
              },
            },
            primary: {
              contrastText: '#ffffff',
              dark: '#1976d2',
              inverted: '',
              light: '#42a5f5',
              main: '#2196f3',
            },
            secondary: {
              contrastText: '#ffffff',
              dark: '#388e3c',
              inverted: '',
              light: '#66bb6a',
              main: '#4caf50',
            },
            text: {
              primary: '#ffffff',
              secondary: '#b3b3b3',
            },
          },
        },
      },
    },
  };

  it('should transform branding preference to theme using active theme', () => {
    const theme = transformBrandingPreferenceToTheme(mockBrandingPreference);

    expect(theme).toBeDefined();
    expect(theme.colors).toBeDefined();
    expect(theme.colors.primary.main).toBe('#2563eb');
    expect(theme.colors.secondary.main).toBe('#E0E1E2');
    expect(theme.colors.background.surface).toBe('#ffffff');
    expect(theme.colors.background.body.main).toBe('#fbfbfb');
    expect(theme.colors.text.primary).toBe('#000000de');
    expect(theme.colors.text.secondary).toBe('#00000066');
    expect(theme.colors.border).toBe('#dadce0');
    expect(theme.borderRadius.small).toBe('8px');
    expect(theme.cssVariables).toBeDefined();
  });

  it('should force light theme when specified', () => {
    const theme = transformBrandingPreferenceToTheme(mockBrandingPreference, 'light');

    expect(theme.colors.primary.main).toBe('#2563eb');
    expect(theme.colors.background.surface).toBe('#ffffff');
    expect(theme.colors.text.primary).toBe('#000000de');
  });

  it('should force dark theme when specified', () => {
    const theme = transformBrandingPreferenceToTheme(mockBrandingPreference, 'dark');

    expect(theme.colors.primary.main).toBe('#2196f3');
    expect(theme.colors.primary.contrastText).toBe('#ffffff');
    expect(theme.colors.background.surface).toBe('#1a1a1a');
    expect(theme.colors.background.body.main).toBe('#121212');
    expect(theme.colors.text.primary).toBe('#ffffff');
    expect(theme.colors.text.secondary).toBe('#b3b3b3');
  });

  it('should handle empty branding preference', () => {
    const emptyBrandingPreference: BrandingPreference = {};
    const theme = transformBrandingPreferenceToTheme(emptyBrandingPreference);

    expect(theme).toBeDefined();
    expect(theme.colors).toBeDefined();
    expect(theme.cssVariables).toBeDefined();
  });

  it('should handle branding preference without theme config', () => {
    const brandingPreferenceWithoutTheme: BrandingPreference = {
      preference: {
        configs: {
          isBrandingEnabled: true,
        },
      },
    };
    const theme = transformBrandingPreferenceToTheme(brandingPreferenceWithoutTheme);

    expect(theme).toBeDefined();
    expect(theme.colors).toBeDefined();
    expect(theme.cssVariables).toBeDefined();
  });

  it('should handle branding preference with missing theme variant', () => {
    const brandingPreferenceWithMissingVariant: BrandingPreference = {
      preference: {
        theme: {
          activeTheme: 'NONEXISTENT',
        },
      },
    };
    const theme = transformBrandingPreferenceToTheme(brandingPreferenceWithMissingVariant);

    expect(theme).toBeDefined();
    expect(theme.colors).toBeDefined();
    expect(theme.cssVariables).toBeDefined();
  });

  it('should use default values for missing color properties', () => {
    const minimalBrandingPreference: BrandingPreference = {
      preference: {
        theme: {
          activeTheme: 'LIGHT',
          LIGHT: {
            colors: {
              primary: {
                main: '#ff0000',
              },
            },
          },
        },
      },
    };
    const theme = transformBrandingPreferenceToTheme(minimalBrandingPreference);

    expect(theme.colors.primary.main).toBe('#ff0000');
    expect(theme.colors.primary.contrastText).toBe('#ffffff'); // Default value
    expect(theme.colors.secondary.main).toBe('#424242'); // Default value
    expect(theme.colors.error.main).toBe('#d32f2f'); // Default value
    expect(theme.colors.success.main).toBe('#4caf50'); // Default value
    expect(theme.colors.warning.main).toBe('#ff9800'); // Default value
  });
});
