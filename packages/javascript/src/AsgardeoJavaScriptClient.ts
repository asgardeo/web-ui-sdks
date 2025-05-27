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

import {AsgardeoClient, SignInOptions} from './models/client';
import {User} from './models/user';
import {Config} from './models/config';

/**
 * Base class for implementing Asgardeo clients.
 * This class provides the core functionality for managing user authentication and sessions.
 *
 * @template T - Configuration type that extends Config.
 * @implements {AsgardeoClient<T>}
 */
abstract class AsgardeoJavaScriptClient<T = Config> implements AsgardeoClient<T> {
  /**
   * Initializes the authentication client with provided configuration.
   *
   * @param config - SDK Client instance configuration options.
   * @returns Promise resolving to boolean indicating success.
   */
  abstract initialize(config: T): Promise<boolean>;

  /**
   * Gets user information from the session.
   *
   * @returns User object containing user details.
   */
  abstract getUser(): Promise<User>;
  
  /**
   * Checks if the client is currently loading.
   * This can be used to determine if the client is in the process of initializing or fetching user data.
   *
   * @returns Boolean indicating if the client is loading.
   */
  abstract isLoading(): boolean;

  /**
   * Checks if a user is signed in.
   * FIXME: Check if this should return a boolean or a Promise<boolean>.
   *
   * @returns Promise resolving to boolean indicating sign-in status.
   */
  abstract isSignedIn(): Promise<boolean>;

  /**
   * Initiates the sign-in process for the user.
   *
   * @param options - Optional sign-in options like additional parameters to be sent in the authorize request, etc.
   * @returns Promise resolving the user upon successful sign in.
   */
  abstract signIn(options?: SignInOptions): Promise<User>;

  /**
   * Signs out the currently signed-in user.
   *
   * @param afterSignOut - Callback function to be executed after sign-out is complete.
   * @returns A promise that resolves to true if sign-out is successful
   */
  abstract signOut(afterSignOut: () => void): Promise<boolean>;
}

export default AsgardeoJavaScriptClient;
