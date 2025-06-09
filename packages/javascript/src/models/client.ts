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

import { CustomGrantConfig } from '../__legacy__/models/custom-grant';
import StorageManager from '../StorageManager';
import {Crypto} from './crypto';
import {ExtendedAuthorizeRequestUrlParams} from './oauth-request';
import {OIDCEndpoints} from './oidc-endpoints';
import {IdTokenPayload, TokenResponse} from './token';
import {User, UserInfoResolvingStrategy} from './user';

export type SignInOptions = Record<string, unknown>;
export type SignOutOptions = Record<string, unknown>;

/**
 * Interface defining the core functionality for Asgardeo clients.
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
   * Initializes the Asgardeo client with provided configuration.
   *
   * @param config - SDK instance configuration options.
   * @param storage - Storage interface for managing session data.
   * @param crypto - Crypto interface for handling cryptographic operations.
   * @param instanceId - Unique identifier for the client instance.
   * @returns Promise resolving to boolean indicating success.
   */
  initialize(config: T, storage: Storage, crypto: Crypto, instanceId: number): Promise<boolean>;

  /**
   * Gets user information based on the specified strategy.
   * The strategy can be 'SCIM' | 'ID_TOKEN' | 'USER_INFO'.
   *   - 'SCIM' will fetch user information from the SCIM endpoint.
   *   - 'ID_TOKEN' will extract user information from the ID token.
   *   - 'USER_INFO' will fetch user information from the UserInfo endpoint.
   * If a userId is provided, it will fetch the user information for that specific user in multi-user scenarios.
   * @param strategy - The strategy to use for fetching user information.
   * @param userId - Optional user ID to fetch specific user information.
   *                If not provided, it will fetch the currently signed-in user.
   * @returns Promise resolving to a User object containing user details.
   */
  getUser(strategy: UserInfoResolvingStrategy, userId?: string): Promise<User>;

  /**
   * Gets the storage manager instance.
   * @returns StorageManager instance for managing session data.
   */
  getStorageManager(): StorageManager<T>;

  /**
   * Gets the client instance Id.
   * This is useful for identifying different instances of the client, especially in scenarios where multiple clients are used.
   * @return Unique identifier for the client instance.
   */
  getInstanceId(): number;

  getSignInUrl(requestConfig: ExtendedAuthorizeRequestUrlParams, userId: string): Promise<string>;

  getSignOutUrl(userId: string): Promise<string>;

  loadOpenIDProviderConfiguration(force: boolean): Promise<void>;

  getOpenIDProviderEndpoints(): Promise<Partial<OIDCEndpoints>>;

  requestAccessToken(
    authorizationCode: string,
    sessionState: string,
    state: string,
    userId?: string,
    requestConfig?: {
      params: Record<string, unknown>;
    },
  ): Promise<TokenResponse>;

  getIdToken(userId: string, raw: boolean): Promise<string>;

  getCrypto(): Crypto;

  // TODO: Properly define the return type for revokeAccessToken.
  revokeAccessToken(userId?: string): Promise<any>;

  refreshAccessToken(userId?: string): Promise<TokenResponse>;

  getAccessToken(userId?: string): Promise<string>;

  exchangeToken(requestConfig: CustomGrantConfig, userId?: string): Promise<TokenResponse>;
  
  getPKCECode(state: string, userId?: string): Promise<string>;
  
  setPKCECode(code: string, state: string, userId?: string): Promise<void>;
  
  isSignOutSuccessful(afterSignOutUrl: string): boolean;
  
  reInitialize(config: T): Promise<void>;
  
  clearSession(userId?: string): Promise<void>;

  /**
   * Checks if the client is currently loading.
   * This can be used to determine if the client is in the process of initializing or fetching user data.
   *
   * @returns Boolean indicating if the client is loading.
   */
  isLoading(): boolean;

  /**
   * Checks if a user is signed in.
   * FIXME: This should be integrated with the existing isAuthenticated method which returns a Promise.
   *
   * @returns Boolean indicating sign-in status.
   */
  isSignedIn(userId?: string): Promise<boolean>;

  /**
   * Initiates the sign-in process for the user.
   *
   * @param options - Optional sign-in options like additional parameters to be sent in the authorize request, etc.
   * @returns Promise resolving the user upon successful sign in.
   */
  signIn(options?: SignInOptions): Promise<User>;

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
