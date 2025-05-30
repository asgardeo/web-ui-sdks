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

import {User} from '../models/user';
import AsgardeoAPIError from '../errors/AsgardeoAPIError';

/**
 * Retrieves the user information from the specified OIDC userinfo endpoint.
 *
 * @param endpoint - The OIDC userinfo endpoint URL. If not provided, uses the default endpoint from DefaultOIDCEndpoints.
 * @returns A promise that resolves with the user information.
 * @throws AsgardeoAPIError When the API request fails or returns a non-200 status code.
 *                           Error code: 'getUserInfo-ResponseError-001'
 *
 * @example
 * ```typescript
 * try {
 *   const userInfo = await getUserInfo();
 *   console.log(userInfo);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Failed to get user info:', error.message);
 *   }
 * }
 * ```
 */
const getUserInfo = async (endpoint: string): Promise<User> => {
  const response: Response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new AsgardeoAPIError(
      `Failed to fetch user info: ${errorText}`,
      'getUserInfo-ResponseError-001',
      'javascript',
      response.status,
      response.statusText,
    );
  }

  return await response.json();
};

export default getUserInfo;
