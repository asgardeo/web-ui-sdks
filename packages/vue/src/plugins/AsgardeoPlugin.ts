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
  SPAUtils,
  type BasicUserInfo,
} from '@asgardeo/auth-spa';
import type {Plugin, Ref, App} from 'vue';
import {ref} from 'vue';
import AuthAPI from '../api';
import type {AuthContextInterface, AuthParams, AuthStateInterface, AuthVueConfig} from '../types';

export type AsgardeoPluginOptions = AuthVueConfig;

/**
 * Default `AuthVueConfig` config.
 */
const defaultConfig: Partial<AuthVueConfig> = {
  disableAutoSignIn: true,
  disableTrySignInSilently: true,
};

export const ASGARDEO_INJECTION_KEY: symbol = Symbol('asgardeo');

export const asgardeoPlugin: Plugin = {
  install(app: App, options: AsgardeoPluginOptions): void {
    const authClient: AuthAPI = new AuthAPI();
    const isInitialized: Ref<boolean> = ref(false);
    const error = ref<AsgardeoAuthException | null>(null);

    const initialize = async (): Promise<void> => {
      if (isInitialized.value) return;

      try {
        const config: AuthVueConfig = {...defaultConfig, ...options} as AuthVueConfig;
        await authClient.init(config);
        isInitialized.value = true;

        let isSignedOut: boolean = false;
        authClient.on(Hooks.SignOut, () => {
          isSignedOut = true;
        });

        if (authClient.getState().isAuthenticated) {
          return;
        }

        if (!config.skipRedirectCallback) {
          const authParams: AuthParams = null;

          const url: URL = new URL(window.location.href);

          if (
            (SPAUtils.hasAuthSearchParamsInURL() &&
              new URL(url.origin + url.pathname).toString() === new URL(config?.signInRedirectURL).toString()) ||
            authParams?.authorizationCode ||
            url.searchParams.get('error')
          ) {
            try {
              await authClient.signIn(
                {callOnlyOnRedirect: true},
                authParams?.authorizationCode,
                authParams?.sessionState,
                authParams?.state,
              );
              SPAUtils.removeAuthorizationCode();
            } catch (err) {
              error.value = err;
            }
            return;
          }
        }

        if (!config.disableAutoSignIn && (await authClient.isSessionActive())) {
          try {
            await authClient.signIn();
          } catch (err) {
            error.value = err;
          }
        }

        if (!config.disableTrySignInSilently && !isSignedOut) {
          try {
            await authClient.trySignInSilently();
            error.value = null;
          } catch (err) {
            if (err?.code) {
              error.value = err;
            }
          }
        }
      } catch (err) {
        error.value = err;
      }
    };

    initialize();

    const authContext: AuthContextInterface = {
      disableHttpHandler: (): Promise<boolean> => authClient.disableHttpHandler(),
      enableHttpHandler: (): Promise<boolean> => authClient.enableHttpHandler(),
      error: error.value,
      getAccessToken: (): Promise<string> => authClient.getAccessToken(),
      getBasicUserInfo: (): Promise<BasicUserInfo> => authClient.getBasicUserInfo(),
      getDecodedIDToken: (): Promise<DecodedIDTokenPayload> => authClient.getDecodedIDToken(),
      getHttpClient: (): Promise<HttpClientInstance> => Promise.resolve(authClient.getHttpClient()),
      getIDToken: (): Promise<string> => authClient.getIDToken(),
      getOIDCServiceEndpoints: (): Promise<OIDCEndpoints> => authClient.getOIDCServiceEndpoints(),
      httpRequest: (config: HttpRequestConfig): Promise<HttpResponse<any>> => authClient.httpRequest(config),
      httpRequestAll: (configs: HttpRequestConfig[]): Promise<HttpResponse<any>[]> =>
        authClient.httpRequestAll(configs),
      isAuthenticated: (): Promise<boolean> => authClient.isAuthenticated(),
      on: (hook: Hooks, callback: (response?: any) => void, id?: string): void => {
        if (hook === Hooks.CustomGrant && id) {
          authClient.on(hook, callback, id);
        } else {
          authClient.on(hook as Exclude<Hooks, Hooks.CustomGrant>, callback);
        }
      },
      refreshAccessToken: (): Promise<BasicUserInfo> => authClient.refreshAccessToken(),
      requestCustomGrant: async (
        config: CustomGrantConfig,
        callback?: (response: BasicUserInfo | FetchResponse<any>) => void,
      ): Promise<BasicUserInfo | FetchResponse<any>> => {
        try {
          const response: BasicUserInfo | FetchResponse<any> = await authClient.requestCustomGrant(config);
          callback?.(response);
          return response;
        } catch (err) {
          error.value = err;
          throw err;
        }
      },
      revokeAccessToken: (): Promise<boolean> => authClient.revokeAccessToken(),
      signIn: async (
        config?: SignInConfig,
        authorizationCode?: string,
        sessionState?: string,
        state?: string,
        callback?: (response: BasicUserInfo) => void,
        tokenRequestConfig?: {params: Record<string, unknown>},
      ): Promise<BasicUserInfo> => {
        try {
          const result: BasicUserInfo = await authClient.signIn(
            config,
            authorizationCode,
            sessionState,
            state,
            callback,
            tokenRequestConfig,
          );

          if (result) {
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
          const result: boolean = await authClient.signOut();
          callback?.(result);
          return result;
        } catch (err) {
          error.value = err;
          throw err;
        }
      },
      state: {} as AuthStateInterface,
      trySignInSilently: async (
        additionalParams?: Record<string, string | boolean>,
        tokenRequestConfig?: {params: Record<string, unknown>},
      ): Promise<boolean | BasicUserInfo> => {
        try {
          const response: boolean | BasicUserInfo = await authClient.trySignInSilently(
            additionalParams,
            tokenRequestConfig,
          );
          return response;
        } catch (err) {
          error.value = err;
          throw err;
        }
      },
      updateConfig: (config: Partial<AuthClientConfig<Config>>): Promise<void> => authClient.updateConfig(config),
    };

    app.provide(ASGARDEO_INJECTION_KEY, authContext);
  },
};
