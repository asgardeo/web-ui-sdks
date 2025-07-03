/**
 * Test example for transformBrandingPreferenceToTheme with images
 */
import {transformBrandingPreferenceToTheme} from '../transformBrandingPreferenceToTheme';
import {BrandingPreference} from '../../models/branding-preference';

// Example branding preference with images
const mockBrandingPreference: BrandingPreference = {
  type: 'ORG',
  name: 'dxlab',
  locale: 'en-US',
  preference: {
    theme: {
      activeTheme: 'LIGHT',
      LIGHT: {
        images: {
          favicon: {
            imgURL: 'https://example.com/favicon.ico',
            title: 'My App Favicon',
            altText: 'Application Icon',
          },
          logo: {
            imgURL: 'https://example.com/logo.png',
            title: 'Company Logo',
            altText: 'Company Brand Logo',
          },
        },
        colors: {
          primary: {
            main: '#FF7300',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#E0E1E2',
            contrastText: '#000000',
          },
          background: {
            surface: {
              main: '#ffffff',
            },
            body: {
              main: '#fbfbfb',
            },
          },
          text: {
            primary: '#000000de',
            secondary: '#00000066',
          },
        },
      },
      DARK: {
        images: {
          favicon: {
            imgURL: 'https://example.com/favicon-dark.ico',
            title: 'My App Favicon Dark',
            altText: 'Application Icon Dark',
          },
          logo: {
            imgURL: 'https://example.com/logo-dark.png',
            title: 'Company Logo Dark',
            altText: 'Company Brand Logo Dark',
          },
        },
        colors: {
          primary: {
            main: '#FF7300',
            contrastText: '#ffffff',
          },
          background: {
            surface: {
              main: '#242627',
            },
            body: {
              main: '#17191a',
            },
          },
          text: {
            primary: '#EBEBEF',
            secondary: '#B9B9C6',
          },
        },
      },
    },
  },
};

// Transform the branding preference to theme
const lightTheme = transformBrandingPreferenceToTheme(mockBrandingPreference, 'light');
const darkTheme = transformBrandingPreferenceToTheme(mockBrandingPreference, 'dark');

console.log('=== LIGHT THEME ===');
console.log('Images:', lightTheme.images);
console.log(
  'CSS Variables (images only):',
  Object.keys(lightTheme.cssVariables)
    .filter(key => key.includes('image'))
    .reduce((obj, key) => {
      obj[key] = lightTheme.cssVariables[key];
      return obj;
    }, {} as Record<string, string>),
);

console.log('\n=== DARK THEME ===');
console.log('Images:', darkTheme.images);
console.log(
  'CSS Variables (images only):',
  Object.keys(darkTheme.cssVariables)
    .filter(key => key.includes('image'))
    .reduce((obj, key) => {
      obj[key] = darkTheme.cssVariables[key];
      return obj;
    }, {} as Record<string, string>),
);

console.log('\n=== THEME VARIABLES ===');
console.log('Light theme vars.images:', lightTheme.vars.images);
console.log('Dark theme vars.images:', darkTheme.vars.images);

export {lightTheme, darkTheme};
