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
import {AuthVueConfig} from '@/types';
import type {Plugin, Ref, App} from 'vue';
import {ref, computed} from 'vue';

export type AsgardeoPluginOptions = AuthVueConfig;

export interface AsgardeoAuthContext {
  auth: AsgardeoSPAClient;
  getAccessToken: () => Promise<string>;
  getBasicUserInfo: () => Promise<BasicUserInfo>;
  isAuthenticated: Ref<boolean>;
  isInitialized: Ref<boolean>;
  signIn: () => Promise<BasicUserInfo | undefined>;
  signOut: () => Promise<boolean>;
  user: Ref<BasicUserInfo | null>;
}

export const ASGARDEO_INJECTION_KEY: symbol = Symbol('asgardeo');

export const asgardeoPlugin: Plugin = {
  install(app: App, options: AsgardeoPluginOptions): void {
    const auth = AsgardeoSPAClient.getInstance();
    const isInitialized = ref(false);
    const isAuthenticated = ref(false);
    const user = ref<BasicUserInfo | null>(null);
    const error = ref<any>(null);
    const isLoading = ref(true);
    const initializationAttempted = ref(false);

    const initialize = async (): Promise<void> => {
      if (initializationAttempted.value || isInitialized.value) return;
      initializationAttempted.value = true;
      isLoading.value = true;

      await auth.initialize(options);
      isInitialized.value = true;

      const urlParams = new URLSearchParams(window.location.search);
      const authorizationCode = urlParams.get('code');
      const state = urlParams.get('state');
      const sessionState = urlParams.get('session_state');

      if (authorizationCode && sessionState && state) {
        try {
          const result = await auth.signIn({callOnlyOnRedirect: true}, authorizationCode, sessionState, state);

          if (result) {
            user.value = result;
            isAuthenticated.value = true;
            error.value = null;
          }
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.error('Sign-in failed during initialization', err);
          error.value = err;
        }
      }
    };

    initialize();

    const authContext: AsgardeoAuthContext = {
      auth,
      getAccessToken: (): Promise<string> => auth.getAccessToken(),
      getBasicUserInfo: () : Promise<BasicUserInfo>=> auth.getBasicUserInfo(),
      isAuthenticated: computed(() => isAuthenticated.value),
      isInitialized: computed(() => isInitialized.value),
      signIn: async (): Promise<BasicUserInfo | undefined> => {
        try {
          const result = await auth.signIn();
          if (result) {
            user.value = result;
            isAuthenticated.value = true;
          }
          return result;
        } catch (err) {
          console.error('Sign-in failed', err);
          throw err;
        }
      },
      signOut: async (): Promise<boolean> => {
        try {
          const result = await auth.signOut();
          if (result) {
            user.value = null;
            isAuthenticated.value = false;
          }
          return result;
        } catch (err) {
          console.error('Sign-out failed', err);
          throw err;
        }
      },
      user: computed(() => user.value),
    };

    app.provide(ASGARDEO_INJECTION_KEY, authContext);
  },
};
