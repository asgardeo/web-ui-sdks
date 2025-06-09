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

import {
  AsgardeoNodeClient,
  LegacyAsgardeoNodeClient,
  SignInOptions,
  SignOutOptions,
  User,
  // removeTrailingSlash,
} from '@asgardeo/node';
import {NextRequest, NextResponse} from 'next/server';
import {AsgardeoNextConfig} from './models/config';
import deleteSessionId from './server/actions/deleteSessionId';
import getSessionId from './server/actions/getSessionId';
import setSessionId from './server/actions/setSessionId';
import decorateConfigWithNextEnv from './utils/decorateConfigWithNextEnv';
import InternalAuthAPIRoutesConfig from './configs/InternalAuthAPIRoutesConfig';

const removeTrailingSlash = (path: string): string => (path.endsWith('/') ? path.slice(0, -1) : path);
/**
 * Client for mplementing Asgardeo in Next.js applications.
 * This class provides the core functionality for managing user authentication and sessions.
 *
 * @typeParam T - Configuration type that extends AsgardeoNextConfig.
 */
class AsgardeoNextClient<T extends AsgardeoNextConfig = AsgardeoNextConfig> extends AsgardeoNodeClient<T> {
  private asgardeo: LegacyAsgardeoNodeClient<T>;

  constructor() {
    super();

    this.asgardeo = new LegacyAsgardeoNodeClient();
  }

  override initialize(config: T): Promise<boolean> {
    const {baseUrl, clientId, clientSecret, afterSignInUrl} = decorateConfigWithNextEnv({
      afterSignInUrl: config.afterSignInUrl,
      baseUrl: config.baseUrl,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    });

    return this.asgardeo.initialize({
      baseUrl,
      clientId: clientId,
      clientSecret,
      signInRedirectURL: afterSignInUrl,
    } as any);
  }

  override getUser(): Promise<User> {
    throw new Error('Method not implemented.');
  }

  override isLoading(): boolean {
    return false;
  }

  override isSignedIn(sessionId?: string): Promise<boolean> {
    return this.asgardeo.isAuthenticated(sessionId as string);
  }

  override async signIn(
    options?: SignInOptions,
    sessionId?: string,
    beforeSignIn?: (redirectUrl: string) => NextResponse,
    authorizationCode?: string,
    sessionState?: string,
    state?: string,
  ): Promise<User> {
    let resolvedSessionId: string = sessionId || ((await getSessionId()) as string);

    if (!resolvedSessionId) {
      resolvedSessionId = await setSessionId(sessionId);
    }

    return this.asgardeo.signIn(
      beforeSignIn as any,
      resolvedSessionId,
      authorizationCode,
      sessionState,
      state,
    ) as unknown as User;
  }

  override signOut(options?: SignOutOptions, afterSignOut?: (redirectUrl: string) => void): Promise<string>;
  override signOut(
    options?: SignOutOptions,
    sessionId?: string,
    afterSignOut?: (redirectUrl: string) => void,
  ): Promise<string>;
  override async signOut(...args: any[]): Promise<string> {
    if (args[1] && typeof args[1] !== 'string') {
      throw new Error('The second argument must be a string.');
    }

    const resolvedSessionId: string = args[1] || ((await getSessionId()) as string);

    return Promise.resolve(await this.asgardeo.signOut(resolvedSessionId));
  }

  async handler(req: NextRequest): Promise<NextResponse> {
    const {pathname, searchParams} = req.nextUrl;
    const sanitizedPathname: string = removeTrailingSlash(pathname);
    const {method} = req;

    if ((method === 'GET' && sanitizedPathname === InternalAuthAPIRoutesConfig.signIn) || searchParams.get('code')) {
      let response: NextResponse | undefined;

      await this.signIn(
        {},
        undefined,
        (redirectUrl: string) => {
          return (response = NextResponse.redirect(redirectUrl, 302));
        },
        searchParams.get('code') as string,
        searchParams.get('session_state') as string,
        searchParams.get('state') as string,
      );

      // If we already redirected via the callback, return that
      if (response) {
        return response;
      }

      if (searchParams.get('code')) {
        const cleanUrl: URL = new URL(req.url);
        cleanUrl.searchParams.delete('code');
        cleanUrl.searchParams.delete('state');
        cleanUrl.searchParams.delete('session_state');

        return NextResponse.redirect(cleanUrl.toString());
      }

      return NextResponse.next();
    }

    if (method === 'GET' && sanitizedPathname === InternalAuthAPIRoutesConfig.session) {
      try {
        const isAuthenticated: boolean = await this.isSignedIn();

        return NextResponse.json({isSignedIn: isAuthenticated});
      } catch (error) {
        return NextResponse.json({error: 'Failed to check session'}, {status: 500});
      }
    }

    if (method === 'GET' && sanitizedPathname === InternalAuthAPIRoutesConfig.signOut) {
      try {
        const afterSignOutUrl: string = await this.signOut();

        await deleteSessionId();

        return NextResponse.redirect(afterSignOutUrl, 302);
      } catch (error) {
        console.error('[AsgardeoNextClient] Sign-out failed:', error);
        return NextResponse.json({error: 'Failed to sign out'}, {status: 500});
      }
    }

    // no auth handler found, simply touch the sessions
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

  middleware(req: NextRequest): Promise<NextResponse> {
    return this.handler(req);
  }
}

export default AsgardeoNextClient;
