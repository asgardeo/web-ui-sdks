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

import {cookies} from 'next/headers';
import {
  CookieConfig,
  generateSessionId,
  EmbeddedSignInFlowStatus,
  EmbeddedSignInFlowHandleRequestPayload,
  EmbeddedFlowExecuteRequestConfig,
  EmbeddedSignInFlowInitiateResponse,
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
const signInAction = async (
  payload?: EmbeddedSignInFlowHandleRequestPayload,
  request?: EmbeddedFlowExecuteRequestConfig,
): Promise<{
  success: boolean;
  data?:
    | {
        afterSignInUrl?: string;
      }
    | EmbeddedSignInFlowInitiateResponse;
  error?: string;
}> => {
  try {
    const client = AsgardeoNextClient.getInstance();
    const cookieStore = await cookies();

    let userId: string | undefined = cookieStore.get(CookieConfig.SESSION_COOKIE_NAME)?.value;

    if (!userId) {
      userId = generateSessionId();
      cookieStore.set(CookieConfig.SESSION_COOKIE_NAME, userId, {
        httpOnly: CookieConfig.DEFAULT_HTTP_ONLY,
        maxAge: CookieConfig.DEFAULT_MAX_AGE,
        sameSite: CookieConfig.DEFAULT_SAME_SITE,
        secure: CookieConfig.DEFAULT_SECURE,
      });
    }

    // If no payload provided, redirect to sign-in URL for redirect-based sign-in.
    // If there's a payload, handle the embedded sign-in flow.
    if (!payload) {
      const defaultSignInUrl = await client.getAuthorizeRequestUrl({}, userId);

      return {success: true, data: {afterSignInUrl: String(defaultSignInUrl)}};
    } else {
      const response: any = await client.signIn(payload, request!, userId);

      if (response.flowStatus === EmbeddedSignInFlowStatus.SuccessCompleted) {
        // Complete the sign-in process
        await client.signIn(
          {
            code: response?.authData?.code,
            session_state: response?.authData?.session_state,
            state: response?.authData?.state,
          } as any,
          {},
          userId,
        );

        const afterSignInUrl = await (await client.getStorageManager()).getConfigDataParameter('afterSignInUrl');

        return {success: true, data: {afterSignInUrl: String(afterSignInUrl)}};
      }

      return {success: true, data: response as EmbeddedSignInFlowInitiateResponse};
    }
  } catch (error) {
    return {success: false, error: String(error)};
  }
};

export default signInAction;
