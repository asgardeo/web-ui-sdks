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

import {randomUUID} from 'node:crypto';
import {
  type DataLayer,
  type BasicUserInfo,
  type DecodedIDTokenPayload,
  type OIDCEndpoints,
  type TokenResponse,
} from '@asgardeo/auth-node';
import type {CookieSerializeOptions} from 'cookie-es';
import {defineEventHandler, sendRedirect, setCookie, deleteCookie, getQuery, getCookie, createError, H3Event} from 'h3';
import {getAsgardeoSdkInstance} from './services/asgardeo/index';

export interface AsgardeoAuthHandlerOptions {
  basePath?: string;
  cookies?: {
    defaultOptions?: CookieSerializeOptions;
    sessionId?: string;
    sessionIdOptions?: CookieSerializeOptions;
    state?: string;
    stateOptions?: CookieSerializeOptions;
  };
  defaultCallbackUrl?: string;
}

function mergeCookieOptions(
  base: CookieSerializeOptions | undefined,
  specific: CookieSerializeOptions | undefined,
): CookieSerializeOptions {
  const defaultBase = {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };
  return {...defaultBase, ...base, ...specific};
}

export const AsgardeoAuthHandler = (options?: AsgardeoAuthHandlerOptions) => {
  const defaultCookieOptsFromUser = options?.cookies?.defaultOptions ?? {};

  const sessionIdCookieName = options?.cookies?.sessionId ?? 'ASGARDEO_SESSION_ID';
  const sessionIdCookieOptions = mergeCookieOptions(
    {
      // Base defaults (already includes secure, httpOnly, path, sameSite)
      maxAge: 900000 / 1000, // Default session length (15 minutes)
    },
    {...defaultCookieOptsFromUser, ...options?.cookies?.sessionIdOptions},
  );

  // --- Event Handler Definition ---
  return defineEventHandler(async (event: H3Event) => {
    const action = event.context.params?._;
    const method = event.node.req.method;

    // --- Get SDK Instance ---
    const authClient = getAsgardeoSdkInstance();
    if (!authClient) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Authentication SDK not configured.',
      });
    }

    // --- Sign-in Handler ---
    if (action === 'signin' && method === 'GET') {
      try {
        const sessionId = randomUUID();

        setCookie(event, sessionIdCookieName, sessionId, sessionIdCookieOptions);

        // The SDK's signIn method expects a callback to perform the redirect
        await authClient.signIn(
          authorizationUrl => {
            sendRedirect(event, authorizationUrl, 302);
          },
          sessionId,
          // Pass optional query params if needed by SDK for specific flows
          getQuery(event).code?.toString(),
          getQuery(event).session_state?.toString(),
          getQuery(event).state?.toString(),
        );
        return;
      } catch (error: any) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to initiate sign in',
          data: error.message,
        });
      }
    } // --- Callback Handler ---
    else if (action === 'callback' && method === 'GET') {
      const sessionId = getCookie(event, sessionIdCookieName);
      if (!sessionId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Authentication callback error: Session ID missing.',
        });
      }

      const query = getQuery(event);
      const authorizationCode: string | undefined = query.code?.toString();
      const sessionState = query.session_state?.toString() ?? '';
      const stateReceived = query.state?.toString() ?? '';

      if (!authorizationCode) {
        if (query.error) {
          throw createError({
            statusCode: 400,
            statusMessage: `Authentication failed: ${query.error_description || query.error}`,
          });
        }
        throw createError({
          statusCode: 400,
          statusMessage: 'Authorization code missing in callback.',
        });
      }

      try {
        // Dummy callback, as signIn here should return tokens, not redirect.
        const dummyRedirectCallback = (): void => {};

        const tokenResponse: TokenResponse = await authClient.signIn(
          dummyRedirectCallback,
          sessionId,
          authorizationCode,
          sessionState,
          stateReceived,
        );
        // Validate token response (adjust based on actual SDK response structure)
        if (!tokenResponse || (!tokenResponse.accessToken && !tokenResponse.idToken)) {
          throw createError({
            statusCode: 500,
            statusMessage: 'Token exchange failed: Invalid response from Identity Provider.',
          });
        }

        // TODO: Use the actual intended callback URL instead of hardcoding '/'
        // This could be stored in the state parameter during signIn or retrieved
        // from the session associated with sessionId if stored there earlier.
        const redirectUrl: string = options?.defaultCallbackUrl ?? '/';
        await sendRedirect(event, redirectUrl, 302);
        return; // Important to return after sendRedirect
      } catch (error: any) {
        // Clear the potentially invalid session cookie on token exchange failure? Optional.
        // deleteCookie(event, sessionIdCookieName, sessionIdCookieOptions);
        throw createError({
          statusCode: 500,
          statusMessage: 'Token exchange failed',
          data: error.message || 'An unexpected error occurred during token exchange',
        });
      }
    } else if (action === 'user' && method === 'GET') {
      // 1. Retrieve the Session ID from the cookie
      const sessionId = getCookie(event, sessionIdCookieName);
      // 2. Validate if the Session ID exists
      if (!sessionId) {
        // If no session ID, the user is not authenticated
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized: No active session found.',
        });
      }
      try {
        // 3. Fetch basic user information using the Session ID
        const basicUserInfo: BasicUserInfo = await authClient.getBasicUserInfo(sessionId);
        // 4. Return the fetched information
        return basicUserInfo;
      } catch (error: any) {
        {
          throw createError({
            statusCode: 500,
            statusMessage: 'Failed to retrieve user information.',
          });
        }
      }
    } else if (action === 'isAuthenticated' && method === 'GET') {
      // 1. Retrieve the Session ID from the cookie
      const sessionId = getCookie(event, sessionIdCookieName);
      // 2. Validate if the Session ID exists
      if (!sessionId) {
        // If no session ID, the user is not authenticated
        return false;
      }
      try {
        // 3. Check if the session is authenticated
        const isAuth: boolean = await authClient.isAuthenticated(sessionId);
        // 4. Return the authentication status
        return isAuth;
      } catch (error: any) {
        console.error(`isAuthenticated check failed (Session: ${sessionId}):`, error);
        return false;
      }
    } else if (action === 'get-id-token' && method === 'GET') {
      // 1. Retrieve the Session ID from the cookie
      const sessionId = getCookie(event, sessionIdCookieName);
      // 2. Validate if the Session ID exists
      if (!sessionId) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized: No active session found.',
        });
      }
      try {
        // 3. Fetch the ID Token using the Session ID
        console.log(`Attempting to get ID token for session: ${sessionId}`);
        const idToken: string = await authClient.getIDToken(sessionId);
        // 4. Return the fetched ID token
        return {idToken};
      } catch (error: any) {
        console.error(`getIDTokenForSession Error (Session: ${sessionId}):`, error);
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to retrieve ID token for the session.',
        });
      }
    } else if (action === 'get-access-token' && method === 'GET') {
      // 1. Retrieve the Session ID from the cookie
      const sessionId = getCookie(event, sessionIdCookieName); // Assuming getCookie and sessionIdCookieName are defined

      // 2. Validate if the Session ID exists
      if (!sessionId) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized: No active session found.',
        });
      }

      try {
        // 3. Fetch the Access Token using the Session ID
        console.log(`Attempting to get Access token for session: ${sessionId}`);

        const accessToken: string = await authClient.getAccessToken(sessionId);

        // 4. Return the fetched access token
        return {accessToken};
      } catch (error: any) {
        console.error(`getAccessTokenForSession Error (Session: ${sessionId}):`, error);

        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to retrieve Access token for the session.', // Updated error message
        });
      }
    } else if (action === 'get-decoded-id-token' && method === 'GET') {
      // Step 1: Retrieve the Session ID from the cookie
      const sessionId = getCookie(event, sessionIdCookieName);

      // Step 2: Validate if the Session ID exists
      if (!sessionId) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized: No active session found.',
        });
      }

      try {
        // Step 3: Fetch the decoded ID Token using the Session ID
        console.log(`Attempting to get decoded ID token for session: ${sessionId}`);
        const decodedIDToken: DecodedIDTokenPayload = await authClient.getDecodedIDToken(sessionId);

        // Step 4: Return the decoded ID token payload
        return {
          decodedIDToken,
        };
      } catch (error: any) {
        console.error(`Error retrieving decoded ID token (Session: ${sessionId}):`, error);

        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to retrieve decoded ID token for the session.',
        });
      }
    } else if (action === 'revoke-token' && method === 'POST') {
      // 1. Retrieve the Session ID from the cookie
      const sessionId = getCookie(event, sessionIdCookieName);

      // 2. Validate if the Session ID exists
      if (!sessionId) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized: No active session found.',
        });
      }
      try {
        // 3. Revoke tokens associated with the Session ID
        console.log(`Attempting to revoke tokens for session: ${sessionId}`);
        const result = await authClient.revokeAccessToken(sessionId);
        console.log('123', result);
        // 4. Return a success response
        return {result};
      } catch (error: any) {
        console.error(`revokeTokensForSession Error (Session: ${sessionId}):`, error);
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to revoke tokens for the session.',
        });
      }
    } else if (action === 'signout' && method === 'GET') {
      const sessionId = getCookie(event, sessionIdCookieName);

      if (!sessionId) {
        // No active session, just redirect to home or a logged-out page
        return sendRedirect(event, options?.defaultCallbackUrl ?? '/', 302);
      }

      try {
        const signOutURL = await authClient.signOut(sessionId);

        // 2. Delete the local session cookie regardless of SDK success/failure
        deleteCookie(event, sessionIdCookieName, sessionIdCookieOptions);

        // 3. Redirect to the Identity Provider's sign out URL
        if (!signOutURL) {
          console.error('Sign out failed: Could not retrieve sign out URL from SDK.');
          return sendRedirect(event, '/?error=signout_url_missing', 302);
        }

        return sendRedirect(event, signOutURL, 302);
      } catch (error: any) {
        deleteCookie(event, sessionIdCookieName, sessionIdCookieOptions);
        console.error('Sign out failed:', error);
        throw createError({
          statusCode: 500,
          statusMessage: 'Sign out failed.',
          data: error.message || 'An unexpected error occurred during sign out',
        });
      }
    } else if (action === 'get-oidc-endpoints' && method === 'GET') {
      try {
        // Log the attempt
        console.log(`Attempting to get OIDC service endpoints.`);

        // Call the method on your authClient instance
        // *** Assumption: authClient has getOIDCServiceEndpoints() method ***
        const endpoints: OIDCEndpoints = await authClient.getOIDCServiceEndpoints();

        // Return the fetched endpoints object directly.
        // The framework (e.g., Nitro/h3) usually handles JSON serialization.
        return endpoints;
      } catch (error: any) {
        // Log the specific error for server-side debugging
        console.error(`getOIDCServiceEndpoints Error:`, error);

        // Throw a generic server error for the client
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to retrieve OIDC service endpoints.', // Updated error message
        });
      }
    } else if (action === 'get-data-layer' && method === 'GET') {
      try {
        const dataLayer: DataLayer<any> = await authClient.getDataLayer();
        return dataLayer;
      } catch (error: any) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to retrieve Data Layer.',
        });
      }
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: `Authentication endpoint not found or method not allowed for action: ${action}`,
      });
    }
  });
};
