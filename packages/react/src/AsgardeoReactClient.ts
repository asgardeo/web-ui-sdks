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
  AsgardeoBrowserClient,
  extractUserClaimsFromIdToken,
  getUserInfo,
  SignInOptions,
  SignOutOptions,
  User,
} from '@asgardeo/browser';
import AuthAPI from './__temp__/api';
import {AsgardeoReactConfig} from './models/config';
import getUserProfile from './utils/getUserProfile';

/**
 * Client for mplementing Asgardeo in React applications.
 * This class provides the core functionality for managing user authentication and sessions.
 *
 * @typeParam T - Configuration type that extends AsgardeoReactConfig.
 */
class AsgardeoReactClient<T extends AsgardeoReactConfig = AsgardeoReactConfig> extends AsgardeoBrowserClient<T> {
  private asgardeo: AuthAPI;

  constructor() {
    super();

    // FIXME: This has to be the browser client from `@asgardeo/browser` package.
    this.asgardeo = new AuthAPI();
  }

  override initialize(config: T): Promise<boolean> {
    const scopes: string[] = Array.isArray(config.scopes) ? config.scopes : config.scopes.split(' ');

    return this.asgardeo.init({
      baseUrl: config.baseUrl,
      clientId: config.clientId,
      afterSignInUrl: config.afterSignInUrl,
      scope: [...scopes, 'internal_login'],
    });
  }

  override async getUser(): Promise<any> {
    const baseUrl = await (await this.asgardeo.getConfigData()).baseUrl;
    const profile = await getUserProfile({baseUrl});

    return profile;
  }

  override isLoading(): boolean {
    return this.asgardeo.isLoading();
  }

  override isSignedIn(): Promise<boolean> {
    return this.asgardeo.isSignedIn();
  }

  override signIn(options?: SignInOptions): Promise<User> {
    return this.asgardeo.signIn(options as any) as unknown as Promise<User>;
  }

  override signOut(options?: SignOutOptions, afterSignOut?: (redirectUrl: string) => void): Promise<string>;
  override signOut(
    options?: SignOutOptions,
    sessionId?: string,
    afterSignOut?: (redirectUrl: string) => void,
  ): Promise<string>;
  override async signOut(...args: any[]): Promise<string> {
    if (args[1] && typeof args[1] !== 'function') {
      throw new Error('The second argument must be a function.');
    }

    const response: boolean = await this.asgardeo.signOut(args[1]);

    return Promise.resolve(String(response));
  }
}

export default AsgardeoReactClient;
