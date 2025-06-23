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

import {AsgardeoAPIError, HttpInstance, AsgardeoSPAClient, HttpRequestConfig} from '@asgardeo/browser';

const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Extended organization interface with additional properties
 */
export interface OrganizationDetails {
  created?: string;
  description?: string;
  id: string;
  lastModified?: string;
  name: string;
  orgHandle: string;
  parent?: {
    id: string;
    ref: string;
  };
  permissions?: string[];
  status?: string;
  type?: string;
}

/**
 * Retrieves detailed information for a specific organization.
 *
 * @param config - Configuration object containing baseUrl, organizationId, and request config.
 * @returns A promise that resolves with the organization details.
 * @example
 * ```typescript
 * try {
 *   const organization = await getOrganization({
 *     baseUrl: "https://api.asgardeo.io/t/dxlab",
 *     organizationId: "0d5e071b-d3d3-475d-b3c6-1a20ee2fa9b1"
 *   });
 *   console.log(organization);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Failed to get organization:', error.message);
 *   }
 * }
 * ```
 */
const getOrganization = async ({
  baseUrl,
  organizationId,
  ...requestConfig
}: Partial<Request> & {
  baseUrl: string;
  organizationId: string;
}): Promise<OrganizationDetails> => {
  if (!baseUrl) {
    throw new AsgardeoAPIError(
      'Base URL is required',
      'getOrganization-ValidationError-001',
      'javascript',
      400,
      'Invalid Request',
    );
  }

  if (!organizationId) {
    throw new AsgardeoAPIError(
      'Organization ID is required',
      'getOrganization-ValidationError-002',
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
    url: `${baseUrl}/api/server/v1/organizations/${organizationId}`,
    ...requestConfig,
  } as HttpRequestConfig);

  if (!response.data) {
    const errorText: string = await response.text();

    throw new AsgardeoAPIError(
      `Failed to fetch organization details: ${errorText}`,
      'getOrganization-ResponseError-001',
      'javascript',
      response.status,
      response.statusText,
    );
  }

  return response.data;
};

export default getOrganization;
