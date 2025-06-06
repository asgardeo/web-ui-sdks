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

import {User, AsgardeoAPIError, HttpInstance, AsgardeoSPAClient, HttpRequestConfig} from '@asgardeo/browser';

const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Updates the user profile information at the specified SCIM2 Me endpoint.
 *
 * @param url - The SCIM2 Me endpoint URL.
 * @param value - The value object to patch (SCIM2 PATCH value).
 * @param requestConfig - Additional request config if needed.
 * @returns A promise that resolves with the updated user profile information.
 * @example
 * ```typescript
 * await updateMeProfile({
 *   url: "https://api.asgardeo.io/t/<ORG>/scim2/Me",
 *   value: { "urn:scim:wso2:schema": { mobileNumbers: ["0777933830"] } }
 * });
 * ```
 */
const updateMeProfile = async ({
  url,
  payload,
  ...requestConfig
}: {url: string; payload: any} & Partial<Request>): Promise<User> => {
  try {
    new URL(url);
  } catch (error) {
    throw new AsgardeoAPIError(
      'Invalid endpoint URL provided',
      'updateMeProfile-ValidationError-001',
      'javascript',
      400,
      'Invalid Request',
    );
  }

  const data = {
    Operations: [
      {
        op: 'replace',
        value: payload,
      },
    ],
    schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
  };

  const response: any = await httpClient({
    url,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/scim+json',
      Accept: 'application/json',
    },
    data,
    ...requestConfig,
  } as HttpRequestConfig);

  if (!response.data) {
    const errorText = await response.text();

    throw new AsgardeoAPIError(
      `Failed to update user profile: ${errorText}`,
      'updateMeProfile-ResponseError-001',
      'javascript',
      response.status,
      response.statusText,
    );
  }

  return response.data;
};

export default updateMeProfile;
