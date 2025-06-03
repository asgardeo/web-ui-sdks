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

/**
 * Standard OpenID Connect (OIDC) scopes used for authentication and authorization.
 * These scopes determine what user information the client application can access.
 * @see {@link https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims OpenID Connect Core Specification}
 */
const OidcScopeConstants = {
  /**
   * The basic scope required for OpenID Connect authentication.
   * Requests an ID token containing basic user information.
   */
  OPENID: 'openid',

  /**
   * Requests access to the user's basic profile information.
   * May include name, preferred username, picture, etc.
   */
  PROFILE: 'profile',

  /**
   * Requests access to the user's email address and email verification status.
   */
  EMAIL: 'email',
} as const;

export default OidcScopeConstants;
