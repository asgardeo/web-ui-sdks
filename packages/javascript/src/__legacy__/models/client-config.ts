/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {OAuthResponseMode} from '../../models/oauth-response';
import {OIDCEndpoints} from '../../models/oidc-endpoints';

export interface DefaultAuthClientConfig {
  afterSignInUrl: string;
  afterSignOutUrl?: string;
  clientHost?: string;
  clientId: string;
  clientSecret?: string;
  enablePKCE?: boolean;
  prompt?: string;
  responseMode?: OAuthResponseMode;
  scopes?: string | string[] | undefined;
  tokenValidation?: {
    /**
     * ID token validation config.
     */
    idToken?: {
      /**
       * Whether to validate ID tokens.
       */
      validate?: boolean;
      /**
       * Whether to validate the issuer of ID tokens.
       */
      validateIssuer?: boolean;
      /**
       * Allowed leeway for ID tokens (in seconds).
       */
      clockTolerance?: number;
    };
  };
  /**
   * Specifies if cookies should be sent with access-token requests, refresh-token requests,
   * custom-grant requests, etc.
   *
   */
  sendCookiesInRequests?: boolean;
  sendIdTokenInLogoutRequest?: boolean;
}

export interface WellKnownAuthClientConfig extends DefaultAuthClientConfig {
  wellKnownEndpoint: string;
  endpoints?: Partial<OIDCEndpoints>;
  baseUrl?: string;
}

export interface BaseURLAuthClientConfig extends DefaultAuthClientConfig {
  baseUrl: string;
  endpoints?: Partial<OIDCEndpoints>;
  wellKnownEndpoint?: string;
}

export interface ExplicitAuthClientConfig extends DefaultAuthClientConfig {
  endpoints: OIDCEndpoints;
  baseUrl?: string;
  wellKnownEndpoint?: string;
}

export type StrictAuthClientConfig = WellKnownAuthClientConfig | BaseURLAuthClientConfig | ExplicitAuthClientConfig;

export type AuthClientConfig<T = unknown> = StrictAuthClientConfig & T;
