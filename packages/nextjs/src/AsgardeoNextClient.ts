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
  EmbeddedSignInFlowHandleRequestPayload,
  executeEmbeddedSignInFlow,
  EmbeddedFlowExecuteRequestConfig,
  ExtendedAuthorizeRequestUrlParams,
  generateUserProfile,
  flattenUserSchema,
  getScim2Me,
} from '@asgardeo/node';
import {NextRequest, NextResponse} from 'next/server';
import {AsgardeoNextConfig} from './models/config';
import getSessionId from './server/actions/getSessionId';
import decorateConfigWithNextEnv from './utils/decorateConfigWithNextEnv';
import getClientOrigin from './server/actions/getClientOrigin';

const removeTrailingSlash = (path: string): string => (path.endsWith('/') ? path.slice(0, -1) : path);
/**
 * Client for mplementing Asgardeo in Next.js applications.
 * This class provides the core functionality for managing user authentication and sessions.
 *
 * This class is implemented as a singleton to ensure a single instance across the application.
 *
 * @typeParam T - Configuration type that extends AsgardeoNextConfig.
 */
class AsgardeoNextClient<T extends AsgardeoNextConfig = AsgardeoNextConfig> extends AsgardeoNodeClient<T> {
  private static instance: AsgardeoNextClient<any>;
  private asgardeo: LegacyAsgardeoNodeClient<T>;
  public isInitialized: boolean = false;

  private constructor() {
    super();

    this.asgardeo = new LegacyAsgardeoNodeClient();
  }

  /**
   * Get the singleton instance of AsgardeoNextClient
   */
  public static getInstance<T extends AsgardeoNextConfig = AsgardeoNextConfig>(): AsgardeoNextClient<T> {
    if (!AsgardeoNextClient.instance) {
      AsgardeoNextClient.instance = new AsgardeoNextClient<T>();
    }
    return AsgardeoNextClient.instance as AsgardeoNextClient<T>;
  }

  /**
   * Ensures the client is initialized before using it.
   * Throws an error if the client is not initialized.
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error(
        '[AsgardeoNextClient] Client is not initialized. Make sure you have wrapped your app with AsgardeoProvider and provided the required configuration (baseUrl, clientId, etc.).',
      );
    }
  }

  override async initialize(config: T): Promise<boolean> {
    if (this.isInitialized) {
      console.warn('[AsgardeoNextClient] Client is already initialized');
      return Promise.resolve(true);
    }

    const {baseUrl, clientId, clientSecret, signInUrl, afterSignInUrl, afterSignOutUrl, signUpUrl, ...rest} =
      decorateConfigWithNextEnv(config);

    this.isInitialized = true;

    console.log('[AsgardeoNextClient] Initializing with decorateConfigWithNextEnv:', {
      baseUrl,
      clientId,
      clientSecret,
      signInUrl,
      signUpUrl,
      afterSignInUrl,
      afterSignOutUrl,
      enablePKCE: false,
      ...rest,
    });

    const origin: string = await getClientOrigin();

    return this.asgardeo.initialize({
      baseUrl,
      clientId,
      clientSecret,
      signInUrl,
      signUpUrl,
      afterSignInUrl: afterSignInUrl ?? origin,
      afterSignOutUrl: afterSignOutUrl ?? origin,
      enablePKCE: false,
      ...rest,
    } as any);
  }

  override async getUser(userId?: string): Promise<User> {
    await this.ensureInitialized();
    const resolvedSessionId: string = userId || ((await getSessionId()) as string);

    try {
      const configData = await this.asgardeo.getConfigData();
      const baseUrl = configData?.baseUrl;

      const profile = await getScim2Me({baseUrl});
      const schemas = await getSchemas({url: `${baseUrl}/scim2/Schemas`});

      return generateUserProfile(profile, flattenUserSchema(schemas));
    } catch (error) {
      return this.asgardeo.getUser(resolvedSessionId);
    }
  }

  override async getOrganizations(): Promise<Organization[]> {
    throw new Error('Method not implemented.');
  }

  override getUserProfile(): Promise<UserProfile> {
    throw new Error('Method not implemented.');
  }

  override switchOrganization(organization: Organization): Promise<void> {
    throw new Error('Method not implemented.');
  }

  override getCurrentOrganization(): Promise<Organization | null> {
    throw new Error('Method not implemented.');
  }

  override isLoading(): boolean {
    return false;
  }

  override isSignedIn(sessionId?: string): Promise<boolean> {
    return this.asgardeo.isSignedIn(sessionId as string);
  }

  override getConfiguration(): T {
    return this.asgardeo.getConfigData() as unknown as T;
  }

  override signIn(
    options?: SignInOptions,
    sessionId?: string,
    onSignInSuccess?: (afterSignInUrl: string) => void,
  ): Promise<User>;
  override signIn(
    payload: EmbeddedSignInFlowHandleRequestPayload,
    request: EmbeddedFlowExecuteRequestConfig,
    sessionId?: string,
    onSignInSuccess?: (afterSignInUrl: string) => void,
  ): Promise<User>;
  override async signIn(...args: any[]): Promise<User> {
    const arg1 = args[0];
    const arg2 = args[1];
    const arg3 = args[2];
    const arg4 = args[3];

    if (typeof arg1 === 'object' && 'flowId' in arg1) {
      if (arg1.flowId === '') {
        const defaultSignInUrl: URL = new URL(
          await this.getAuthorizeRequestUrl({
            response_mode: 'direct',
            client_secret: '{{clientSecret}}',
          }),
        );

        console.log('[AsgardeoNextClient] Redirecting to sign-in URL:', defaultSignInUrl);

        return initializeEmbeddedSignInFlow({
          url: `${defaultSignInUrl.origin}${defaultSignInUrl.pathname}`,
          payload: Object.fromEntries(defaultSignInUrl.searchParams.entries()),
        });
      }

      return executeEmbeddedSignInFlow({
        payload: arg1,
        url: arg2.url,
      });
    }

    return this.asgardeo.signIn(
      arg4,
      arg3,
      arg1?.code,
      arg1?.session_state,
      arg1?.state,
      arg1 as any,
    ) as unknown as Promise<User>;
  }

  override signOut(options?: SignOutOptions, afterSignOut?: (afterSignOutUrl: string) => void): Promise<string>;
  override signOut(
    options?: SignOutOptions,
    sessionId?: string,
    afterSignOut?: (afterSignOutUrl: string) => void,
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

  /**
   * Gets the sign-in URL for authentication.
   * Ensures the client is initialized before making the call.
   *
   * @param customParams - Custom parameters to include in the sign-in URL.
   * @param userId - The user ID
   * @returns Promise that resolves to the sign-in URL
   */
  public async getAuthorizeRequestUrl(
    customParams: ExtendedAuthorizeRequestUrlParams,
    userId?: string,
  ): Promise<string> {
    await this.ensureInitialized();
    return this.asgardeo.getSignInUrl(customParams, userId);
  }

  /**
   * Gets the storage manager from the underlying Asgardeo client.
   * Ensures the client is initialized before making the call.
   *
   * @returns Promise that resolves to the storage manager
   */
  public async getStorageManager(): Promise<any> {
    await this.ensureInitialized();
    return this.asgardeo.getStorageManager();
  }
}

export default AsgardeoNextClient;
