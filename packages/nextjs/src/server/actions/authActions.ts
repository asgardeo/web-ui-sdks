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

import {redirect} from 'next/navigation';
import {cookies} from 'next/headers';
import {
  CookieConfig,
  generateSessionId,
  EmbeddedSignInFlowStatus,
  EmbeddedSignInFlowHandleRequestPayload,
  EmbeddedFlowExecuteRequestConfig,
} from '@asgardeo/node';
import AsgardeoNextClient from '../../AsgardeoNextClient';
import deleteSessionId from './deleteSessionId';

/**
 * Server action for signing in a user.
 * Handles the embedded sign-in flow and manages session cookies.
 *
 * @param payload - The embedded sign-in flow payload
 * @param request - The embedded flow execute request config
 * @returns Promise that resolves when sign-in is complete
 */
export async function signInAction(
  payload?: EmbeddedSignInFlowHandleRequestPayload,
  request?: EmbeddedFlowExecuteRequestConfig,
): Promise<{success: boolean; afterSignInUrl?: string; error?: string}> {
  console.log('[AsgardeoNextClient] signInAction called with payload:', payload);
  try {
    const client = AsgardeoNextClient.getInstance();
    const cookieStore = await cookies();

    // Get or generate session ID
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

    // If no payload provided, redirect to sign-in URL
    if (!payload) {
      const afterSignInUrl = await client.getSignInUrl(userId);

      return {success: true, afterSignInUrl: String(afterSignInUrl)};
    } else {
      // Handle embedded sign-in flow
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

        return {success: true, afterSignInUrl: String(afterSignInUrl)};
      }

      return {success: true};
    }
  } catch (error) {
    return {success: false, error: 'Sign-in failed'};
  }
}

/**
 * Server action to get the current user.
 * Returns the user profile if signed in.
 */
export async function getUserAction() {
  try {
    const client = AsgardeoNextClient.getInstance();
    const user = await client.getUser();
    return {user, error: null};
  } catch (error) {
    console.error('[AsgardeoNextClient] Failed to get user:', error);
    return {user: null, error: 'Failed to get user'};
  }
}

/**
 * Server action to check if user is signed in.
 */
export async function getIsSignedInAction() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(CookieConfig.SESSION_COOKIE_NAME)?.value;
    return {isSignedIn: !!sessionId, error: null};
  } catch (error) {
    console.error('[AsgardeoNextClient] Failed to check session:', error);
    return {isSignedIn: false, error: 'Failed to check session'};
  }
}
