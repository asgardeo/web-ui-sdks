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

import {Schema, AsgardeoAPIError, HttpInstance, AsgardeoSPAClient, HttpRequestConfig} from '@asgardeo/browser';

const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Retrieves the SCIM2 schemas from the specified endpoint.
 *
 * @param requestConfig - Request configuration object.
 * @returns A promise that resolves with the SCIM2 schemas information.
 * @example
 * ```typescript
 * try {
 *   const schemas = await getSchemas({
 *     url: "https://api.asgardeo.io/t/<ORGANIZATION>/scim2/Schemas",
 *   });
 *   console.log(schemas);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Failed to get schemas:', error.message);
 *   }
 * }
 * ```
 */
const getSchemas = async ({url}: Partial<Request>): Promise<Schema[]> => {
  try {
    new URL(url);
  } catch (error) {
    throw new AsgardeoAPIError(
      'Invalid endpoint URL provided',
      'getSchemas-ValidationError-001',
      'javascript',
      400,
      'Invalid Request',
    );
  }

  const response = await httpClient({
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  } as HttpRequestConfig);

  if (!response.data) {
    throw new AsgardeoAPIError(
      `Failed to fetch SCIM2 schemas`,
      'getSchemas-ResponseError-001',
      'javascript',
      response.status,
      response.statusText,
    );
  }

  return response.data;
};

export default getSchemas;
