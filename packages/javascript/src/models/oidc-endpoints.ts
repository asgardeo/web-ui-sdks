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

import {OIDCEndpoints as LegacyOIDCEndpoints} from '../__legacy__/models/oidc-provider-meta-data';

/**
 * Interface representing OpenID Connect endpoints configuration.
 * FIXME: Remove the temporary extends of legacy OIDC endpoints.
 */
export interface OIDCEndpoints extends Partial<LegacyOIDCEndpoints> {
  /**
   * The issuer identifier URL for the OpenID Provider
   */
  issuer: string;
  /**
   * The OpenID Provider's discovery endpoint URL
   */
  discovery: string;
  /**
   * The authorization endpoint URL where the authentication request is sent
   */
  authorize: string;
  /**
   * The userinfo endpoint URL that returns claims about the authenticated user
   */
  userinfo: string;
  /**
   * The introspection endpoint URL used to validate tokens
   */
  introspect: string;
  /**
   * The JSON Web Key Set endpoint URL that provides the public keys to verify tokens
   */
  jwks: string;
  /**
   * The revocation endpoint URL used to revoke access or refresh tokens
   */
  revoke: string;
  /**
   * The end session endpoint URL used to terminate the user's session
   */
  endSession: string;
}
