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
 * Interface for paginated organization response.
 */
export interface PaginatedOrganizationsResponse {
  hasMore?: boolean;
  nextCursor?: string;
  organizations: Organization[];
  totalCount?: number;
}

/**
 * Retrieves all organizations with pagination support.
 *
 * @param config - Configuration object containing baseUrl, optional query parameters, and request config.
 * @returns A promise that resolves with the paginated organizations information.
 * @example
 * ```typescript
 * try {
 *   const response = await getAllOrganizations({
 *     baseUrl: "https://api.asgardeo.io/t/<ORGANIZATION>",
 *     filter: "",
 *     limit: 10,
 *     recursive: false
 *   });
 *   console.log(response.organizations);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Failed to get organizations:', error.message);
 *   }
 * }
 * ```
 */
const getAllOrganizations = async ({
  baseUrl,
  filter = '',
  limit = 10,
  recursive = false,
  ...requestConfig
}: Partial<Request> & {
  baseUrl: string;
  filter?: string;
  limit?: number;
  recursive?: boolean;
}): Promise<PaginatedOrganizationsResponse> => {
  if (!baseUrl) {
    throw new AsgardeoAPIError(
      'Base URL is required',
      'getAllOrganizations-ValidationError-001',
      'javascript',
      400,
      'Invalid Request',
    );
  }

  const queryParams: URLSearchParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries({
        filter,
        limit: limit.toString(),
        recursive: recursive.toString(),
      }).filter(([, value]: [string, string]) => Boolean(value)),
    ),
  );

  const response: any = await httpClient({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    url: `${baseUrl}/api/server/v1/organizations?${queryParams.toString()}`,
    ...requestConfig,
  } as HttpRequestConfig);

  if (!response.data) {
    const errorText: string = await response.text();

    throw new AsgardeoAPIError(
      errorText || 'Failed to get organizations',
      'getAllOrganizations-NetworkError-001',
      'javascript',
      response.status,
      response.statusText,
    );
  }

  const {data}: any = response;

  return {
    hasMore: data.hasMore,
    nextCursor: data.nextCursor,
    organizations: data.organizations || [],
    totalCount: data.totalCount,
  };
};

export default getAllOrganizations;
