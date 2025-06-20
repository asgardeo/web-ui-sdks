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

import {AsgardeoClient, SignInOptions, SignOutOptions, SignUpOptions} from './models/client';
import {Config} from './models/config';
import {EmbeddedFlowExecuteRequestPayload, EmbeddedFlowExecuteResponse} from './models/embedded-flow';
import {Organization} from './models/organization';
import {User, UserProfile} from './models/user';

/**
 * Base class for implementing Asgardeo clients.
 * This class provides the core functionality for managing user authentication and sessions.
 *
 * @typeParam T - Configuration type that extends Config.
 */
abstract class AsgardeoJavaScriptClient<T = Config> implements AsgardeoClient<T> {
  abstract initialize(config: T): Promise<boolean>;

  abstract getUser(): Promise<User>;

  abstract getOrganizations(): Promise<Organization[]>;

  abstract getUserProfile(): Promise<UserProfile>;

  abstract isLoading(): boolean;

  abstract isSignedIn(): Promise<boolean>;

  abstract signIn(options?: SignInOptions): Promise<User>;
  abstract signOut(options?: SignOutOptions, afterSignOut?: (redirectUrl: string) => void): Promise<string>;
  abstract signOut(
    options?: SignOutOptions,
    sessionId?: string,
    afterSignOut?: (redirectUrl: string) => void,
  ): Promise<string>;

  abstract signUp(options?: SignUpOptions): Promise<void>;
  abstract signUp(payload: EmbeddedFlowExecuteRequestPayload): Promise<EmbeddedFlowExecuteResponse>;
  abstract signUp(payload?: unknown): Promise<void> | Promise<EmbeddedFlowExecuteResponse>;
}

export default AsgardeoJavaScriptClient;
