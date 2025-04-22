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

import {AsgardeoNodeClient, type AuthClientConfig} from '@asgardeo/auth-node';
import {useRuntimeConfig} from '#imports';
import type {ModuleOptions} from '~/src/runtime/types';

type PublicAsgardeoConfig = Pick<
  ModuleOptions,
  'clientID' | 'baseUrl' | 'signInRedirectURL' | 'signOutRedirectURL' | 'scope'
>;

let authClientInstance: AsgardeoNodeClient<any> | null = null;

export function getAsgardeoSdkInstance(): AsgardeoNodeClient<any> {
  if (authClientInstance) {
    return authClientInstance;
  }

  const config: PublicAsgardeoConfig = useRuntimeConfig().public.asgardeoAuth;

  if (!config || !config.clientID || !config.baseUrl || !config.signInRedirectURL || !config.signOutRedirectURL) {
    throw new Error(
      'Asgardeo SDK configuration is incomplete in runtimeConfig. Check module setup and nuxt.config.ts. Required: clientID, serverOrigin (maps to baseUrl), signInRedirectURL, signOutRedirectURL.',
    );
  }

  const sdkConfig: AuthClientConfig = {
    baseUrl: config.baseUrl,
    clientID: config.clientID,
    clientSecret: useRuntimeConfig().asgardeoAuth.clientSecret as string,
    scope: config.scope,
    signInRedirectURL: config.signInRedirectURL,
    signOutRedirectURL: config.signOutRedirectURL,
    sendCookiesInRequests: false
  };

  try {
    authClientInstance = new AsgardeoNodeClient(sdkConfig);
  } catch (error) {
    throw new Error('Asgardeo SDK Initialization failed. Check configuration and SDK compatibility.');
  }

  return authClientInstance;
}
