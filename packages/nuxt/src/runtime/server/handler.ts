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
import {AsgardeoNodeClient, type AuthClientConfig, type StorageManager, type TokenResponse} from '@asgardeo/node';
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
  const defaultBase: any = {
    httpOnly: true,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };
  return {...defaultBase, ...base, ...specific};
}

export const AsgardeoAuthHandler = (config: AuthClientConfig, options?: AsgardeoAuthHandlerOptions): any => {
  const defaultCookieOptsFromUser: CookieSerializeOptions = options?.cookies?.defaultOptions ?? {};

  const sessionIdCookieName: string = options?.cookies?.sessionId ?? 'ASGARDEO_SESSION_ID';
  const sessionIdCookieOptions: CookieSerializeOptions = mergeCookieOptions(
    {
      // Base defaults (already includes secure, httpOnly, path, sameSite)
      maxAge: 900000 / 1000, // Default session length (15 minutes)
    },
    {...defaultCookieOptsFromUser, ...options?.cookies?.sessionIdOptions},
  );

  // --- Event Handler Definition ---
  return defineEventHandler(async (event: H3Event) => {
    const action: string | undefined = event.context.params?._;
    const {method}: {method?: string | undefined} = event.node.req;

    const authClient: AsgardeoNodeClient<any> = getAsgardeoSdkInstance(config);

    if (action === 'signin' && method === 'GET') {
      try {
        const sessionId: `${string}-${string}-${string}-${string}-${string}` = randomUUID();

        setCookie(event, sessionIdCookieName, sessionId, sessionIdCookieOptions);

        await authClient.signIn(
          (authorizationUrl: string) => {
            sendRedirect(event, authorizationUrl, 302);
          },
          sessionId,
          getQuery(event).code?.toString(),
          getQuery(event).session_state?.toString(),
          getQuery(event).state?.toString(),
          {},
        );
        return null;
      } catch (error: any) {
        throw createError({
          data: error.message,
          statusCode: 500,
          statusMessage: 'Failed to initiate sign in',
        });
      }
    } else if (action === 'callback' && method === 'GET') {
      const sessionId: string | undefined = getCookie(event, sessionIdCookieName);
      if (!sessionId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Authentication callback error: Session ID missing.',
        });
      }

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const {code, session_state, state, error, error_description} = getQuery(event);

      if (!code) {
        if (error) {
          throw createError({
            statusCode: 400,
            statusMessage: `Authentication failed: ${error_description ?? error}`,
          });
        }
        throw createError({
          statusCode: 400,
          statusMessage: 'Authorization code missing in callback.',
        });
      }

      try {
        const tokenResponse: TokenResponse = await authClient.signIn(
          () => {}, // no-op redirect callback
          sessionId,
          code.toString(),
          session_state?.toString() ?? '',
          state?.toString() ?? '',
        );

        if (!tokenResponse?.accessToken && !tokenResponse?.idToken) {
          throw createError({
            statusCode: 500,
            statusMessage: 'Token exchange failed: Invalid response from Identity Provider.',
          });
        }

        // successful sign-in → redirect out
        return await sendRedirect(event, options?.defaultCallbackUrl ?? '/', 302);
      } catch (err: any) {
        throw createError({
          data: err.message ?? 'An unexpected error occurred during token exchange',
          statusCode: 500,
          statusMessage: 'Token exchange failed.',
        });
      }
    } else if (action === 'user' && method === 'GET') {
      const sessionId: string | undefined = getCookie(event, sessionIdCookieName);
      if (!sessionId) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized: No active session found.',
        });
      }

      try {
        return await authClient.getUser(sessionId);
      } catch {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to retrieve user information.',
        });
      }
    } else if (action === 'isSignedIn' && method === 'GET') {
      const sessionId: string | undefined = getCookie(event, sessionIdCookieName);
      if (!sessionId) return false;

      try {
        return await authClient.isSignedIn(sessionId);
      } catch {
        return false;
      }
    } else if (action === 'get-id-token' && method === 'GET') {
      const sessionId: string | undefined = getCookie(event, sessionIdCookieName);
      if (!sessionId) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized: No active session found.',
        });
      }

      try {
        const idToken: string = await authClient.getIDToken(sessionId);
        return {idToken};
      } catch {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to retrieve ID token.',
        });
      }
    } else if (action === 'get-access-token' && method === 'GET') {
      const sessionId: string | undefined = getCookie(event, sessionIdCookieName);
      if (!sessionId) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized: No active session found.',
        });
      }

      try {
        const accessToken: string = await authClient.getAccessToken(sessionId);
        return {accessToken};
      } catch {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to retrieve access token.',
        });
      }
    } else if (action === 'get-decoded-id-token' && method === 'GET') {
      const sessionId: string | undefined = getCookie(event, sessionIdCookieName);
      if (!sessionId) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized: No active session found.',
        });
      }

      try {
        return await authClient.getDecodedIDToken(sessionId);
      } catch {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to retrieve decoded ID token.',
        });
      }
    } else if (action === 'revoke-token' && method === 'POST') {
      const sessionId: string | undefined = getCookie(event, sessionIdCookieName);
      if (!sessionId) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized: No active session found.',
        });
      }

      try {
        return await authClient.revokeAccessToken(sessionId);
      } catch {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to revoke tokens.',
        });
      }
    } else if (action === 'get-oidc-endpoints' && method === 'GET') {
      try {
        return await authClient.getOpenIDProviderEndpoints();
      } catch {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to retrieve OIDC service endpoints.',
        });
      }
    } else if (action === 'signout' && method === 'GET') {
      const sessionId: string | undefined = getCookie(event, sessionIdCookieName);

      if (!sessionId) {
        // No active session, just redirect to home or a logged-out page
        return sendRedirect(event, options?.defaultCallbackUrl ?? '/', 302);
      }

      try {
        const signOutURL: string = await authClient.signOut(sessionId);

        deleteCookie(event, sessionIdCookieName, sessionIdCookieOptions);

        if (!signOutURL) {
          return await sendRedirect(event, '/?error=signout_url_missing', 302);
        }

        return await sendRedirect(event, signOutURL, 302);
      } catch (error: any) {
        deleteCookie(event, sessionIdCookieName, sessionIdCookieOptions);
        throw createError({
          data: error.message || 'An unexpected error occurred during sign out',
          statusCode: 500,
          statusMessage: 'Sign out failed.',
        });
      }
    } else if (action === 'get-data-layer' && method === 'GET') {
      try {
        const dataLayer: StorageManager<any> = await authClient.getStorageManager();
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
