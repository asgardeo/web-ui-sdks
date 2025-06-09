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

import type {BasicUserInfo, StorageManager, IdTokenPayload, OIDCEndpoints} from '@asgardeo/node';

export interface ModuleOptions {
  /**
   * The base URL of your Asgardeo organization tenant.
   * e.g., https://api.asgardeo.io/t/your_org_name
   * @default process.env.ASGARDEO_BASE_URL
   */
  baseUrl: string;

  /**
   * Asgardeo Application Client ID.
   * @default process.env.ASGARDEO_CLIENT_ID
   */
  clientId: string;

  /**
   * Asgardeo Application Client Secret. (Server-side only)
   * @default process.env.ASGARDEO_CLIENT_SECRET
   */
  clientSecret?: string;

  /**
   * Authentication scopes to request from Asgardeo.
   * @default ['openid', 'profile']
   */
  scope?: string[]; // Moved up for sorting

  /**
   * The absolute redirect URI where Asgardeo should redirect after sign-in.
   * Must match the URI configured in your Asgardeo app.
   * @default process.env.ASGARDEO_SIGN_IN_REDIRECT_URL
   */
  afterSignInUrl: string;
  /**
   * The absolute URI to redirect to after sign-out completes.
   * @default process.env.ASGARDEO_SIGN_OUT_REDIRECT_URL
   */
  signOutRedirectURL: string;
}

export interface AuthInterface {
  getAccessToken: () => Promise<string | null>;
  getBasicUserInfo: () => Promise<BasicUserInfo | null>;
  getStorageManager: () => Promise<StorageManager<any> | null>;
  getDecodedIDToken: () => Promise<IdTokenPayload | null>;
  getIdToken: () => Promise<string | null>;
  getOIDCServiceEndpoints: () => Promise<OIDCEndpoints | null>;
  isAuthenticated: () => Promise<boolean>;
  revokeAccessToken: () => Promise<void>;
  signIn: (callbackUrl?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export type SessionLastRefreshedAt = Date | undefined;

export type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading';

export type {BasicUserInfo};
