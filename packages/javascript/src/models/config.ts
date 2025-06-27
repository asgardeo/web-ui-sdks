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

import {I18nBundle} from './i18n';
import {RecursivePartial} from './utility-types';
import {ThemeConfig, ThemeMode} from '../theme/types';

export interface BaseConfig<T = unknown> extends WithPreferences {
  /**
   * Optional URL where the authorization server should redirect after authentication.
   * This must match one of the allowed redirect URIs configured in your IdP.
   * If not provided, the framework layer will use the default redirect URL based on the application type.
   *
   * @example
   * For development: "http://localhost:3000/api/auth/callback"
   * For production: "https://your-app.com/api/auth/callback"
   */
  afterSignInUrl?: string | undefined;

  /**
   * Optional URL where the authorization server should redirect after sign out.
   * This must match one of the allowed post logout redirect URIs configured in your IdP
   * and is used to redirect the user after they have signed out.
   * If not provided, the framework layer will use the default sign out URL based on the
   *
   * @example
   * For development: "http://localhost:3000/api/auth/signout"
   * For production: "https://your-app.com/api/auth/signout"
   */
  afterSignOutUrl?: string | undefined;

  /**
   * The base URL of the Asgardeo identity server.
   * Example: "https://api.asgardeo.io/t/{org_name}"
   */
  baseUrl: string | undefined;

  /**
   * The client ID obtained from the Asgardeo application registration.
   * This is used to identify your application during authentication.
   */
  clientId: string | undefined;

  /**
   * Optional client secret for the application.
   * Only required when using confidential client flows.
   * Not recommended for public clients like browser applications.
   */
  clientSecret?: string | undefined;

  /**
   * The scopes to request during authentication.
   * Accepts either a space-separated string or an array of strings.
   *
   * These define what access the token should grant (e.g., openid, profile, email).
   * If not provided, defaults to `["openid"]`.
   *
   * @example
   * scopes: "openid profile email"
   * @example
   * scopes: ["openid", "profile", "email"]
   */
  scopes?: string | string[] | undefined;

  /**
   * Optional URL to redirect the user to sign-in.
   * By default, this will be the sign-in page of Asgardeo.
   * If you want to use a custom sign-in page, you can provide the URL here and use the `SignIn` component to render it.
   */
  signInUrl?: string | undefined;

  /**
   * Optional URL to redirect the user to sign-up.
   * By default, this will be the sign-up page of Asgardeo.
   * If you want to use a custom sign-up page, you can provide the URL here
   * and use the `SignUp` component to render it.
   */
  signUpUrl?: string | undefined;
}

export interface WithPreferences {
  /**
   * Preferences for customizing the Asgardeo UI components
   */
  preferences?: Preferences;
}

export type Config<T = unknown> = BaseConfig<T>;

export interface ThemePreferences {
  /**
   * The theme mode to use. Defaults to 'system'.
   */
  mode?: ThemeMode;
  /**
   * Theme overrides to customize the default theme
   */
  overrides?: RecursivePartial<ThemeConfig>;
}

export interface I18nPreferences {
  /**
   * Custom translations to override default ones.
   */
  bundles?: {
    [key: string]: I18nBundle;
  };
  /**
   * The fallback language to use if translations are not available in the specified language.
   * Defaults to 'en-US'.
   */
  fallbackLanguage?: string;
  /**
   * The language to use for translations.
   * Defaults to the browser's default language.
   */
  language?: string;
}

export interface Preferences {
  /**
   * Internationalization preferences for the Asgardeo UI components
   */
  i18n?: I18nPreferences;
  /**
   * Theme preferences for the Asgardeo UI components
   */
  theme?: ThemePreferences;
}
