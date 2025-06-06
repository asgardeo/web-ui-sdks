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

/**
 * Interface for the standard (required) claims of an ID Token payload.
 */
export interface IdTokenPayloadStandardClaims {
  /**
   * The audience for which this token is intended.
   */
  aud: string | string[];

  /**
   * The unique identifier of the user to whom the ID token belongs.
   */
  sub: string;

  /**
   * The issuer identifier for the issuer of the response.
   */
  iss: string;

  /**
   * The email of the user.
   */
  email?: string;

  /**
   * The username the user prefers to be called.
   */
  preferred_username?: string;

  /**
   * The tenant domain of the user.
   */
  tenant_domain?: string;
}

/**
 * Interface for ID Token payload including custom claims.
 */
export interface IdTokenPayload extends IdTokenPayloadStandardClaims {
  /**
   * Other custom claims.
   */
  [claim: string]: any;
}
