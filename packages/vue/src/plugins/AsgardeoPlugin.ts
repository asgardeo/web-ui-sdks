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
  AsgardeoAuthException,
  AsgardeoSPAClient,
  AuthClientConfig,
  Config,
  CustomGrantConfig,
  DecodedIDTokenPayload,
  FetchResponse,
  Hooks,
  HttpClientInstance,
  HttpRequestConfig,
  HttpResponse,
  OIDCEndpoints,
  SignInConfig,
  type BasicUserInfo,
} from '@asgardeo/auth-spa';
import type {Plugin, Ref, App} from 'vue';
import {ref, computed} from 'vue';
import type {AuthContextInterface, AuthStateInterface, AuthVueConfig} from '../types';

export type AsgardeoPluginOptions = AuthVueConfig;

export const ASGARDEO_INJECTION_KEY: symbol = Symbol('asgardeo');

export const asgardeoPlugin: Plugin = {
  install(app: App, options: AsgardeoPluginOptions): void {
    const auth: AsgardeoSPAClient = AsgardeoSPAClient.getInstance();
    const isInitialized: Ref<boolean> = ref(false);
    const isAuthenticated: Ref<boolean> = ref(false);
    const user: Ref<BasicUserInfo | null> = ref<BasicUserInfo | null>(null);
    const error: Ref<AsgardeoAuthException | null> = ref(null);
    const isLoading: Ref<boolean> = ref(true);
    const initializationAttempted: Ref<boolean> = ref(false);

    const initialize = async (): Promise<void> => {
      if (initializationAttempted.value || isInitialized.value) return;
      initializationAttempted.value = true;
      isLoading.value = true;

      try {
        await auth.initialize(options);
        isInitialized.value = true;

        let isSignedOut = false;
        auth.on(Hooks.SignOut, () => {
          isSignedOut = true;
          isAuthenticated.value = false;
          user.value = null;
        });

        if (isAuthenticated.value) {
          isLoading.value = false;
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');
        const state = urlParams.get('state');
        const sessionState = urlParams.get('session_state');
        const errorParam = urlParams.get('error');

        if (errorParam) {
          error.value = {code: errorParam, message: urlParams.get('error_description')};
          window.history.replaceState({}, document.title, window.location.pathname);
          isLoading.value = false;
          return;
        }

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
            error.value = err;
          } finally {
            isLoading.value = false;
          }
          return;
        }

        // if (!options.disableAutoSignIn && (await auth.isSessionActive())) {
        //   try {
        //     await auth.signIn();
        //   } catch (err) {
        //     error.value = err;
        //   }
        // }

        if (!options.disableTrySignInSilently && !isSignedOut) {
          try {
            await auth.trySignInSilently();
            error.value = null;
          } catch (err) {
            if (err?.code) {
              error.value = err;
            }
          }
        }
      } catch (error) {
        console.error('Initialization failed', error);
        error.value = error;
      } finally {
        isLoading.value = false;
      }
    };

    initialize();

    const authContext: AuthContextInterface = {
      getAccessToken: (): Promise<string> => auth.getAccessToken(),
      getBasicUserInfo: (): Promise<BasicUserInfo> => auth.getBasicUserInfo(),
      httpRequest: (config: HttpRequestConfig): Promise<HttpResponse<any>> => auth.httpRequest(config),
      httpRequestAll: (configs: HttpRequestConfig[]): Promise<HttpResponse<any>[]> => auth.httpRequestAll(configs),
      requestCustomGrant: async (
        config: CustomGrantConfig,
        callback?: (response: BasicUserInfo | FetchResponse<any>) => void,
      ): Promise<BasicUserInfo | FetchResponse<any>> => {
        try {
          const response_1 = await auth
            .requestCustomGrant(config);
          callback?.(response_1);
          return response_1;
        } catch (err) {
          error.value = err;
          throw err;
        }
      },
      getHttpClient: (): Promise<HttpClientInstance> => Promise.resolve(auth.getHttpClient()),
      revokeAccessToken: (): Promise<boolean> => auth.revokeAccessToken(),
      getOIDCServiceEndpoints: (): Promise<OIDCEndpoints> => auth.getOIDCServiceEndpoints(),
      getDecodedIDToken: (): Promise<DecodedIDTokenPayload> => auth.getDecodedIDToken(),
      getIDToken: (): Promise<string> => auth.getIDToken(),
      refreshAccessToken: (): Promise<BasicUserInfo> => auth.refreshAccessToken(),
      enableHttpHandler: (): Promise<boolean> => auth.enableHttpHandler(),
      disableHttpHandler: (): Promise<boolean> => auth.disableHttpHandler(),
      updateConfig: (config: Partial<AuthClientConfig<Config>>): Promise<void> => auth.updateConfig(config),
      trySignInSilently: async (
        additionalParams?: Record<string, string | boolean>,
        tokenRequestConfig?: {params: Record<string, unknown>},
      ): Promise<boolean | BasicUserInfo> => {
        try {
          const response = await auth
            .trySignInSilently(additionalParams, tokenRequestConfig);
          if (typeof response !== 'boolean') {
            user.value = response;
            isAuthenticated.value = true;
          }
          return response;
        } catch (err) {
          error.value = err;
          throw err;
        }
      },
      signIn: async (
        config?: SignInConfig,
        authorizationCode?: string,
        sessionState?: string,
        state?: string,
        callback?: (response: BasicUserInfo) => void,
        tokenRequestConfig?: {params: Record<string, unknown>},
      ): Promise<BasicUserInfo> => {
        try {
          const result = await auth.signIn(config, authorizationCode, sessionState, state, tokenRequestConfig);

          if (result) {
            user.value = result;
            isAuthenticated.value = true;
            error.value = null;
            callback?.(result);
          }
          return result;
        } catch (err) {
          error.value = err;
          throw err;
        }
      },
      signOut: async (callback?: (response: boolean) => void): Promise<boolean> => {
        try {
          const result = await auth.signOut();
          user.value = null;
          isAuthenticated.value = false;
          callback?.(result);
          return result;
        } catch (err) {
          error.value = err;
          throw err;
        }
      },

      state: {} as AuthStateInterface,
      // error: computed(() => error.value as AsgardeoAuthException | null),
      isAuthenticated: (): Ref<boolean> => isAuthenticated,
      on: (hook: Hooks, callback: (response?: any) => void, id?: string): void => {
        if (hook === Hooks.CustomGrant && id) {
          auth.on(hook, callback, id);
        } else {
          auth.on(hook as Exclude<Hooks, Hooks.CustomGrant>, callback);
        }
      },
    };

    app.provide(ASGARDEO_INJECTION_KEY, authContext);
  },
};
