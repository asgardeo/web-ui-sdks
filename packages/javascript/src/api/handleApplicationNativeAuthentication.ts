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

import AsgardeoAPIError from '../errors/AsgardeoAPIError';
import {
  ApplicationNativeAuthenticationHandleRequestPayload,
  ApplicationNativeAuthenticationHandleResponse,
} from '../models/application-native-authentication';

/**
 * Request configuration for the authorize function.
 */
export interface AuthorizeRequestConfig extends Partial<Request> {
  /**
   * The authorization endpoint URL.
   */
  url: string;
  /**
   * The authorization request payload.
   */
  payload: ApplicationNativeAuthenticationHandleRequestPayload;
}

const handleApplicationNativeAuthentication = async ({
  url,
  payload,
  ...requestConfig
}: AuthorizeRequestConfig): Promise<ApplicationNativeAuthenticationHandleResponse> => {
  try {
    new URL(url);
  } catch (error) {
    throw new AsgardeoAPIError(
      'Invalid endpoint URL provided',
      'handleApplicationNativeAuthentication-ValidationError-001',
      'javascript',
      400,
      'Invalid Request',
    );
  }

  if (!payload) {
    throw new AsgardeoAPIError(
      'Authorization payload is required',
      'handleApplicationNativeAuthentication-ValidationError-002',
      'javascript',
      400,
      'Invalid Request',
    );
  }

  const {headers: customHeaders, ...otherConfig} = requestConfig;
  const response: Response = await fetch(url, {
    method: requestConfig.method || 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      ...customHeaders,
    },
    body: payload,
    ...otherConfig,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new AsgardeoAPIError(
      `Authorization request failed: ${errorText}`,
      'initializeApplicationNativeAuthentication-ResponseError-001',
      'javascript',
      response.status,
      response.statusText,
    );
  }

  return (await response.json()) as ApplicationNativeAuthenticationHandleResponse;
};

export default handleApplicationNativeAuthentication;
