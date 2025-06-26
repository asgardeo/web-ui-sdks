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
import InternalAuthAPIRoutesConfig from '../../configs/InternalAuthAPIRoutesConfig';
import handlePostSignIn from './handlePostSignIn';
import handleGetSignIn from './handleGetSignIn';
import handleSessionRequest from './handleSessionRequest';
import handleUserRequest from './handleUserRequest';
import handleSignOut from './handleSignOut';

const removeTrailingSlash = (path: string): string => (path.endsWith('/') ? path.slice(0, -1) : path);

/**
 * Main authentication request router.
 * Routes incoming requests to appropriate handlers based on method and path.
 *
 * @param req - The Next.js request object
 * @returns NextResponse from the appropriate handler or NextResponse.next() if no handler matches
 */
export async function authRouter(req: NextRequest): Promise<NextResponse> {
  const {pathname, searchParams} = req.nextUrl;
  const sanitizedPathname: string = removeTrailingSlash(pathname);
  const {method} = req;

  // Handle POST sign-in request
  if (method === 'POST' && sanitizedPathname === InternalAuthAPIRoutesConfig.signIn) {
    return handlePostSignIn(req);
  }

  // Handle GET sign-in request or callback with code
  if ((method === 'GET' && sanitizedPathname === InternalAuthAPIRoutesConfig.signIn) || searchParams.get('code')) {
    return handleGetSignIn(req);
  }

  // Handle session status request
  if (method === 'GET' && sanitizedPathname === InternalAuthAPIRoutesConfig.session) {
    return handleSessionRequest(req);
  }

  // Handle user profile request
  if (method === 'GET' && sanitizedPathname === InternalAuthAPIRoutesConfig.user) {
    return handleUserRequest(req);
  }

  // Handle sign-out request
  if (method === 'GET' && sanitizedPathname === InternalAuthAPIRoutesConfig.signOut) {
    return handleSignOut(req);
  }

  // No auth handler found, simply continue to next middleware
  // TODO: this should only happen if rolling sessions are enabled. Also, we should
  // try to avoid reading from the DB (for stateful sessions) on every request if possible.
  // const res = NextResponse.next();
  // const session = await this.sessionStore.get(req.cookies);

  // if (session) {
  //   // we pass the existing session (containing an `createdAt` timestamp) to the set method
  //   // which will update the cookie's `maxAge` property based on the `createdAt` time
  //   await this.sessionStore.set(req.cookies, res.cookies, {
  //     ...session,
  //   });
  // }

  return NextResponse.next();
}

export default authRouter;
