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

import {AsgardeoSPAClient, type BasicUserInfo} from '@asgardeo/auth-spa';
import {AuthSPAClientConfig} from '@asgardeo/auth-spa';
import type {Plugin, Ref, App} from 'vue';
import {ref, computed} from 'vue';

export type AsgardeoPluginOptions = AuthSPAClientConfig;

export interface AsgardeoAuthContext {
  auth: AsgardeoSPAClient;
  getAccessToken: () => Promise<string>;
  getBasicUserInfo: () => Promise<BasicUserInfo>;
  isAuthenticated: Ref<boolean>;
  isInitialized: Ref<boolean>;
  signIn: () => Promise<BasicUserInfo | undefined>;
  signOut: () => Promise<Boolean>;
  user: Ref<BasicUserInfo | null>;
}

export const ASGARDEO_INJECTION_KEY: symbol = Symbol('asgardeo');

export const asgardeoPlugin: Plugin = {
  install(app: App, options: AsgardeoPluginOptions): void {
    const auth: AsgardeoSPAClient = AsgardeoSPAClient.getInstance();
    const isInitialized: Ref<boolean> = ref(false);
    const isAuthenticated: Ref<boolean> = ref(false);
    const user: Ref<BasicUserInfo | null> = ref<BasicUserInfo | null>(null);

    const initialize = async (): Promise<void> => {
      if (isInitialized.value) return;

      await auth?.initialize(options);
      isInitialized.value = true;

      isAuthenticated.value = (await auth?.isAuthenticated()) ?? false;

      if (isAuthenticated.value) {
        user.value = (await auth?.getBasicUserInfo()) ?? null;
      }
    };
    initialize();

    const authContext: AsgardeoAuthContext = {
      auth,
      getAccessToken: (): Promise<string> => auth?.getAccessToken(),
      getBasicUserInfo: (): Promise<BasicUserInfo> => auth?.getBasicUserInfo(),
      isAuthenticated: computed(() => isAuthenticated.value),
      isInitialized: computed(() => isInitialized.value),
      signIn: (): Promise<BasicUserInfo | undefined> => auth?.signIn(),
      signOut: (): Promise<Boolean> => auth?.signOut(),
      user: computed(() => user.value),
    };

    app.provide(ASGARDEO_INJECTION_KEY, authContext);
  },
};
