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

import {AsgardeoBrowserClient, AsgardeoBrowserConfig, SignInOptions, User} from '@asgardeo/browser';
import AuthAPI from './__temp__/api';

class AsgardeoReactClient extends AsgardeoBrowserClient {
  private asgardeo: AuthAPI;

  constructor() {
    super();

    // FIXME: This has to be the browser client from `@asgardeo/browser` package.
    this.asgardeo = new AuthAPI();
  }

  override initialize(config: AsgardeoBrowserConfig): Promise<boolean> {
    return this.asgardeo.init({
      baseUrl: config.baseUrl,
      clientID: config.clientId,
      signInRedirectURL: config.afterSignInUrl,
    });
  }

  override getUser(): Promise<User> {
    return this.asgardeo.getUser();
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

  override signOut(afterSignOut: () => void): Promise<boolean> {
    return this.asgardeo.signOut(afterSignOut);
  }
}

export default AsgardeoReactClient;
