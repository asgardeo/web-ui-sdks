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
import type {Plugin, Ref, App, Reactive} from 'vue';
import {reactive, ref} from 'vue';
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
    const AuthClient: AuthAPI = new AuthAPI();
    const isInitialized: Ref<boolean> = ref(false);
    const error: Ref<AsgardeoAuthException | null> = ref<AsgardeoAuthException | null>(null);

    const state: Reactive<AuthStateInterface> = reactive<AuthStateInterface>({...AuthClient.getState()});

    // This is for updating the state object with the latest values like dispatch in react
    const syncState = (): void => {
      const currentState: AuthStateInterface = AuthClient.getState();
      Object.assign(state, currentState);
    };

    const trySignInSilently = async (
      additionalParams?: Record<string, string | boolean>,
      tokenRequestConfig?: {params: Record<string, unknown>},
    ): Promise<boolean | BasicUserInfo> => {
      const result: boolean | BasicUserInfo = await AuthClient.trySignInSilently(additionalParams, tokenRequestConfig);
      syncState();
      return result;
    };

    const checkIsAuthenticated = async (): Promise<void> => {
      const isAuthenticatedState: boolean = await AuthClient.isAuthenticated();

      if (!isAuthenticatedState) {
        AuthClient.updateState({...state, isAuthenticated: false, isLoading: false});
        syncState();
        return;
      }

      const response: BasicUserInfo = await AuthClient.getBasicUserInfo();

      const stateToUpdate: AuthStateInterface = response
        ? {
            allowedScopes: response.allowedScopes,
            displayName: response.displayName,
            email: response.email,
            isAuthenticated: true,
            isLoading: false,
            sub: response.sub,
            username: response.username,
          }
        : {...state, isAuthenticated: isAuthenticatedState, isLoading: false};
      AuthClient.updateState(stateToUpdate);
      syncState();
    };

    const initialize = async (): Promise<void> => {
      if (isInitialized.value) return;

      try {
        const config: AuthVueConfig = {...defaultConfig, ...options} as AuthVueConfig;
        await AuthClient.init(config);
        syncState();
        isInitialized.value = true;

        AuthClient.on(Hooks.SignOut, () => {
          syncState();
        });

        if (state.isAuthenticated) {
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
              await AuthClient.signIn(
                {callOnlyOnRedirect: true},
                authParams?.authorizationCode,
                authParams?.sessionState,
                authParams?.state,
              );
              SPAUtils.removeAuthorizationCode();
              syncState();
            } catch (err) {
              error.value = err;
            }
            return;
          }
        }

        if (!config.disableAutoSignIn && (await AuthClient.isSessionActive())) {
          try {
            await AuthClient.signIn();
            syncState();
          } catch (err) {
            error.value = err;
          }
        }

        await checkIsAuthenticated();

        if (state.isAuthenticated) {
          return;
        }

        if (!config.disableTrySignInSilently) {
          try {
            await trySignInSilently();
            syncState();
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
      disableHttpHandler: (): Promise<boolean> => AuthClient.disableHttpHandler(),
      enableHttpHandler: (): Promise<boolean> => AuthClient.enableHttpHandler(),
      error: error.value,
      getAccessToken: (): Promise<string> => AuthClient.getAccessToken(),
      getBasicUserInfo: (): Promise<BasicUserInfo> => AuthClient.getBasicUserInfo(),
      getDecodedIDToken: (): Promise<DecodedIDTokenPayload> => AuthClient.getDecodedIDToken(),
      getHttpClient: (): Promise<HttpClientInstance> => AuthClient.getHttpClient(),
      getIDToken: (): Promise<string> => AuthClient.getIDToken(),
      getOIDCServiceEndpoints: (): Promise<OIDCEndpoints> => AuthClient.getOIDCServiceEndpoints(),
      httpRequest: (config: HttpRequestConfig): Promise<HttpResponse<any>> => AuthClient.httpRequest(config),
      httpRequestAll: (configs: HttpRequestConfig[]): Promise<HttpResponse<any>[]> =>
        AuthClient.httpRequestAll(configs),
      isAuthenticated: (): Promise<boolean> => AuthClient.isAuthenticated(),
      on: (hook: Hooks, callback: (response?: any) => void, id?: string): void => {
        if (hook === Hooks.CustomGrant && id) {
          AuthClient.on(hook, callback, id);
        } else {
          AuthClient.on(hook as Exclude<Hooks, Hooks.CustomGrant>, callback);
        }
      },
      refreshAccessToken: (): Promise<BasicUserInfo> => AuthClient.refreshAccessToken(),
      requestCustomGrant: async (
        config: CustomGrantConfig,
        callback?: (response: BasicUserInfo | FetchResponse<any>) => void,
      ): Promise<BasicUserInfo | FetchResponse<any>> => {
        try {
          const response: BasicUserInfo | FetchResponse<any> = await AuthClient.requestCustomGrant(config);
          callback?.(response);
          return response;
        } catch (err) {
          error.value = err;
          throw err;
        }
      },
      revokeAccessToken: (): Promise<boolean> => AuthClient.revokeAccessToken(),
      signIn: async (
        config?: SignInConfig,
        authorizationCode?: string,
        sessionState?: string,
        authState?: string,
        callback?: (response: BasicUserInfo) => void,
        tokenRequestConfig?: {params: Record<string, unknown>},
      ): Promise<BasicUserInfo> => {
        try {
          const result: BasicUserInfo = await AuthClient.signIn(
            config,
            authorizationCode,
            sessionState,
            authState,
            callback,
            tokenRequestConfig,
          );

          syncState();

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
          const result: boolean = await AuthClient.signOut();
          syncState();
          callback?.(result);
          return result;
        } catch (err) {
          error.value = err;
          throw err;
        }
      },
      state,
      trySignInSilently,
      updateConfig: async (config: Partial<AuthClientConfig<Config>>): Promise<void> => {
        await AuthClient.updateConfig(config);
        syncState();
      },
    };

    app.provide(ASGARDEO_INJECTION_KEY, authContext);
  },
};
