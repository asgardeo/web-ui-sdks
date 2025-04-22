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

import {AsgardeoNodeClient} from '@asgardeo/auth-node';
import type {RuntimeConfig} from 'nuxt/schema';
import type {ModuleOptions} from './runtime/types';
import {type NuxtApp} from '#app';
import {defineNuxtPlugin, useRuntimeConfig} from '#imports';

type PublicAsgardeoConfig = Pick<
  ModuleOptions,
  'clientID' | 'baseUrl' | 'signInRedirectURL' | 'signOutRedirectURL' | 'scope'
>;
type PrivateAsgardeoConfig = {
  clientSecret: string;
};
export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const runtimeConfig: RuntimeConfig = useRuntimeConfig();

  const publicConfig: PublicAsgardeoConfig = runtimeConfig.public.asgardeoAuth;
  const privateConfig: PrivateAsgardeoConfig = runtimeConfig.asgardeoAuth; // server-only

  const sdk: AsgardeoNodeClient<any> = new AsgardeoNodeClient({
    baseUrl: publicConfig.baseUrl,
    clientID: publicConfig.clientID,
    clientSecret: privateConfig.clientSecret,
    scope: publicConfig.scope,
    signInRedirectURL: publicConfig.signInRedirectURL,
    signOutRedirectURL: publicConfig.signOutRedirectURL,
  });

  nuxtApp.provide('auth', sdk);
});
