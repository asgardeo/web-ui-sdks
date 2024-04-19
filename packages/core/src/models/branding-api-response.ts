/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {
  BackgroundStyleAttributesInterface,
  BorderStyleAttributesInterface,
  ButtonStyleAttributesInterface,
  ColorStyleAttributesInterface,
  ElementStateInterface,
  FontStyleAttributesInterface,
} from './element-styles';

/**
 * Interface for the Branding Preference API response.
 */
export interface BrandingPreferenceAPIResponseInterface {
  /**
   * Resource locale.
   */
  locale: string;
  /**
   * Requested resource name.
   */
  name: string;
  /**
   * Preference object.
   */
  preference: BrandingPreferenceInterface;
  /**
   * Preference type.
   */
  type: BrandingPreferenceTypes;
}

/**
 * Interface Branding preference object.
 */
export interface BrandingPreferenceInterface {
  /**
   * Configurations.
   */
  configs: BrandingPreferenceConfigInterface;
  /**
   * images such as Logo, Favicon, etc.
   * @deprecated Use the images object in `theme.[<DESIRED_THEME>].images`.
   */
  images?: BrandingPreferenceImagesInterface;
  /**
   * Layout.
   */
  layout: BrandingPreferenceLayoutInterface;
  /**
   * Organization's basic details.
   */
  organizationDetails: BrandingPreferenceOrganizationDetailsInterface;
  /**
   * Stylesheets for login pages etc..
   */
  stylesheets?: BrandingPreferenceStylesheetsInterface;
  /**
   * Theme.
   */
  theme: BrandingPreferenceThemeInterface;
  /**
   * Links for policies, etc.
   */
  urls: BrandingPreferenceURLInterface;
}

/**
 * Interface Branding preference organization details.
 */
export interface BrandingPreferenceOrganizationDetailsInterface {
  /**
   * Copyright for the footer.
   * @deprecated Moved to the `/branding-preference/text` API.
   */
  copyrightText?: string;
  /**
   * Display name to be shown for Org members.
   */
  displayName: string;
  /**
   * Site title appearing on the browser tab.
   * @deprecated Moved to the `/branding-preference/text` API.
   */
  siteTitle?: string;
  /**
   * Support email to be shown for Org members.
   */
  supportEmail: string;
}

/**
 * Interface Branding preference images.
 */
export interface BrandingPreferenceImagesInterface {
  /**
   * Organization Favicon.
   */
  favicon: Omit<BrandingPreferenceImageInterface, 'altText'>;
  /**
   * Organization Logo.
   */
  logo: BrandingPreferenceImageInterface;
  /**
   * Organization My Account Logo.
   */
  myAccountLogo: BrandingPreferenceImageInterface;
}

/**
 * Interface Branding preference image.
 */
export interface BrandingPreferenceImageInterface {
  /**
   * Image Alt.
   */
  altText: string | undefined;
  /**
   * Image URL.
   */
  imgURL: string | undefined;
  /**
   * Title.
   */
  title?: string;
}

/**
 * Interface Branding preference URLs.
 */
export interface BrandingPreferenceURLInterface {
  /**
   * Link for Cookie Policy.
   */
  cookiePolicyURL: string;
  /**
   * Link for Privacy Policy.
   */
  privacyPolicyURL: string;
  /**
   * Link for Terms of Service.
   */
  termsOfUseURL: string;
}

/**
 * Interface Branding preference stylesheets.
 */
export interface BrandingPreferenceStylesheetsInterface {
  /**
   * Login portal stylesheet.
   */
  accountApp: PredefinedThemes;
}

export type BrandingPreferenceThemeInterface = StrictBrandingPreferenceThemeInterface &
  DynamicBrandingPreferenceThemeInterface;

/**
 * Interface Branding preference theme.
 */
export type DynamicBrandingPreferenceThemeInterface = {
  [key in PredefinedThemesKeys]: ThemeConfigInterface;
};

/**
 * Theme Configurations Interface.
 */
export interface ThemeConfigInterface {
  /**
   * Button Preferences.
   */
  buttons: BrandingPreferenceButtonsInterface;
  /**
   * Color Palette.
   */
  colors: BrandingPreferenceColorsInterface;
  /**
   * Footer Preferences.
   */
  footer: BrandingPreferenceFooterInterface;
  /**
   * images such as Logo, Favicon, etc.
   */
  images: BrandingPreferenceImagesInterface;
  /**
   * Input Fields Preferences.
   */
  inputs: ElementStateInterface<BrandingPreferenceInputInterface>;
  /**
   * Login Box Preferences.
   */
  loginBox: BrandingPreferenceLoginBoxInterface;
  /**
   * Login Page Preferences.
   */
  loginPage?: BrandingPreferencePageInterface;
  /**
   * Page Preferences.
   * @deprecated Renamed to `loginPage` to keep it specific for login page.
   */
  page?: BrandingPreferencePageInterface;
  /**
   * Typography Preferences.
   */
  typography: BrandingPreferenceTypographyInterface;
}

/**
 * Strict Interface Branding preference theme.
 */
export interface StrictBrandingPreferenceThemeInterface {
  /**
   * The active theme.
   */
  activeTheme: PredefinedThemes;
}

/**
 * Represents a color palette with different shades and contrast text.
 */
export interface PaletteColor {
  /**
   * The contrast text color for the color.
   */
  contrastText?: string;

  /**
   * The dark shade of the color.
   */
  dark?: string;

  /**
   * The inverted color for the color.
   */
  inverted?: string;

  /**
   * The light shade of the color.
   */
  light?: string;

  /**
   * The main shade of the color.
   */
  main: string;
}

/**
 * Interface defining the color palette for a branding preference theme.
 */
export interface BrandingPreferenceColorsInterface {
  /**
   * The alerts color palette of the theme.
   */
  alerts: {
    /**
     * The error alerts color palette of the theme.
     */
    error: PaletteColor;
    /**
     * The info alerts color palette of the theme.
     */
    info: PaletteColor;
    /**
     * The neutral alerts color palette of the theme.
     */
    neutral: PaletteColor;
    /**
     * The warning alerts color palette of the theme.
     */
    warning: PaletteColor;
  };
  /**
   * The background color palette of the theme.
   */
  background: {
    /**
     * The body background color palette of the theme.
     */
    body: PaletteColor;
    /**
     * The surface background color palette of the theme.
     */
    surface: PaletteColor;
  };
  /**
   * The illustrations color palette of the theme.
   */
  illustrations: {
    /**
     * The accent 1 illustrations color palette of the theme.
     */
    accent1: PaletteColor;
    /**
     * The accent 2 illustrations color palette of the theme.
     */
    accent2: PaletteColor;
    /**
     * The accent 3 illustrations color palette of the theme.
     */
    accent3: PaletteColor;
    /**
     * The primary illustrations color palette of the theme.
     */
    primary: PaletteColor;
    /**
     * The secondary illustrations color palette of the theme.
     */
    secondary: PaletteColor;
  };
  /**
   * The outlined color palette of the theme.
   */
  outlined: {
    /**
     * The default outlined color palette of the theme.
     */
    default: string;
  };
  /**
   * The primary color palette of the theme.
   */
  primary: PaletteColor;
  /**
   * The secondary color palette of the theme.
   */
  secondary: PaletteColor;
  /**
   * The text color palette of the theme.
   */
  text: {
    /**
     * The primary text color palette of the theme.
     */
    primary: string;
    /**
     * The secondary text color palette of the theme.
     */
    secondary: string;
  };
}

/**
 * Interface Branding preference footer preferences.
 */
export interface BrandingPreferenceFooterInterface {
  /**
   * Page Body Font.
   */
  border: Pick<BorderStyleAttributesInterface, 'borderColor'>;
  /**
   * Page Body Font.
   */
  font: FontStyleAttributesInterface;
}

/**
 * Interface Branding preference page preferences.
 */
export interface BrandingPreferencePageInterface {
  /**
   * Page Background.
   */
  background: BackgroundStyleAttributesInterface;
  /**
   * Page Body Font.
   */
  font: FontStyleAttributesInterface;
}

/**
 * Interface for the Branding Preference Typography.
 */
export interface BrandingPreferenceTypographyInterface {
  /**
   * Page Font.
   */
  font: BrandingPreferenceTypographyFontInterface;
  /**
   * Page Heading Typography.
   */
  heading: {
    /**
     * Page Heading Font Preferences.
     */
    font: ColorStyleAttributesInterface;
  };
}

/**
 * Interface for the Font Typography Font.
 */
export interface BrandingPreferenceTypographyFontInterface {
  /**
   * Font Family.
   */
  fontFamily: string;
  /**
   * URL to import if loaded from a CDN.
   */
  importURL?: string;
}

/**
 * Interface for the Login Box Preferences.
 */
export interface BrandingPreferenceButtonsInterface {
  /**
   * Social, External IDP Connection Button Preference.
   */
  externalConnection: ElementStateInterface<ButtonStyleAttributesInterface>;
  /**
   * Primary Button Preferences.
   */
  primary: ElementStateInterface<Omit<ButtonStyleAttributesInterface, 'background'>>;
  /**
   * Secondary Button Preferences.
   */
  secondary: ElementStateInterface<Omit<ButtonStyleAttributesInterface, 'background'>>;
}

/**
 * Interface for the Login Box Preferences.
 */
export interface BrandingPreferenceInputInterface {
  /**
   * Input field background.
   */
  background: BackgroundStyleAttributesInterface;
  /**
   * Secondary Button Preferences.
   */
  border: Pick<BorderStyleAttributesInterface, 'borderRadius' | 'borderColor'>;
  /**
   * Input Field Font Preferences.
   */
  font: FontStyleAttributesInterface;
  /**
   * Input Labels Preferences.
   */
  labels: {
    /**
     * Input Labels Font Preferences.
     */
    font: FontStyleAttributesInterface;
  };
}

export interface BrandingPreferenceLoginBoxInterface {
  /**
   * Login Box Background.
   */
  background: BackgroundStyleAttributesInterface;
  /**
   * Login Box Border.
   */
  border: BorderStyleAttributesInterface;
  /**
   * Login Box Font.
   */
  font: FontStyleAttributesInterface;
}

/**
 * Interface Branding preference layout.
 */
export type BrandingPreferenceLayoutInterface = StrictBrandingPreferenceLayoutInterface &
  Partial<DynamicBrandingPreferenceLayoutInterface>;

/**
 * Strict Interface Branding preference layout.
 */
export interface StrictBrandingPreferenceLayoutInterface {
  /**
   * The active layout.
   */
  activeLayout: PredefinedLayouts;
}

/**
 * Interface dynamic branding preference layout.
 */
export type DynamicBrandingPreferenceLayoutInterface = BrandingPreferenceSideImageLayoutInterface &
  BrandingPreferenceSideAlignedLayoutInterface;

/**
 * Left Image and Right Image layouts preference interface.
 */
export interface BrandingPreferenceSideImageLayoutInterface {
  sideImg: BrandingPreferenceImageInterface;
}

/**
 * Left Aligned and Right Aligned layouts preference interface.
 */
export interface BrandingPreferenceSideAlignedLayoutInterface {
  productTagLine: string;
}

/**
 * Interface Branding preference configurations.
 */
export interface BrandingPreferenceConfigInterface {
  /**
   * Should the changes be published?
   */
  isBrandingEnabled: boolean;
  /**
   * Should remove default branding.
   * @deprecated Renamed to `removeDefaultBranding` to keep it common.
   */
  removeAsgardeoBranding?: boolean;
  /**
   * Should remove default branding.
   */
  removeDefaultBranding?: boolean;
}

/**
 * Enum for Branding Preference Types.
 */
export enum BrandingPreferenceTypes {
  /**
   * Branding Preference for the Organization.
   */
  ORG = 'ORG',
}

/**
 * Enum for the font config strategies.
 */
export enum FontConfigurationStrategies {
  BROWSER_DEFAULT = 'BROWSER_DEFAULT',
  CDN = 'CDN',
}

/**
 * Enum for preview screen types.
 */
export enum PreviewScreenType {
  EMAIL_TEMPLATE = 'email-template',
  LOGIN = 'login',
  MY_ACCOUNT = 'myaccount',
}

/**
 * Enum for set of predefined layouts.
 */
export enum PredefinedLayouts {
  CENTERED = 'centered',
  CUSTOM = 'custom',
  LEFT_ALIGNED = 'left-aligned',
  LEFT_IMAGE = 'left-image',
  RIGHT_ALIGNED = 'right-aligned',
  RIGHT_IMAGE = 'right-image',
}

/**
 * Enum for set of predefined themes.
 */
export enum PredefinedThemes {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

/**
 * Mirror the enum as a string literal type
 * to be used as a key in the theme object.
 */
export type PredefinedThemesKeys = 'LIGHT' | 'DARK';
