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

import {OIDCEndpoints} from '../models/oidc-endpoints';

/**
 * Default OpenID Connect (OIDC) endpoints configuration.
 * These endpoints follow the standard OIDC protocol paths.
 *
 * @remarks
 * All paths are relative and should be combined with the base authorization server URL.
 */
export const DefaultOIDCEndpoints: OIDCEndpoints = {
  authorize: '/oauth2/authorize',
  discovery: '/.well-known/openid-configuration',
  introspect: '/oauth2/introspect',
  jwks: '/oauth2/jwks',
  revoke: '/oauth2/revoke',
  endSession: '/oauth2/logout',
  issuer: '/oauth2/token',
  userinfo: '/oauth2/userinfo',
} as const;

export default DefaultOIDCEndpoints;
