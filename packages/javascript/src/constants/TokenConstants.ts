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
 * Constants related to OIDC token management and storage.
 */
const TokenConstants = {
  /**
   * Token signature validation constants.
   */
  SignatureValidation: {
    /**
     * Fallback array of supported signature algorithms for OIDC token validation.
     * These values are used when the supported algorithms cannot be retrieved from
     * the .well-known/openid-configuration endpoint.
     *
     * Supported algorithms:
     * - `RS256` - RSASSA-PKCS1-v1_5 using SHA-256
     * - `RS512` - RSASSA-PKCS1-v1_5 using SHA-512
     * - `RS384` - RSASSA-PKCS1-v1_5 using SHA-384
     * - `PS256` - RSASSA-PSS using SHA-256 and MGF1 with SHA-256
     */
    SUPPORTED_ALGORITHMS: ['RS256', 'RS512', 'RS384', 'PS256'],
  },

  /**
   * Storage-related constants for OIDC tokens.
   */
  Storage: {
    /**
     * Timer-related storage keys.
     */
    TimerKeys: {
      /**
       * Key used to store the refresh token timer identifier.
       */
      REFRESH_TOKEN_TIMER: 'refresh_token_timer',
    },
  },
} as const;

export default TokenConstants;
