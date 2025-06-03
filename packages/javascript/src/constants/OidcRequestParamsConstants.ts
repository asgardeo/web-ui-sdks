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
 * Constants representing standard OpenID Connect (OIDC) request and response parameters.
 * These parameters are commonly used during authorization, token exchange, and logout flows.
 */
const OidcRequestParamsConstants = {
  /**
   * The authorization code returned from the authorization endpoint.
   * Used in the authorization code flow.
   */
  AUTHORIZATION_CODE: 'code',

  /**
   * Session state parameter used for session management between the client and the OP.
   */
  SESSION_STATE: 'session_state',

  /**
   * State parameter used to maintain state between the request and the callback.
   * Helps in preventing CSRF attacks.
   */
  STATE: 'state',

  /**
   * Indicates whether sign-out was successful during the end-session flow.
   * May be returned by the OP after a logout request.
   */
  SIGN_OUT_SUCCESS: 'sign_out_success',
} as const;

export default OidcRequestParamsConstants;
