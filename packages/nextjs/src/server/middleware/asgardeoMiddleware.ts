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

import {NextRequest, NextResponse} from 'next/server';
import {CookieConfig} from '@asgardeo/node';
import {AsgardeoNextConfig} from '../../models/config';
import SessionManager, {SessionTokenPayload} from '../../utils/SessionManager';
import {
  hasValidSession as hasValidJWTSession,
  getSessionFromRequest,
  getSessionIdFromRequest,
} from '../../utils/sessionUtils';

export type AsgardeoMiddlewareOptions = Partial<AsgardeoNextConfig>;

export type AsgardeoMiddlewareContext = {
  /**
   * Protect a route by redirecting unauthenticated users.
   * Redirect URL fallback order:
   * 1. options.redirect
   * 2. resolvedOptions.signInUrl
   * 3. resolvedOptions.defaultRedirect
   * 4. referer (if from same origin)
   * If none are available, throws an error.
   */
  protectRoute: (options?: {redirect?: string}) => Promise<NextResponse | void>;
  /** Check if the current request has a valid Asgardeo session */
  isSignedIn: () => boolean;
  /** Get the session ID from the current request */
  getSessionId: () => string | undefined;
  /** Get the session payload from JWT session if available */
  getSession: () => Promise<SessionTokenPayload | undefined>;
};

type AsgardeoMiddlewareHandler = (
  asgardeo: AsgardeoMiddlewareContext,
  req: NextRequest,
) => Promise<NextResponse | void> | NextResponse | void;

/**
 * Enhanced session validation that checks both JWT and legacy sessions
 *
 * @param request - The Next.js request object
 * @returns True if a valid session exists, false otherwise
 */
const hasValidSession = async (request: NextRequest): Promise<boolean> => {
  try {
    return await hasValidJWTSession(request);
  } catch {
    return Promise.resolve(false);
  }
};

/**
 * Gets the session ID from the request cookies.
 * Supports both JWT and legacy session formats.
 *
 * @param request - The Next.js request object
 * @returns The session ID if it exists, undefined otherwise
 */
const getSessionIdFromRequestMiddleware = async (request: NextRequest): Promise<string | undefined> => {
  return await getSessionIdFromRequest(request);
};

/**
 * Asgardeo middleware that integrates authentication into your Next.js application.
 * Similar to Clerk's clerkMiddleware pattern.
 *
 * @param handler - Optional handler function to customize middleware behavior
 * @param options - Configuration options for the middleware
 * @returns Next.js middleware function
 *
 * @example
 * ```typescript
 * // middleware.ts - Basic usage
 * import { asgardeoMiddleware } from '@asgardeo/nextjs';
 *
 * export default asgardeoMiddleware();
 * ```
 *
 * @example
 * ```typescript
 * // With route protection
 * import { asgardeoMiddleware, createRouteMatcher } from '@asgardeo/nextjs';
 *
 * const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
 *
 * export default asgardeoMiddleware(async (asgardeo, req) => {
 *   if (isProtectedRoute(req)) {
 *     await asgardeo.protectRoute();
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Advanced usage with custom logic
 * import { asgardeoMiddleware, createRouteMatcher } from '@asgardeo/nextjs';
 *
 * const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
 * const isAuthRoute = createRouteMatcher(['/sign-in', '/sign-up']);
 *
 * export default asgardeoMiddleware(async (asgardeo, req) => {
 *   // Skip protection for auth routes
 *   if (isAuthRoute(req)) return;
 *
 *   // Protect specified routes
 *   if (isProtectedRoute(req)) {
 *     await asgardeo.protectRoute({ redirect: '/sign-in' });
 *   }
 *
 *   // Check authentication status
 *   if (asgardeo.isSignedIn()) {
 *     console.log('User is authenticated with session:', asgardeo.getSessionId());
 *   }
 * }, {
 *   defaultRedirect: '/sign-in'
 * });
 * ```
 */
const asgardeoMiddleware = (
  handler?: AsgardeoMiddlewareHandler,
  options?: AsgardeoMiddlewareOptions | ((req: NextRequest) => AsgardeoMiddlewareOptions),
): ((request: NextRequest) => Promise<NextResponse>) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    const resolvedOptions = typeof options === 'function' ? options(request) : options || {};

    const sessionId = await getSessionIdFromRequestMiddleware(request);
    const isAuthenticated = await hasValidSession(request);

    const asgardeo: AsgardeoMiddlewareContext = {
      protectRoute: async (options?: {redirect?: string}): Promise<NextResponse | void> => {
        if (!isAuthenticated) {
          const referer = request.headers.get('referer');
          // TODO: Make this configurable or call the signIn() from here.
          let fallbackRedirect: string = '/';

          // If referer exists and is from the same origin, use it as fallback
          if (referer) {
            try {
              const refererUrl = new URL(referer);
              const requestUrl = new URL(request.url);

              if (refererUrl.origin === requestUrl.origin) {
                fallbackRedirect = refererUrl.pathname + refererUrl.search;
              }
            } catch (error) {
              // Invalid referer URL, ignore it
            }
          }

          // Fallback chain: options.redirect -> resolvedOptions.signInUrl -> resolvedOptions.defaultRedirect -> referer (same origin only)
          const redirectUrl: string = (resolvedOptions?.signInUrl as string) || fallbackRedirect;

          const signInUrl = new URL(redirectUrl, request.url);

          return NextResponse.redirect(signInUrl);
        }

        // Session exists, allow access
        return;
      },
      isSignedIn: () => isAuthenticated,
      getSessionId: () => sessionId,
      getSession: async () => {
        try {
          return await getSessionFromRequest(request);
        } catch {
          return undefined;
        }
      },
    };

    if (handler) {
      const result = await handler(asgardeo, request);
      if (result) {
        return result;
      }
    }

    return NextResponse.next();
  };
};

export default asgardeoMiddleware;
