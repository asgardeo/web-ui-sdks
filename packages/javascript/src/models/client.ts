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

import {EmbeddedFlowExecuteRequestPayload, EmbeddedFlowExecuteResponse} from './embedded-flow';
import {User, UserProfile} from './user';

export type SignInOptions = Record<string, unknown>;
export type SignOutOptions = Record<string, unknown>;
export type SignUpOptions = Record<string, unknown>;

/**
 * Interface defining the core functionality for Asgardeo authentication clients.
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
   * Gets user information from the session.
   *
   * @returns User object containing user details.
   */
  getUser(): Promise<User>;

  /**
   * Fetches the user profile along with its schemas and a flattened version of the profile.
   *
   * @returns A promise resolving to a UserProfile object containing the user's profile information.
   */
  getUserProfile(): Promise<UserProfile>;

  /**
   * Initializes the authentication client with provided configuration.
   *
   * @param config - SDK Client instance configuration options.
   * @returns Promise resolving to boolean indicating success.
   */
  initialize(config: T): Promise<boolean>;

  /**
   * Checks if the client is currently loading.
   * This can be used to determine if the client is in the process of initializing or fetching user data.
   *
   * @returns Boolean indicating if the client is loading.
   */
  isLoading(): boolean;

  /**
   * Checks if a user is signed in.
   * FIXME: This should be integrated with the existing isSignedIn method which returns a Promise.
   *
   * @returns Boolean indicating sign-in status.
   */
  isSignedIn(): Promise<boolean>;

  /**
   * Initiates the sign-in process for the user.
   *
   * @param options - Optional sign-in options like additional parameters to be sent in the authorize request, etc.
   * @returns Promise resolving the user upon successful sign in.
   */
  signIn(options?: SignInOptions): Promise<User>;

  /**
   * Initiates a redirection-based sign-up process for the user.
   *
   * @param options - Optional sign-up options like additional parameters to be sent in the sign-up request, etc.
   * @returns Promise resolving to the user upon successful sign up.
   */
  signUp(options?: SignUpOptions): Promise<void>;

  /**
   * Initiates an embedded (App-Native) sign-up flow for the user.
   *
   * @param payload - The payload containing the necessary information to execute the embedded sign-up flow.
   * @returns A promise that resolves to an EmbeddedFlowExecuteResponse containing the flow execution details.
   */
  signUp(payload: EmbeddedFlowExecuteRequestPayload): Promise<EmbeddedFlowExecuteResponse>;

  /**
   * Signs out the currently signed-in user.
   *
   * @param options - Optional sign-out options like additional parameters to be sent in the sign-out request, etc.
   * @param afterSignOut - Callback function to be executed after sign-out is complete.
   * @returns A promise that resolves to true if sign-out is successful
   */
  signOut(options?: SignOutOptions, afterSignOut?: (redirectUrl: string) => void): Promise<string>;

  /**
   * Signs out the currently signed-in user with an optional session ID.
   *
   * @param options - Optional sign-out options like additional parameters to be sent in the sign-out request, etc.
   * @param sessionId - Optional session ID to be used for sign-out.
   *                    This can be useful in scenarios where multiple sessions are managed.
   * @param afterSignOut - Callback function to be executed after sign-out is complete.
   * @returns A promise that resolves to true if sign-out is successful
   */
  signOut(options?: SignOutOptions, sessionId?: string, afterSignOut?: (redirectUrl: string) => void): Promise<string>;
}
