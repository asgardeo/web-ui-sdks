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
  IdTokenPayload,
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
import AuthAPI from '../auth-api';
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

    /* eslint-disable no-useless-catch */
    const withStateSync = async <T>(cb: () => T | Promise<T>, refreshState: boolean = true): Promise<T> => {
      let result: T;
      try {
        result = await cb();
        return result;
      } catch (err) {
        throw err;
      } finally {
        if (refreshState) {
          const currentState: AuthStateInterface = AuthClient.getState();
          Object.assign(state, currentState);
        }
      }
    };

    const trySignInSilently = async (
      additionalParams?: Record<string, string | boolean>,
      tokenRequestConfig?: {params: Record<string, unknown>},
    ): Promise<boolean | BasicUserInfo> =>
      withStateSync(async () => AuthClient.trySignInSilently(additionalParams, tokenRequestConfig));

    const checkIsAuthenticated = async (): Promise<void> =>
      withStateSync(async () => {
        const isAuthenticatedState: boolean = await AuthClient.isSignedIn();
        if (!isAuthenticatedState) {
          AuthClient.updateState({...state, isSignedIn: false, isLoading: false});
          return;
        }
        const response: BasicUserInfo = await AuthClient.getUser();
        const stateToUpdate: AuthStateInterface = response
          ? {
              allowedScopes: response.allowedScopes,
              displayName: response.displayName,
              email: response.email,
              isSignedIn: true,
              isLoading: false,
              sub: response.sub,
              username: response.username,
            }
          : {...state, isSignedIn: isAuthenticatedState, isLoading: false};
        AuthClient.updateState(stateToUpdate);
      });

    const initialize = async (): Promise<void> => {
      await withStateSync(async () => {
        if (isInitialized.value) return;

        try {
          const config: AuthVueConfig = {...defaultConfig, ...options} as AuthVueConfig;
          await AuthClient.init(config);
          isInitialized.value = true;

          if (!config.skipRedirectCallback) {
            const url: URL = new URL(window.location.href);
            const authParams: AuthParams = null;

            if (
              (SPAUtils.hasAuthSearchParamsInURL() &&
                new URL(url.origin + url.pathname).toString() === new URL(config?.afterSignInUrl).toString()) ||
              authParams?.authorizationCode ||
              url.searchParams.get('error')
            ) {
              await AuthClient.signIn(
                {callOnlyOnRedirect: true},
                authParams?.authorizationCode,
                authParams?.sessionState,
                authParams?.state,
              );
              SPAUtils.removeAuthorizationCode();
              return;
            }
          }

          if (!config.disableAutoSignIn && (await AuthClient.isSessionActive())) {
            await AuthClient.signIn();
          }

          await checkIsAuthenticated();

          if (state.isSignedIn) {
            return;
          }

          if (!config.disableTrySignInSilently) {
            await trySignInSilently();
          }
        } catch (err) {
          error.value = err;
          throw err;
        }
      });
    };

    initialize();

    const authContext: AuthContextInterface = {
      disableHttpHandler: (): Promise<boolean> => AuthClient.disableHttpHandler(),
      enableHttpHandler: (): Promise<boolean> => AuthClient.enableHttpHandler(),
      error: error.value,
      getAccessToken: (): Promise<string> => AuthClient.getAccessToken(),
      getUser: (): Promise<BasicUserInfo> => AuthClient.getUser(),
      getDecodedIdToken: (): Promise<IdTokenPayload> => AuthClient.getDecodedIdToken(),
      getHttpClient: (): Promise<HttpClientInstance> => AuthClient.getHttpClient(),
      getIdToken: (): Promise<string> => AuthClient.getIdToken(),
      getOpenIDProviderEndpoints: (): Promise<OIDCEndpoints> => AuthClient.getOpenIDProviderEndpoints(),
      httpRequest: (config: HttpRequestConfig): Promise<HttpResponse<any>> => AuthClient.httpRequest(config),
      httpRequestAll: (configs: HttpRequestConfig[]): Promise<HttpResponse<any>[]> =>
        AuthClient.httpRequestAll(configs),
      isSignedIn: (): Promise<boolean> => AuthClient.isSignedIn(),
      on: (hook: Hooks, callback: (response?: any) => void, id?: string): void => {
        if (hook === Hooks.CustomGrant && id) {
          AuthClient.on(hook, callback, id);
        } else {
          AuthClient.on(hook as Exclude<Hooks, Hooks.CustomGrant>, callback);
        }
      },
      refreshAccessToken: (): Promise<BasicUserInfo> => AuthClient.refreshAccessToken(),
      exchangeToken: async (
        config: CustomGrantConfig,
        callback?: (response: BasicUserInfo | FetchResponse<any>) => void,
      ): Promise<BasicUserInfo | FetchResponse<any>> => {
        try {
          const response: BasicUserInfo | FetchResponse<any> = await AuthClient.exchangeToken(config);
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
      ): Promise<BasicUserInfo> =>
        withStateSync(async () => {
          const result: BasicUserInfo = await AuthClient.signIn(
            config,
            authorizationCode,
            sessionState,
            authState,
            callback,
            tokenRequestConfig,
          );

          if (result) {
            error.value = null;
            callback?.(result);
          }
          return result;
        }),
      signOut: async (callback?: (response: boolean) => void): Promise<boolean> =>
        withStateSync(async () => {
          const result: boolean = await AuthClient.signOut();
          callback?.(result);
          return result;
        }),
      state,
      trySignInSilently,
      reInitialize: async (config: Partial<AuthClientConfig<Config>>): Promise<void> =>
        withStateSync(async () => {
          await AuthClient.reInitialize(config);
        }),
    };

    app.provide(ASGARDEO_INJECTION_KEY, authContext);
  },
};
