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
import SessionManager from '../../utils/SessionManager';

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
        signInUrl?: string;
      }
    | EmbeddedSignInFlowInitiateResponse;
  error?: string;
}> => {
  try {
    const client = AsgardeoNextClient.getInstance();
    const cookieStore = await cookies();

    let sessionId: string | undefined;
    let userId: string | undefined;

    const existingSessionToken = cookieStore.get(SessionManager.getSessionCookieName())?.value;

    if (existingSessionToken) {
      try {
        const sessionPayload = await SessionManager.verifySessionToken(existingSessionToken);
        sessionId = sessionPayload.sessionId;
        userId = sessionPayload.sub;
      } catch {
        // Invalid session token, will create new temp session
      }
    }

    if (!sessionId) {
      const tempSessionToken = cookieStore.get(SessionManager.getTempSessionCookieName())?.value;

      if (tempSessionToken) {
        try {
          const tempSession = await SessionManager.verifyTempSession(tempSessionToken);
          sessionId = tempSession.sessionId;
        } catch {
          // Invalid temp session, will create new one
        }
      }
    }

    if (!sessionId) {
      sessionId = generateSessionId();

      const tempSessionToken = await SessionManager.createTempSession(sessionId);

      cookieStore.set(
        SessionManager.getTempSessionCookieName(),
        tempSessionToken,
        SessionManager.getTempSessionCookieOptions(),
      );
    }

    // If no payload provided, redirect to sign-in URL for redirect-based sign-in.
    if (!payload) {
      const defaultSignInUrl = await client.getAuthorizeRequestUrl({}, sessionId);
      return {success: true, data: {signInUrl: String(defaultSignInUrl)}};
    }

    // Handle embedded sign-in flow
    const response: any = await client.signIn(payload, request!, sessionId);

    if (response.flowStatus === EmbeddedSignInFlowStatus.SuccessCompleted) {
      const signInResult = await client.signIn(
        {
          code: response?.authData?.code,
          session_state: response?.authData?.session_state,
          state: response?.authData?.state,
        } as any,
        {},
        sessionId,
      );

      if (signInResult) {
        const idToken = await client.getDecodedIdToken(sessionId);
        const userIdFromToken = idToken['sub'] || signInResult['sub'] || sessionId;
        const accessToken = signInResult['accessToken'];
        const scopes = signInResult['scope'];
        const organizationId = idToken['user_org'] || idToken['organization_id'];

        const sessionToken = await SessionManager.createSessionToken(
          accessToken,
          userIdFromToken,
          sessionId as string,
          scopes,
          organizationId,
        );

        cookieStore.set(SessionManager.getSessionCookieName(), sessionToken, SessionManager.getSessionCookieOptions());

        cookieStore.delete(SessionManager.getTempSessionCookieName());
      }

      const afterSignInUrl = await (await client.getStorageManager()).getConfigDataParameter('afterSignInUrl');
      return {success: true, data: {afterSignInUrl: String(afterSignInUrl)}};
    }

    return {success: true, data: response as EmbeddedSignInFlowInitiateResponse};
  } catch (error) {
    console.error('[signInAction] Error during sign-in:', error);
    return {success: false, error: String(error)};
  }
};

export default signInAction;
