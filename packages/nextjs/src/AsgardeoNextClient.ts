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
  AsgardeoRuntimeError,
  EmbeddedFlowExecuteRequestPayload,
  EmbeddedFlowExecuteResponse,
  LegacyAsgardeoNodeClient,
  SignInOptions,
  SignOutOptions,
  SignUpOptions,
  User,
  UserProfile,
  initializeEmbeddedSignInFlow,
  Organization,
} from '@asgardeo/node';
import {NextRequest, NextResponse} from 'next/server';
import InternalAuthAPIRoutesConfig from './configs/InternalAuthAPIRoutesConfig';
import {AsgardeoNextConfig} from './models/config';
import deleteSessionId from './server/actions/deleteSessionId';
import getSessionId from './server/actions/getSessionId';
import getIsSignedIn from './server/actions/isSignedIn';
import setSessionId from './server/actions/setSessionId';
import decorateConfigWithNextEnv from './utils/decorateConfigWithNextEnv';

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
    const {baseUrl, clientId, clientSecret, afterSignInUrl, ...rest} = decorateConfigWithNextEnv(config);

    return this.asgardeo.initialize({
      baseUrl,
      clientId,
      clientSecret,
      afterSignInUrl,
      ...rest,
    } as any);
  }

  override async getUser(userId?: string): Promise<User> {
    const resolvedSessionId: string = userId || ((await getSessionId()) as string);

    return this.asgardeo.getUser(resolvedSessionId);
  }

  override async getOrganizations(): Promise<Organization[]> {
    throw new Error('Method not implemented.');
  }

  override getUserProfile(): Promise<UserProfile> {
    throw new Error('Method not implemented.');
  }

  override isLoading(): boolean {
    return false;
  }

  override isSignedIn(sessionId?: string): Promise<boolean> {
    return this.asgardeo.isSignedIn(sessionId as string);
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

  override async signUp(options?: SignUpOptions): Promise<void>;
  override async signUp(payload: EmbeddedFlowExecuteRequestPayload): Promise<EmbeddedFlowExecuteResponse>;
  override async signUp(...args: any[]): Promise<void | EmbeddedFlowExecuteResponse> {
    throw new AsgardeoRuntimeError(
      'Not implemented',
      'react-AsgardeoReactClient-ValidationError-002',
      'react',
      'The signUp method with SignUpOptions is not implemented in the React client.',
    );
  }

  async handler(req: NextRequest): Promise<NextResponse> {
    const {pathname, searchParams} = req.nextUrl;
    const sanitizedPathname: string = removeTrailingSlash(pathname);
    const {method} = req;

    if ((method === 'POST' && sanitizedPathname === InternalAuthAPIRoutesConfig.signIn) || searchParams.get('code')) {
      let response;

      const userId: string | undefined = await getSessionId();

      const signInUrl: URL = new URL(await this.asgardeo.getSignInUrl({response_mode: 'direct'}, userId));
      const {pathname, origin, searchParams} = signInUrl;

      try {
        response = await initializeEmbeddedSignInFlow({
          url: `${origin}${pathname}`,
          payload: Object.fromEntries(searchParams.entries()),
        });
      } catch (error) {
        throw new Error(`Failed to initialize application native authentication`);
      }

      return NextResponse.json(response);
    }

    if ((method === 'GET' && sanitizedPathname === InternalAuthAPIRoutesConfig.signIn) || searchParams.get('code')) {
      let response: NextResponse | undefined;

      await this.signIn(
        {},
        undefined,
        (redirectUrl: string) => (response = NextResponse.redirect(redirectUrl, 302)),
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
        const isSignedIn: boolean = await getIsSignedIn();

        return NextResponse.json({isSignedIn});
      } catch (error) {
        return NextResponse.json({error: 'Failed to check session'}, {status: 500});
      }
    }

    if (method === 'GET' && sanitizedPathname === InternalAuthAPIRoutesConfig.user) {
      try {
        const user: User = await this.getUser();

        console.log('[AsgardeoNextClient] User fetched successfully:', user);

        return NextResponse.json({user});
      } catch (error) {
        console.error('[AsgardeoNextClient] Failed to get user:', error);
        return NextResponse.json({error: 'Failed to get user'}, {status: 500});
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
