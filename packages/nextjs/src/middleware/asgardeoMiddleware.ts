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
import AsgardeoNextClient from '../AsgardeoNextClient';
import {AsgardeoNextConfig} from '../models/config';

export interface AsgardeoMiddlewareOptions extends Partial<AsgardeoNextConfig> {
  debug?: boolean;
}

type AsgardeoAuth = {
  protect: (options?: {redirect?: string}) => Promise<NextResponse | void>;
  isSignedIn: () => Promise<boolean>;
  getUser: () => Promise<any | null>;
  redirectToSignIn: (afterSignInUrl?: string) => NextResponse;
};

type AsgardeoMiddlewareHandler = (
  auth: AsgardeoAuth,
  req: NextRequest,
) => Promise<NextResponse | void> | NextResponse | void;

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
 * // middleware.ts
 * import { asgardeoMiddleware } from '@asgardeo/nextjs';
 *
 * export default asgardeoMiddleware();
 * ```
 *
 * @example
 * ```typescript
 * // With protection
 * import { asgardeoMiddleware, createRouteMatcher } from '@asgardeo/nextjs';
 *
 * const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
 *
 * export default asgardeoMiddleware(async (auth, req) => {
 *   if (isProtectedRoute(req)) {
 *     await auth.protect();
 *   }
 * });
 * ```
 */
const asgardeoMiddleware = (
  handler?: AsgardeoMiddlewareHandler,
  options?: AsgardeoMiddlewareOptions | ((req: NextRequest) => AsgardeoMiddlewareOptions),
): ((request: NextRequest) => Promise<NextResponse>) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Resolve options - can be static or dynamic based on request
    const resolvedOptions = typeof options === 'function' ? options(request) : options || {};

    const asgardeoClient = AsgardeoNextClient.getInstance();

    // // Initialize client if not already done
    // if (!asgardeoClient.isInitialized && resolvedOptions) {
    //   asgardeoClient.initialize(resolvedOptions);
    // }

    // // Debug logging
    // if (resolvedOptions.debug) {
    //   console.log(`[Asgardeo Middleware] Processing request: ${request.nextUrl.pathname}`);
    // }

    // // Handle auth API routes automatically
    // if (request.nextUrl.pathname.startsWith('/api/auth/asgardeo')) {
    //   if (resolvedOptions.debug) {
    //     console.log(`[Asgardeo Middleware] Handling auth route: ${request.nextUrl.pathname}`);
    //   }
    //   return await asgardeoClient.handleAuthRequest(request);
    // }

    // // Create auth object for the handler
    // const auth: AsgardeoAuth = {
    //   protect: async (options?: {redirect?: string}) => {
    //     const isSignedIn = await asgardeoClient.isSignedIn(request);
    //     if (!isSignedIn) {
    //       const afterSignInUrl = options?.redirect || '/api/auth/asgardeo/signin';
    //       return NextResponse.redirect(new URL(afterSignInUrl, request.url));
    //     }
    //   },

    //   isSignedIn: async () => {
    //     return await asgardeoClient.isSignedIn(request);
    //   },

    //   getUser: async () => {
    //     return await asgardeoClient.getUser(request);
    //   },

    //   redirectToSignIn: (afterSignInUrl?: string) => {
    //     const signInUrl = afterSignInUrl || '/api/auth/asgardeo/signin';
    //     return NextResponse.redirect(new URL(signInUrl, request.url));
    //   },
    // };

    // // Execute user-provided handler if present
    // let handlerResponse: NextResponse | void;
    // if (handler) {
    //   handlerResponse = await handler(auth, request);
    // }

    // // If handler returned a response, use it
    // if (handlerResponse) {
    //   return handlerResponse;
    // }

    // // Otherwise, continue with default behavior
    // const response = NextResponse.next();

    // // Add authentication context to response headers
    // const isSignedIn = await asgardeoClient.isSignedIn(request);
    // if (isSignedIn) {
    //   response.headers.set('x-asgardeo-authenticated', 'true');
    //   const user = await asgardeoClient.getUser(request);
    //   if (user?.sub) {
    //     response.headers.set('x-asgardeo-user-id', user.sub);
    //   }
    // }

    // return response;

    return NextResponse.next();
  };
};

export default asgardeoMiddleware;
