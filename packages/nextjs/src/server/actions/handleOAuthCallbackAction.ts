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
import AsgardeoNextClient from '../../AsgardeoNextClient';
import SessionManager from '../../utils/SessionManager';

/**
 * Server action to handle OAuth callback with authorization code.
 * This action processes the authorization code received from the OAuth provider
 * and exchanges it for tokens to complete the authentication flow.
 *
 * @param code - Authorization code from OAuth provider
 * @param state - State parameter from OAuth provider for CSRF protection
 * @param sessionState - Session state parameter from OAuth provider
 * @returns Promise that resolves with success status and optional error message
 */
const handleOAuthCallbackAction = async (
  code: string,
  state: string,
  sessionState?: string,
): Promise<{
  success: boolean;
  error?: string;
  redirectUrl?: string;
}> => {
  try {
    if (!code || !state) {
      return {
        success: false,
        error: 'Missing required OAuth parameters: code and state are required',
      };
    }

    const asgardeoClient = AsgardeoNextClient.getInstance();

    if (!asgardeoClient.isInitialized) {
      return {
        success: false,
        error: 'Asgardeo client is not initialized',
      };
    }

    const cookieStore = await cookies();
    let sessionId: string | undefined;

    const tempSessionToken = cookieStore.get(SessionManager.getTempSessionCookieName())?.value;

    if (tempSessionToken) {
      try {
        const tempSession = await SessionManager.verifyTempSession(tempSessionToken);
        sessionId = tempSession.sessionId;
      } catch {
        // TODO: Invalid temp session, throw error.
      }
    }

    if (!sessionId) {
      return {
        success: false,
        error: 'No session found. Please start the authentication flow again.',
      };
    }

    // Exchange the authorization code for tokens
    const signInResult = await asgardeoClient.signIn(
      {
        code,
        session_state: sessionState,
        state,
      } as any,
      {},
      sessionId,
    );

    if (signInResult) {
      try {
        const idToken = await asgardeoClient.getDecodedIdToken(sessionId);
        const userIdFromToken = idToken.sub || signInResult['sub'] || sessionId;
        const scopes = idToken['scope'] ? idToken['scope'].split(' ') : [];
        const organizationId = idToken['user_org'] || idToken['organization_id'];

        const sessionToken = await SessionManager.createSessionToken(
          userIdFromToken,
          sessionId,
          scopes,
          organizationId,
        );

        cookieStore.set(SessionManager.getSessionCookieName(), sessionToken, SessionManager.getSessionCookieOptions());

        cookieStore.delete(SessionManager.getTempSessionCookieName());
      } catch (error) {
        console.warn(
          '[handleOAuthCallbackAction] Failed to create JWT session, continuing with legacy session:',
          error,
        );
      }
    }

    const config = await asgardeoClient.getConfiguration();
    const afterSignInUrl = config.afterSignInUrl || '/';

    return {
      success: true,
      redirectUrl: afterSignInUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
};

export default handleOAuthCallbackAction;
