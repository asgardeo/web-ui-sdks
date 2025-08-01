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

import {AllOrganizationsApiResponse} from '../models/organization';
import {
  EmbeddedFlowExecuteRequestConfig,
  EmbeddedFlowExecuteRequestPayload,
  EmbeddedFlowExecuteResponse,
} from './embedded-flow';
import {EmbeddedSignInFlowHandleRequestPayload} from './embedded-signin-flow';
import {Organization} from './organization';
import {User, UserProfile} from './user';
import {TokenResponse} from './token';
import {Storage} from './store';

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
   * Gets the current signed-in user's associated organizations.
   *
   * @returns Associated organizations.
   */
  getMyOrganizations(options?: any, sessionId?: string): Promise<Organization[]>;

  getAllOrganizations(options?: any, sessionId?: string): Promise<AllOrganizationsApiResponse>;

  /**
   * Gets the current organization of the user.
   *
   * @returns The current organization if available, otherwise null.
   */
  getCurrentOrganization(sessionId?: string): Promise<Organization | null>;

  /**
   * Switches the current organization to the specified one.
   * @param organization - The organization to switch to.
   * @returns A promise that resolves when the switch is complete.
   */
  switchOrganization(organization: Organization, sessionId?: string): Promise<TokenResponse | Response>;

  getConfiguration(): T;

  updateUserProfile(payload: any, userId?: string): Promise<User>;

  /**
   * Gets user information from the session.
   *
   * @returns User object containing user details.
   */
  getUser(options?: any): Promise<User>;

  /**
   * Fetches the user profile along with its schemas and a flattened version of the profile.
   *
   * @returns A promise resolving to a UserProfile object containing the user's profile information.
   */
  getUserProfile(options?: any): Promise<UserProfile>;

  /**
   * Initializes the authentication client with provided configuration.
   *
   * @param config - SDK Client instance configuration options.
   * @param storage - Optional storage instance to persist data (e.g., session, user profile).
   * @returns Promise resolving to boolean indicating success.
   */
  initialize(config: T, storage?: Storage): Promise<boolean>;

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
   * @param sessionId - Optional session ID to be used for sign-in.
   * @param onSignInSuccess - Callback function to be executed upon successful sign-in.
   * @returns Promise resolving the user upon successful sign in.
   */
  signIn(
    options?: SignInOptions,
    sessionId?: string,
    onSignInSuccess?: (afterSignInUrl: string) => void,
  ): Promise<User>;

  /**
   * Initiates an embedded (App-Native) sign-in flow for the user.
   *
   * @param payload - The payload containing the necessary information to execute the embedded sign-in flow.
   * @param request - The request object containing URL and parameters for the sign-in flow HTTP request.
   * @param sessionId - Optional session ID to be used for sign-in.
   * @param onSignInSuccess - Callback function to be executed upon successful sign-in.
   * @returns A promise that resolves to an EmbeddedFlowExecuteResponse containing the flow execution details.
   */
  signIn(
    payload: EmbeddedSignInFlowHandleRequestPayload,
    request: EmbeddedFlowExecuteRequestConfig<EmbeddedSignInFlowHandleRequestPayload>,
    sessionId?: string,
    onSignInSuccess?: (afterSignInUrl: string) => void,
  ): Promise<User>;

  /**
   * Try signing in silently in the background without any user interactions.
   *
   * @remarks This approach uses a passive auth request (prompt=none) sent from an iframe which might pose issues in cross-origin scenarios.
   * Make sure you are aware of the limitations and browser compatibility issues.
   *
   * @param options - Optional sign-in options like additional parameters to be sent in the authorize request, etc.
   * @returns A promise that resolves to the user if sign-in is successful, or false if not.
   */
  signInSilently(options?: SignInOptions): Promise<User | boolean>;

  /**
   * Signs out the currently signed-in user.
   *
   * @param options - Optional sign-out options like additional parameters to be sent in the sign-out request, etc.
   * @param afterSignOut - Callback function to be executed after sign-out is complete.
   * @returns A promise that resolves to true if sign-out is successful
   */
  signOut(options?: SignOutOptions, afterSignOut?: (afterSignOutUrl: string) => void): Promise<string>;

  /**
   * Signs out the currently signed-in user with an optional session ID.
   *
   * @param options - Optional sign-out options like additional parameters to be sent in the sign-out request, etc.
   * @param sessionId - Optional session ID to be used for sign-out.
   *                    This can be useful in scenarios where multiple sessions are managed.
   * @param afterSignOut - Callback function to be executed after sign-out is complete.
   * @returns A promise that resolves to true if sign-out is successful
   */
  signOut(
    options?: SignOutOptions,
    sessionId?: string,
    afterSignOut?: (afterSignOutUrl: string) => void,
  ): Promise<string>;

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
   * Retrieves the access token for the current session.
   * @param sessionId - Optional session ID to retrieve the access token for a specific session.
   * @returns A promise that resolves to the access token string.
   */
  getAccessToken(sessionId?: string): Promise<string>;
}
