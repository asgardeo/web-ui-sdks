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

import {
  BackgroundStyleAttributes,
  BorderStyleAttributes,
  ButtonStyleAttributes,
  ColorStyleAttributes,
  ElementState,
  FontStyleAttributes,
} from './element-styles';

/**
 * Interface for the Branding Preference API response.
 */
export interface BrandingPreferenceAPIResponse {
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
  preference: BrandingPreference;
  /**
   * Preference type.
   */
  type: BrandingPreferenceTypes;
}

/**
 * Interface Branding preference object.
 */
export interface BrandingPreference {
  /**
   * Configurations.
   */
  configs: BrandingPreferenceConfig;
  /**
   * images such as Logo, Favicon, etc.
   * @deprecated Use the images object in `theme.[<DESIRED_THEME>].images`.
   */
  images?: BrandingPreferenceImages;
  /**
   * Layout.
   */
  layout: BrandingPreferenceLayout;
  /**
   * Organization's basic details.
   */
  organizationDetails: BrandingPreferenceOrganizationDetails;
  /**
   * Stylesheets for login pages etc..
   */
  stylesheets?: BrandingPreferenceStylesheets;
  /**
   * Theme.
   */
  theme: BrandingPreferenceTheme;
  /**
   * Links for policies, etc.
   */
  urls: BrandingPreferenceURL;
}

/**
 * Interface Branding preference organization details.
 */
export interface BrandingPreferenceOrganizationDetails {
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
export interface BrandingPreferenceImages {
  /**
   * Organization Favicon.
   */
  favicon: Omit<BrandingPreferenceImage, 'altText'>;
  /**
   * Organization Logo.
   */
  logo: BrandingPreferenceImage;
  /**
   * Organization My Account Logo.
   */
  myAccountLogo: BrandingPreferenceImage;
}

/**
 * Interface Branding preference image.
 */
export interface BrandingPreferenceImage {
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
export interface BrandingPreferenceURL {
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
export interface BrandingPreferenceStylesheets {
  /**
   * Login portal stylesheet.
   */
  accountApp: PredefinedThemes;
}

export type BrandingPreferenceTheme = StrictBrandingPreferenceTheme & DynamicBrandingPreferenceTheme;

/**
 * Interface Branding preference theme.
 */
export type DynamicBrandingPreferenceTheme = {
  [key in PredefinedThemesKeys]: ThemeConfig;
};

/**
 * Theme Configurations Interface.
 */
export interface ThemeConfig {
  /**
   * Button Preferences.
   */
  buttons: BrandingPreferenceButtons;
  /**
   * Color Palette.
   */
  colors: BrandingPreferenceColors;
  /**
   * Footer Preferences.
   */
  footer: BrandingPreferenceFooter;
  /**
   * images such as Logo, Favicon, etc.
   */
  images: BrandingPreferenceImages;
  /**
   * Input Fields Preferences.
   */
  inputs: ElementState<BrandingPreferenceInput>;
  /**
   * Login Box Preferences.
   */
  loginBox: BrandingPreferenceLoginBox;
  /**
   * Login Page Preferences.
   */
  loginPage?: BrandingPreferencePage;
  /**
   * Page Preferences.
   * @deprecated Renamed to `loginPage` to keep it specific for login page.
   */
  page?: BrandingPreferencePage;
  /**
   * Typography Preferences.
   */
  typography: BrandingPreferenceTypography;
}

/**
 * Strict Interface Branding preference theme.
 */
export interface StrictBrandingPreferenceTheme {
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
export interface BrandingPreferenceColors {
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
export interface BrandingPreferenceFooter {
  /**
   * Page Body Font.
   */
  border: Pick<BorderStyleAttributes, 'borderColor'>;
  /**
   * Page Body Font.
   */
  font: FontStyleAttributes;
}

/**
 * Interface Branding preference page preferences.
 */
export interface BrandingPreferencePage {
  /**
   * Page Background.
   */
  background: BackgroundStyleAttributes;
  /**
   * Page Body Font.
   */
  font: FontStyleAttributes;
}

/**
 * Interface for the Branding Preference Typography.
 */
export interface BrandingPreferenceTypography {
  /**
   * Page Font.
   */
  font: BrandingPreferenceTypographyFont;
  /**
   * Page Heading Typography.
   */
  heading: {
    /**
     * Page Heading Font Preferences.
     */
    font: ColorStyleAttributes;
  };
}

/**
 * Interface for the Font Typography Font.
 */
export interface BrandingPreferenceTypographyFont {
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
export interface BrandingPreferenceButtons {
  /**
   * Social, External IDP Connection Button Preference.
   */
  externalConnection: ElementState<ButtonStyleAttributes>;
  /**
   * Primary Button Preferences.
   */
  primary: ElementState<Omit<ButtonStyleAttributes, 'background'>>;
  /**
   * Secondary Button Preferences.
   */
  secondary: ElementState<Omit<ButtonStyleAttributes, 'background'>>;
}

/**
 * Interface for the Login Box Preferences.
 */
export interface BrandingPreferenceInput {
  /**
   * Input field background.
   */
  background: BackgroundStyleAttributes;
  /**
   * Secondary Button Preferences.
   */
  border: Pick<BorderStyleAttributes, 'borderRadius' | 'borderColor'>;
  /**
   * Input Field Font Preferences.
   */
  font: FontStyleAttributes;
  /**
   * Input Labels Preferences.
   */
  labels: {
    /**
     * Input Labels Font Preferences.
     */
    font: FontStyleAttributes;
  };
}

export interface BrandingPreferenceLoginBox {
  /**
   * Login Box Background.
   */
  background: BackgroundStyleAttributes;
  /**
   * Login Box Border.
   */
  border: BorderStyleAttributes;
  /**
   * Login Box Font.
   */
  font: FontStyleAttributes;
}

/**
 * Interface Branding preference layout.
 */
export type BrandingPreferenceLayout = StrictBrandingPreferenceLayout & Partial<DynamicBrandingPreferenceLayout>;

/**
 * Strict Interface Branding preference layout.
 */
export interface StrictBrandingPreferenceLayout {
  /**
   * The active layout.
   */
  activeLayout: PredefinedLayouts;
}

/**
 * Interface dynamic branding preference layout.
 */
export type DynamicBrandingPreferenceLayout = BrandingPreferenceSideImageLayout & BrandingPreferenceSideAlignedLayout;

/**
 * Left Image and Right Image layouts preference interface.
 */
export interface BrandingPreferenceSideImageLayout {
  sideImg: BrandingPreferenceImage;
}

/**
 * Left Aligned and Right Aligned layouts preference interface.
 */
export interface BrandingPreferenceSideAlignedLayout {
  productTagLine: string;
}

/**
 * Interface Branding preference configurations.
 */
export interface BrandingPreferenceConfig {
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
   * Branding Preference for the App.
   */
  App = 'APP',
  /**
   * Custom Branding Preference.
   */
  Custom = 'CUSTOM',
  /**
   * Branding Preference for the Organization.
   */
  Org = 'ORG',
}

/**
 * Enum for the font config strategies.
 */
export enum FontConfigurationStrategies {
  BrowserDefault = 'BROWSER_DEFAULT',
  Cdn = 'CDN',
}

/**
 * Enum for preview screen types.
 */
export enum PreviewScreenType {
  EmailTemplate = 'email-template',
  Login = 'login',
  MyAccount = 'myaccount',
}

/**
 * Enum for set of predefined layouts.
 */
export enum PredefinedLayouts {
  Centered = 'centered',
  Custom = 'custom',
  LeftAligned = 'left-aligned',
  LeftImage = 'left-image',
  RightAligned = 'right-aligned',
  RightImage = 'right-image',
}

/**
 * Enum for set of predefined themes.
 */
export enum PredefinedThemes {
  Dark = 'DARK',
  Light = 'LIGHT',
}

/**
 * Mirror the enum as a string literal type
 * to be used as a key in the theme object.
 */
export type PredefinedThemesKeys = 'LIGHT' | 'DARK';
