import {EmbeddedFlowExecuteResponse} from './../models/embedded-flows';
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
import {EmbeddedFlowType} from '../models/embedded-flows';

/**
 * Represents the embedded signup flow execution request payload.
 */
export interface EmbeddedSignUpFlowExecuteRequestPayload {
  /**
   * The type of flow to execute.
   */
  flowType: EmbeddedFlowType;
}

/**
 * Request configuration for the embedded signup flow execution function.
 */
export interface EmbeddedSignUpFlowExecuteRequestConfig extends Partial<Request> {
  url?: string;
  /**
   * The base URL of the Asgardeo server.
   */
  baseUrl?: string;
  /**
   * The embedded signup flow execution request payload.
   */
  payload: EmbeddedSignUpFlowExecuteRequestPayload;
}

/**
 * Executes an embedded signup flow by sending a request to the specified flow execution endpoint.
 *
 * @param requestConfig - Request configuration object containing URL and payload.
 * @returns A promise that resolves with the flow execution response.
 * @throws AsgardeoAPIError when the request fails or URL is invalid.
 *
 * @example
 * ```typescript
 * try {
 *   const embeddedSignUpResponse = await executeEmbeddedSignUpFlow({
 *     url: "https://api.asgardeo.io/t/<ORGANIZATION>/api/server/v1/flow/execute",
 *     payload: {
 *       flowType: "REGISTRATION"
 *     }
 *   });
 *   console.log(embeddedSignUpResponse);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Embedded SignUp flow execution failed:', error.message);
 *   }
 * }
 * ```
 */
const executeEmbeddedSignUpFlow = async ({
  url,
  baseUrl,
  payload,
  ...requestConfig
}: EmbeddedSignUpFlowExecuteRequestConfig): Promise<EmbeddedFlowExecuteResponse> => {
  if (!payload) {
    throw new AsgardeoAPIError(
      'Embedded SignUp flow payload is required',
      'javascript-executeEmbeddedSignUpFlow-ValidationError-001',
      'javascript',
      400,
      'If an embedded signup flow payload is not provided, the request cannot be constructed correctly.',
    );
  }

  if (!payload.flowType || payload.flowType !== 'REGISTRATION') {
    throw new AsgardeoAPIError(
      'Invalid flowType. Must be "REGISTRATION"',
      'javascript-executeEmbeddedSignUpFlow-ValidationError-002',
      'javascript',
      400,
      'The flowType must be set to "REGISTRATION" for embedded signup flows.',
    );
  }

  const {headers: customHeaders, ...otherConfig} = requestConfig;
  const response: Response = await fetch(url ?? `${baseUrl}/api/server/v1/flow/execute`, {
    method: requestConfig.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    },
    body: JSON.stringify(payload),
    ...otherConfig,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new AsgardeoAPIError(
      `Embedded SignUp flow execution failed: ${errorText}`,
      'javascript-executeEmbeddedSignUpFlow-ResponseError-100',
      'javascript',
      response.status,
      response.statusText,
    );
  }

  return (await response.json()) as EmbeddedFlowExecuteResponse;
};

export default executeEmbeddedSignUpFlow;
