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

import {User} from './user';

/**
 * Interface defining the core functionality for Asgardeo authentication clients.
 *
 * @template T - Type parameter for client-specific configuration
 *
 * @example
 * ```typescript
 * class AsgardeoNodeClient implements AsgardeoClient<NodeConfig> {
 *   // Implement interface methods
 * }
 * ```
 */
export interface AsgardeoClient<T> {
  /**
   * Gets basic user information from the session.
   *
   * @returns Promise resolving the user.
   */
  getUser(): Promise<User>;

  /**
   * Initializes the authentication client with provided configuration.
   *
   * @param config - SDK Client instance configuration options.
   * @returns Promise resolving to boolean indicating success.
   */
  initialize(config: T): Promise<boolean>;

  /**
   * Checks if a user is signed in.
   *
   * @returns Promise resolving to boolean indicating sign-in status.
   */
  isSignedIn(): Promise<boolean>;

  /**
   * Sign-in a user
   *
   * @param config - Optional sign in configuration.
   * @returns Promise resolving the user upon successful sign in.
   */
  signIn(config?: Record<string, unknown>): Promise<User>;

  /**
   * Sign-out the current user.
   *
   * @returns Promise resolving to boolean indicating success.
   */
  signOut(): Promise<boolean>;
}
