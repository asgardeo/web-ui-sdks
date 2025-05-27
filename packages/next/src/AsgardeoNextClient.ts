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

import {AsgardeoNodeClient, LegacyAsgardeoNodeClient, SignInOptions, SignOutOptions, User} from '@asgardeo/node';
import {AsgardeoNextConfig} from './models/config';
import decorateConfigWithNextEnv from './utils/decorateConfigWithNextEnv';

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
      clientID: clientId,
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

  override signIn(
    options?: SignInOptions,
    sessionId?: string,
    beforeSignIn?: (redirectUrl: string) => void,
  ): Promise<User> {
    return this.asgardeo.signIn(beforeSignIn as any, sessionId as string) as any;
  }

  override signOut(options?: SignOutOptions, afterSignOut?: (redirectUrl: string) => void): Promise<boolean>;
  override signOut(
    options?: SignOutOptions,
    sessionId?: string,
    afterSignOut?: (redirectUrl: string) => void,
  ): Promise<boolean>;
  override signOut(...args: any[]): Promise<boolean> {
    if (args[1] && typeof args[1] !== 'string') {
      throw new Error('The second argument must be a string.');
    }

    this.asgardeo.signOut(args[1]);

    return Promise.resolve(true);
  }
}

export default AsgardeoNextClient;
