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
  flattenUserSchema,
  generateFlattenedUserProfile,
  UserProfile,
  SignInOptions,
  SignOutOptions,
  User,
  generateUserProfile,
  EmbeddedFlowExecuteResponse,
  SignUpOptions,
  EmbeddedFlowExecuteRequestPayload,
  AsgardeoRuntimeError,
  executeEmbeddedSignUpFlow,
  EmbeddedSignInFlowHandleRequestPayload,
  executeEmbeddedSignInFlow,
  Organization,
  IdToken,
  EmbeddedFlowExecuteRequestConfig,
  deriveOrganizationHandleFromBaseUrl,
  AllOrganizationsApiResponse,
  extractUserClaimsFromIdToken,
  TokenResponse,
  HttpRequestConfig,
  HttpResponse,
  Storage,
} from '@asgardeo/browser';
import AuthAPI from './__temp__/api';
import getMeOrganizations from './api/getMeOrganizations';
import getScim2Me from './api/getScim2Me';
import getSchemas from './api/getSchemas';
import {AsgardeoReactConfig} from './models/config';
import getAllOrganizations from './api/getAllOrganizations';

/**
 * Client for mplementing Asgardeo in React applications.
 * This class provides the core functionality for managing user authentication and sessions.
 *
 * @typeParam T - Configuration type that extends AsgardeoReactConfig.
 */
class AsgardeoReactClient<T extends AsgardeoReactConfig = AsgardeoReactConfig> extends AsgardeoBrowserClient<T> {
  private asgardeo: AuthAPI;
  private _isLoading: boolean = false;

  constructor() {
    super();

    // FIXME: This has to be the browser client from `@asgardeo/browser` package.
    this.asgardeo = new AuthAPI();
  }

  /**
   * Set the loading state of the client
   * @param loading - Boolean indicating if the client is in a loading state
   */
  private setLoading(loading: boolean): void {
    this._isLoading = loading;
  }

  /**
   * Wrap async operations with loading state management
   * @param operation - The async operation to execute
   * @returns Promise with the result of the operation
   */
  private async withLoading<T>(operation: () => Promise<T>): Promise<T> {
    this.setLoading(true);
    try {
      const result = await operation();
      return result;
    } finally {
      this.setLoading(false);
    }
  }

  override initialize(config: AsgardeoReactConfig, storage?: Storage): Promise<boolean> {
    let resolvedOrganizationHandle: string | undefined = config?.organizationHandle;

    if (!resolvedOrganizationHandle) {
      resolvedOrganizationHandle = deriveOrganizationHandleFromBaseUrl(config?.baseUrl);
    }

    return this.withLoading(async () => {
      return this.asgardeo.init({...config, organizationHandle: resolvedOrganizationHandle} as any);
    });
  }

  override async updateUserProfile(payload: any, userId?: string): Promise<User> {
    throw new Error('Not implemented');
  }

  override async getUser(options?: any): Promise<User> {
    try {
      let baseUrl = options?.baseUrl;

      if (!baseUrl) {
        const configData = await this.asgardeo.getConfigData();
        baseUrl = configData?.baseUrl;
      }

      const profile = await getScim2Me({baseUrl});
      const schemas = await getSchemas({baseUrl});

      return generateUserProfile(profile, flattenUserSchema(schemas));
    } catch (error) {
      return extractUserClaimsFromIdToken(await this.getDecodedIdToken());
    }
  }

  async getDecodedIdToken(sessionId?: string): Promise<IdToken> {
    return this.withLoading(async () => {
      return this.asgardeo.getDecodedIdToken(sessionId);
    });
  }

  async getUserProfile(options?: any): Promise<UserProfile> {
    return this.withLoading(async () => {
      try {
        let baseUrl = options?.baseUrl;

        if (!baseUrl) {
          const configData = await this.asgardeo.getConfigData();
          baseUrl = configData?.baseUrl;
        }

        const profile = await getScim2Me({baseUrl});
        const schemas = await getSchemas({baseUrl});

        const processedSchemas = flattenUserSchema(schemas);

        const output = {
          schemas: processedSchemas,
          flattenedProfile: generateFlattenedUserProfile(profile, processedSchemas),
          profile,
        };

        return output;
      } catch (error) {
        return {
          schemas: [],
          flattenedProfile: extractUserClaimsFromIdToken(await this.getDecodedIdToken()),
          profile: extractUserClaimsFromIdToken(await this.getDecodedIdToken()),
        };
      }
    });
  }

  override async getMyOrganizations(options?: any, sessionId?: string): Promise<Organization[]> {
    try {
      let baseUrl = options?.baseUrl;

      if (!baseUrl) {
        const configData = await this.asgardeo.getConfigData();
        baseUrl = configData?.baseUrl;
      }

      return getMeOrganizations({baseUrl});
    } catch (error) {
      throw new AsgardeoRuntimeError(
        `Failed to fetch the user's associated organizations: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'AsgardeoReactClient-getMyOrganizations-RuntimeError-001',
        'react',
        'An error occurred while fetching associated organizations of the signed-in user.',
      );
    }
  }

  override async getAllOrganizations(options?: any, sessionId?: string): Promise<AllOrganizationsApiResponse> {
    try {
      let baseUrl = options?.baseUrl;

      if (!baseUrl) {
        const configData = await this.asgardeo.getConfigData();
        baseUrl = configData?.baseUrl;
      }

      return getAllOrganizations({baseUrl});
    } catch (error) {
      throw new AsgardeoRuntimeError(
        `Failed to fetch all organizations: ${error instanceof Error ? error.message : String(error)}`,
        'AsgardeoReactClient-getAllOrganizations-RuntimeError-001',
        'react',
        'An error occurred while fetching all the organizations associated with the user.',
      );
    }
  }

  override async getCurrentOrganization(): Promise<Organization | null> {
    return this.withLoading(async () => {
      const idToken: IdToken = await this.getDecodedIdToken();
      return {
        orgHandle: idToken?.org_handle,
        name: idToken?.org_name,
        id: idToken?.org_id,
      };
    });
  }

  override async switchOrganization(organization: Organization, sessionId?: string): Promise<TokenResponse | Response> {
    return this.withLoading(async () => {
      try {
        const configData = await this.asgardeo.getConfigData();

        if (!organization.id) {
          throw new AsgardeoRuntimeError(
            'Organization ID is required for switching organizations',
            'react-AsgardeoReactClient-SwitchOrganizationError-001',
            'react',
            'The organization object must contain a valid ID to perform the organization switch.',
          );
        }

        const exchangeConfig = {
          attachToken: false,
          data: {
            client_id: '{{clientId}}',
            grant_type: 'organization_switch',
            scope: '{{scopes}}',
            switching_organization: organization.id,
            token: '{{accessToken}}',
          },
          id: 'organization-switch',
          returnsSession: true,
          signInRequired: true,
        };

        return (await this.asgardeo.exchangeToken(exchangeConfig, (user: User) => {})) as TokenResponse | Response;
      } catch (error) {
        throw new AsgardeoRuntimeError(
          `Failed to switch organization: ${error.message || error}`,
          'react-AsgardeoReactClient-SwitchOrganizationError-003',
          'react',
          'An error occurred while switching to the specified organization. Please try again.',
        );
      }
    });
  }

  override isLoading(): boolean {
    return this._isLoading || this.asgardeo.isLoading();
  }

  async isInitialized(): Promise<boolean> {
    return this.asgardeo.isInitialized();
  }

  override async isSignedIn(): Promise<boolean> {
    return await this.asgardeo.isSignedIn();
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
    return this.withLoading(async () => {
      const arg1 = args[0];
      const arg2 = args[1];

      if (typeof arg1 === 'object' && 'flowId' in arg1 && typeof arg2 === 'object' && 'url' in arg2) {
        return executeEmbeddedSignInFlow({
          payload: arg1,
          url: arg2.url,
        });
      }

      return (await this.asgardeo.signIn(arg1 as any)) as unknown as Promise<User>;
    });
  }

  override async signInSilently(options?: SignInOptions): Promise<User | boolean> {
    return this.withLoading(async () => {
      return this.asgardeo.signInSilently(options as Record<string, string | boolean>);
    });
  }

  override signOut(options?: SignOutOptions, afterSignOut?: (afterSignOutUrl: string) => void): Promise<string>;
  override signOut(
    options?: SignOutOptions,
    sessionId?: string,
    afterSignOut?: (afterSignOutUrl: string) => void,
  ): Promise<string>;
  override async signOut(...args: any[]): Promise<string> {
    if (args[1] && typeof args[1] !== 'function') {
      throw new Error('The second argument must be a function.');
    }

    const response: boolean = await this.asgardeo.signOut(args[1]);

    return Promise.resolve(String(response));
  }

  override async signUp(options?: SignUpOptions): Promise<void>;
  override async signUp(payload: EmbeddedFlowExecuteRequestPayload): Promise<EmbeddedFlowExecuteResponse>;
  override async signUp(...args: any[]): Promise<void | EmbeddedFlowExecuteResponse> {
    if (args.length === 0) {
      throw new AsgardeoRuntimeError(
        'No arguments provided for signUp method.',
        'react-AsgardeoReactClient-ValidationError-001',
        'react',
        'The signUp method requires at least one argument, either a SignUpOptions object or an EmbeddedFlowExecuteRequestPayload.',
      );
    }

    const firstArg = args[0];

    if (typeof firstArg === 'object' && 'flowType' in firstArg) {
      const configData = await this.asgardeo.getConfigData();
      const baseUrl: string = configData?.baseUrl;

      return executeEmbeddedSignUpFlow({
        baseUrl,
        payload: firstArg as EmbeddedFlowExecuteRequestPayload,
      });
    }
    throw new AsgardeoRuntimeError(
      'Not implemented',
      'react-AsgardeoReactClient-ValidationError-002',
      'react',
      'The signUp method with SignUpOptions is not implemented in the React client.',
    );
  }

  async request(requestConfig?: HttpRequestConfig): Promise<HttpResponse<any>> {
    return this.asgardeo.httpRequest(requestConfig);
  }

  async requestAll(requestConfigs?: HttpRequestConfig[]): Promise<HttpResponse<any>[]> {
    return this.asgardeo.httpRequestAll(requestConfigs);
  }

  override async getAccessToken(sessionId?: string): Promise<string> {
    return this.withLoading(async () => {
      return this.asgardeo.getAccessToken(sessionId);
    });
  }
}

export default AsgardeoReactClient;
