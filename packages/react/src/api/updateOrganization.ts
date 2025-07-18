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

import {
  HttpInstance,
  AsgardeoSPAClient,
  HttpRequestConfig,
  updateOrganization as baseUpdateOrganization,
  UpdateOrganizationConfig as BaseUpdateOrganizationConfig,
  OrganizationDetails,
  createPatchOperations,
} from '@asgardeo/browser';

const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Configuration for the updateOrganization request (React-specific)
 */
export interface UpdateOrganizationConfig extends Omit<BaseUpdateOrganizationConfig, 'fetcher'> {
  /**
   * Optional custom fetcher function. If not provided, the Asgardeo SPA client's httpClient will be used
   * which is a wrapper around axios http.request
   */
  fetcher?: (url: string, config: RequestInit) => Promise<Response>;
}

/**
 * Updates the organization information using the Organizations Management API.
 * This function uses the Asgardeo SPA client's httpClient by default, but allows for custom fetchers.
 *
 * @param config - Configuration object with baseUrl, organizationId, operations and optional request config.
 * @returns A promise that resolves with the updated organization information.
 * @example
 * ```typescript
 * // Using the helper function to create operations automatically
 * const operations = createPatchOperations({
 *   name: "Updated Organization Name",      // Will use REPLACE
 *   description: "",                        // Will use REMOVE (empty string)
 *   customField: "Some value"              // Will use REPLACE
 * });
 *
 * await updateOrganization({
 *   baseUrl: "https://api.asgardeo.io/t/<ORG>",
 *   organizationId: "0d5e071b-d3d3-475d-b3c6-1a20ee2fa9b1",
 *   operations
 * });
 *
 * // Or manually specify operations
 * await updateOrganization({
 *   baseUrl: "https://api.asgardeo.io/t/<ORG>",
 *   organizationId: "0d5e071b-d3d3-475d-b3c6-1a20ee2fa9b1",
 *   operations: [
 *     { operation: "REPLACE", path: "/name", value: "Updated Organization Name" },
 *     { operation: "REMOVE", path: "/description" }
 *   ]
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Using custom fetcher
 * await updateOrganization({
 *   baseUrl: "https://api.asgardeo.io/t/<ORG>",
 *   organizationId: "0d5e071b-d3d3-475d-b3c6-1a20ee2fa9b1",
 *   operations: [
 *     { operation: "REPLACE", path: "/name", value: "Updated Organization Name" }
 *   ],
 *   fetcher: customFetchFunction
 * });
 * ```
 */
const updateOrganization = async ({
  fetcher,
  ...requestConfig
}: UpdateOrganizationConfig): Promise<OrganizationDetails> => {
  const defaultFetcher = async (url: string, config: RequestInit): Promise<Response> => {
    const response = await httpClient({
      url,
      method: config.method || 'PATCH',
      headers: config.headers as Record<string, string>,
      data: config.body ? JSON.parse(config.body as string) : undefined,
    } as HttpRequestConfig);

    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText || '',
      json: () => Promise.resolve(response.data),
      text: () => Promise.resolve(typeof response.data === 'string' ? response.data : JSON.stringify(response.data)),
    } as Response;
  };

  return baseUpdateOrganization({
    ...requestConfig,
    fetcher: fetcher || defaultFetcher,
  });
};

// Re-export the helper function
export {createPatchOperations};

export default updateOrganization;
