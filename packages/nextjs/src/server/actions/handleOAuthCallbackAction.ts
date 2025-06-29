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

import { cookies } from 'next/headers';
import { CookieConfig } from '@asgardeo/node';
import AsgardeoNextClient from '../../AsgardeoNextClient';

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
  sessionState?: string
): Promise<{
  success: boolean;
  error?: string;
  redirectUrl?: string;
}> => {
  try {
    if (!code || !state) {
      return {
        success: false,
        error: 'Missing required OAuth parameters: code and state are required'
      };
    }

    // Get the Asgardeo client instance
    const asgardeoClient = AsgardeoNextClient.getInstance();

    if (!asgardeoClient.isInitialized) {
      return {
        success: false,
        error: 'Asgardeo client is not initialized'
      };
    }

    // Get the session ID from cookies
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(CookieConfig.SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return {
        success: false,
        error: 'No session found. Please start the authentication flow again.'
      };
    }

    // Exchange the authorization code for tokens
    await asgardeoClient.signIn(
      {
        code,
        session_state: sessionState,
        state,
      } as any,
      {},
      sessionId
    );

    // Get the after sign-in URL from configuration
    const config = await asgardeoClient.getConfiguration();
    const afterSignInUrl = config.afterSignInUrl || '/';

    return {
      success: true,
      redirectUrl: afterSignInUrl
    };
  } catch (error) {
    console.error('[handleOAuthCallbackAction] OAuth callback error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
};

export default handleOAuthCallbackAction;
