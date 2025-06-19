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

import AsgardeoAPIError from '../errors/AsgardeoAPIError';
import {ApplicationNativeAuthenticationInitiateResponse} from '../models/application-native-authentication';

/**
 * Represents the authorization request payload that can be sent to the authorization endpoint.
 */
export interface AuthorizationRequest {
  /**
   * Additional authorization parameters.
   */
  [key: string]: any;
  /**
   * The client identifier.
   */
  client_id?: string;
  /**
   * PKCE code challenge.
   */
  code_challenge?: string;
  /**
   * PKCE code challenge method.
   */
  code_challenge_method?: string;
  /**
   * The allowable elapsed time in seconds since the last time the End-User was actively authenticated.
   */
  max_age?: number;
  /**
   * String value used to associate a Client session with an ID Token.
   */
  nonce?: string;
  /**
   * Space delimited, case sensitive list of ASCII string values.
   */
  prompt?: string;
  /**
   * The redirection URI after authorization.
   */
  redirect_uri?: string;
  /**
   * How the authorization response should be returned.
   */
  response_mode?: string;
  /**
   * The response type (e.g., 'code', 'token', 'id_token').
   */
  response_type?: string;
  /**
   * The scope of the access request.
   */
  scope?: string;
  /**
   * An unguessable random string to prevent CSRF attacks.
   */
  state?: string;
}

/**
 * Request configuration for the authorize function.
 */
export interface AuthorizeRequestConfig extends Partial<Request> {
  /**
   * The base URL of the Asgardeo server.
   */
  baseUrl?: string;
  /**
   * The authorization request payload.
   */
  payload: AuthorizationRequest;
  url?: string;
}

/**
 * Sends an authorization request to the specified OAuth2/OIDC authorization endpoint.
 *
 * @param requestConfig - Request configuration object containing URL and payload.
 * @returns A promise that resolves with the authorization response.
 * @throws AsgardeoAPIError when the request fails or URL is invalid.
 *
 * @example
 * ```typescript
 * try {
 *   const authResponse = await initializeApplicationNativeAuthentication({
 *     url: "https://api.asgardeo.io/t/<ORGANIZATION>/oauth2/authorize",
 *     payload: {
 *       response_type: "code",
 *       client_id: "your-client-id",
 *       redirect_uri: "https://your-app.com/callback",
 *       scope: "openid profile email",
 *       state: "random-state-value",
 *       code_challenge: "your-pkce-challenge",
 *       code_challenge_method: "S256"
 *     }
 *   });
 *   console.log(authResponse);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Authorization failed:', error.message);
 *   }
 * }
 * ```
 */
const initializeApplicationNativeAuthentication = async ({
  url,
  baseUrl,
  payload,
  ...requestConfig
}: AuthorizeRequestConfig): Promise<ApplicationNativeAuthenticationInitiateResponse> => {
  if (!payload) {
    throw new AsgardeoAPIError(
      'Authorization payload is required',
      'initializeApplicationNativeAuthentication-ValidationError-002',
      'javascript',
      400,
      'If an authorization payload is not provided, the request cannot be constructed correctly.',
    );
  }

  const searchParams = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const {headers: customHeaders, ...otherConfig} = requestConfig;
  const response: Response = await fetch(url ?? `${baseUrl}/oauth2/authorize`, {
    method: requestConfig.method || 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      ...customHeaders,
    },
    body: searchParams.toString(),
    ...otherConfig,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new AsgardeoAPIError(
      `Authorization request failed: ${errorText}`,
      'initializeApplicationNativeAuthentication-ResponseError-001',
      'javascript',
      response.status,
      response.statusText,
    );
  }

  return (await response.json()) as ApplicationNativeAuthenticationInitiateResponse;
};

export default initializeApplicationNativeAuthentication;
