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

'use server';

import {
  EmbeddedFlowExecuteRequestConfig,
  EmbeddedFlowExecuteRequestPayload,
  EmbeddedFlowExecuteResponse,
  EmbeddedFlowStatus,
} from '@asgardeo/node';
import AsgardeoNextClient from '../../AsgardeoNextClient';

/**
 * Server action for signing in a user.
 * Handles the embedded sign-in flow and manages session cookies.
 *
 * @param payload - The embedded sign-in flow payload
 * @param request - The embedded flow execute request config
 * @returns Promise that resolves when sign-in is complete
 */
const signUpAction = async (
  payload?: EmbeddedFlowExecuteRequestPayload,
  request?: EmbeddedFlowExecuteRequestConfig,
): Promise<{
  success: boolean;
  data?:
    | {
        afterSignUpUrl?: string;
        signUpUrl?: string;
      }
    | EmbeddedFlowExecuteResponse;
  error?: string;
}> => {
  try {
    const client = AsgardeoNextClient.getInstance();

    // If no payload provided, redirect to sign-in URL for redirect-based sign-in.
    // If there's a payload, handle the embedded sign-in flow.
    if (!payload) {
      const defaultSignUpUrl = '';

      return {success: true, data: {signUpUrl: String(defaultSignUpUrl)}};
    } else {
      const response: any = await client.signUp(payload);

      if (response.flowStatus === EmbeddedFlowStatus.Complete) {
        const afterSignUpUrl = await (await client.getStorageManager()).getConfigDataParameter('afterSignInUrl');

        return {success: true, data: {afterSignUpUrl: String(afterSignUpUrl)}};
      }

      return {success: true, data: response as EmbeddedFlowExecuteResponse};
    }
  } catch (error) {
    return {success: false, error: String(error)};
  }
};

export default signUpAction;
