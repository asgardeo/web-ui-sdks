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
} from '@asgardeo/browser';
import AuthAPI from './__temp__/api';
import {AsgardeoReactConfig} from './models/config';
import getMeProfile from './api/scim2/getMeProfile';
import getSchemas from './api/scim2/getSchemas';

/**
 * Client for mplementing Asgardeo in React applications.
 * This class provides the core functionality for managing user authentication and sessions.
 *
 * @typeParam T - Configuration type that extends AsgardeoReactConfig.
 */
class AsgardeoReactClient<T extends AsgardeoReactConfig = AsgardeoReactConfig> extends AsgardeoBrowserClient<T> {
  private asgardeo: AuthAPI;

  constructor() {
    super();

    // FIXME: This has to be the browser client from `@asgardeo/browser` package.
    this.asgardeo = new AuthAPI();
  }

  override initialize(config: T): Promise<boolean> {
    const scopes: string[] = Array.isArray(config.scopes) ? config.scopes : config.scopes.split(' ');

    return this.asgardeo.init({
      baseUrl: config.baseUrl,
      clientId: config.clientId,
      afterSignInUrl: config.afterSignInUrl,
      scopes: [...scopes, 'internal_login'],
    });
  }

  override async getUser(): Promise<User> {
    const baseUrl = await (await this.asgardeo.getConfigData()).baseUrl;
    const profile = await getMeProfile({url: `${baseUrl}/scim2/Me`});
    const schemas = await getSchemas({url: `${baseUrl}/scim2/Schemas`});

    return generateUserProfile(profile, flattenUserSchema(schemas));
  }

  async getUserProfile(): Promise<UserProfile> {
    const baseUrl: string = (await this.asgardeo.getConfigData()).baseUrl;

    const profile = await getMeProfile({url: `${baseUrl}/scim2/Me`});
    const schemas = await getSchemas({url: `${baseUrl}/scim2/Schemas`});

    console.log('Raw Schemas:', JSON.stringify(schemas, null, 2));

    const processedSchemas = flattenUserSchema(schemas);

    console.log('Processed Schemas:', JSON.stringify(processedSchemas, null, 2));

    return {
      schemas: processedSchemas,
      flattenedProfile: generateFlattenedUserProfile(profile, processedSchemas),
      profile,
    };
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

  override signOut(options?: SignOutOptions, afterSignOut?: (redirectUrl: string) => void): Promise<string>;
  override signOut(
    options?: SignOutOptions,
    sessionId?: string,
    afterSignOut?: (redirectUrl: string) => void,
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
      const baseUrl: string = (await this.asgardeo.getConfigData())?.baseUrl;

      return executeEmbeddedSignUpFlow({
        baseUrl,
        payload: firstArg as EmbeddedFlowExecuteRequestPayload,
      });
    } else {
      throw new AsgardeoRuntimeError(
        'Not implemented',
        'react-AsgardeoReactClient-ValidationError-002',
        'react',
        'The signUp method with SignUpOptions is not implemented in the React client.',
      );
    }
  }
}

export default AsgardeoReactClient;
