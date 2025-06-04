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

import {IdTokenPayload} from '../models/id-token';

/**
 * Removes standard protocol-specific claims from the ID token payload
 * and returns a camelCased object of user-specific claims.
 *
 * @param payload The raw ID token payload.
 * @returns A cleaned-up, camelCased object containing only user-specific claims.
 * 
 * @example
 * ````typescript
 * const idTokenPayload = {
 *   iss: 'https://example.com',
 *   aud: 'client_id',
 *   exp: 1712345678,
 *   iat: 1712345670,
 *   email: 'user@example.com'
 *  };
 * 
 * const userClaims = extractUserClaimsFromIdToken(idTokenPayload);
 * // // userClaims will be:
 * // {
 * //   email: 'user@example.com'
 * // }
 * ```
 */
const extractUserClaimsFromIdToken = (payload: IdTokenPayload): Record<string, unknown> => {
  const filteredPayload: Partial<IdTokenPayload> = {...payload};

  const protocolClaims = [
    'iss',
    'aud',
    'exp',
    'iat',
    'acr',
    'amr',
    'azp',
    'auth_time',
    'nonce',
    'c_hash',
    'at_hash',
    'nbf',
    'isk',
    'sid',
    'jti',
    'sub',
  ];

  protocolClaims.forEach(claim => {
    delete filteredPayload[claim as keyof IdTokenPayload];
  });

  const userClaims: Record<string, unknown> = {};

  Object.entries(filteredPayload).forEach(([key, value]) => {
    const camelCasedKey = key
      .split('_')
      .map((part, i) => (i === 0 ? part : part[0].toUpperCase() + part.slice(1)))
      .join('');

    userClaims[camelCasedKey] = value;
  });

  return userClaims;
};

export default extractUserClaimsFromIdToken;
