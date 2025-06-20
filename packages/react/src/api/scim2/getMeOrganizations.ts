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

import {AsgardeoAPIError, HttpInstance, AsgardeoSPAClient, HttpRequestConfig, Organization} from '@asgardeo/browser';

const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Retrieves the organizations associated with the current user.
 *
 * @param config - Configuration object containing baseUrl and optional request config.
 * @returns A promise that resolves with the organizations information.
 * @example
 * ```typescript
 * try {
 *   const organizations = await getMeOrganizations({
 *     baseUrl: "https://api.asgardeo.io/t/<ORGANIZATION>",
 *   });
 *   console.log(organizations);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Failed to get organizations:', error.message);
 *   }
 * }
 * ```
 */
const getMeOrganizations = async ({
  baseUrl,
  ...requestConfig
}: Partial<Request> & {
  baseUrl: string;
}): Promise<Organization[]> => {
  if (!baseUrl) {
    throw new AsgardeoAPIError(
      'Base URL is required',
      'getMeOrganizations-ValidationError-001',
      'javascript',
      400,
      'Invalid Request',
    );
  }

  const response: any = await httpClient({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    url: `${baseUrl}/api/users/v1/me/organizations/root/descendants`,
    ...requestConfig,
  } as HttpRequestConfig);

  if (!response.data) {
    const errorText: string = await response.text();

    throw new AsgardeoAPIError(
      `Failed to fetch associated organizations of the user: ${errorText}`,
      'getMeOrganizations-ResponseError-001',
      'javascript',
      response.status,
      response.statusText,
    );
  }

  return response.data;
};

export default getMeOrganizations;
