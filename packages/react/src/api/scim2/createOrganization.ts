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
 * Interface for organization creation payload.
 */
export interface CreateOrganizationPayload {
  /**
   * Organization description.
   */
  description: string;
  /**
   * Organization name.
   */
  name: string;
  /**
   * Parent organization ID.
   */
  parentId: string;
  /**
   * Organization type.
   */
  type: 'TENANT' | 'STRUCTURAL';
}

/**
 * Creates a new organization.
 *
 * @param config - Configuration object containing baseUrl, payload and optional request config.
 * @returns A promise that resolves with the created organization information.
 * @example
 * ```typescript
 * try {
 *   const organization = await createOrganization({
 *     baseUrl: "https://api.asgardeo.io/t/<ORGANIZATION>",
 *     payload: {
 *       description: "Share your screens",
 *       name: "Team Viewer",
 *       parentId: "f4825104-4948-40d9-ab65-a960eee3e3d5",
 *       type: "TENANT"
 *     }
 *   });
 *   console.log(organization);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Failed to create organization:', error.message);
 *   }
 * }
 * ```
 */
const createOrganization = async ({
  baseUrl,
  payload,
  ...requestConfig
}: Partial<Request> & {
  baseUrl: string;
  payload: CreateOrganizationPayload;
}): Promise<Organization> => {
  if (!baseUrl) {
    throw new AsgardeoAPIError(
      'Base URL is required',
      'createOrganization-ValidationError-001',
      'javascript',
      400,
      'Invalid Request',
    );
  }

  if (!payload) {
    throw new AsgardeoAPIError(
      'Organization payload is required',
      'createOrganization-ValidationError-002',
      'javascript',
      400,
      'Invalid Request',
    );
  }

  const response: any = await httpClient({
    data: JSON.stringify(payload),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    url: `${baseUrl}/api/server/v1/organizations`,
    ...requestConfig,
  } as HttpRequestConfig);

  if (!response.data) {
    const errorText: string = await response.text();

    throw new AsgardeoAPIError(
      `Failed to create organization: ${errorText}`,
      'createOrganization-ResponseError-001',
      'javascript',
      response.status,
      response.statusText,
    );
  }

  return response.data;
};

export default createOrganization;
