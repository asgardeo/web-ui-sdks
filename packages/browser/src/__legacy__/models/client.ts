/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
  AuthClientConfig,
  BasicUserInfo,
  IsomorphicCrypto,
  CustomGrantConfig,
  StorageManager,
  IdTokenPayload,
  FetchResponse,
  OIDCEndpoints,
} from '@asgardeo/javascript';
import {
  HttpError,
  HttpRequestConfig,
  HttpResponse,
  MainThreadClientConfig,
  SignInConfig,
  WebWorkerClientConfig,
} from '.';
import {HttpClientInstance} from '../http-client';

export interface MainThreadClientInterface {
  setHttpRequestStartCallback(callback: () => void): void;
  setHttpRequestSuccessCallback(callback: (response: HttpResponse) => void): void;
  setHttpRequestFinishCallback(callback: () => void): void;
  setHttpRequestErrorCallback(callback: (error: HttpError) => void | Promise<void>): void;
  httpRequest(config: HttpRequestConfig): Promise<HttpResponse>;
  httpRequestAll(config: HttpRequestConfig[]): Promise<HttpResponse[] | undefined>;
  getHttpClient(): HttpClientInstance;
  enableHttpHandler(): boolean;
  disableHttpHandler(): boolean;
  signIn(
    config?: SignInConfig,
    authorizationCode?: string,
    sessionState?: string,
    afterSignInUrl?: string,
    tokenRequestConfig?: {
      params: Record<string, unknown>;
    },
  ): Promise<BasicUserInfo>;
  signOut(afterSignOutUrl?: string): Promise<boolean>;
  exchangeToken(config: CustomGrantConfig): Promise<BasicUserInfo | FetchResponse>;
  refreshAccessToken(): Promise<BasicUserInfo>;
  revokeAccessToken(): Promise<boolean>;
  getBasicUserInfo(): Promise<BasicUserInfo>;
  getDecodedIDToken(): Promise<IdTokenPayload>;
  getCrypto(): Promise<IsomorphicCrypto>;
  getConfigData(): Promise<AuthClientConfig<MainThreadClientConfig>>;
  getIDToken(): Promise<string>;
  getOpenIDProviderEndpoints(): Promise<OIDCEndpoints>;
  getAccessToken(): Promise<string>;
  getStorageManager(): Promise<StorageManager<MainThreadClientConfig>>;
  isAuthenticated(): Promise<boolean>;
  updateConfig(config: Partial<AuthClientConfig<MainThreadClientConfig>>): Promise<void>;
  trySignInSilently(
    additionalParams?: Record<string, string | boolean>,
    tokenRequestConfig?: {params: Record<string, unknown>},
  ): Promise<BasicUserInfo | boolean>;
  isSessionActive(): Promise<boolean>;
}

export interface WebWorkerClientInterface {
  exchangeToken(requestParams: CustomGrantConfig): Promise<FetchResponse | BasicUserInfo>;
  httpRequest<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>>;
  httpRequestAll<T = any>(configs: HttpRequestConfig[]): Promise<HttpResponse<T>[]>;
  enableHttpHandler(): Promise<boolean>;
  disableHttpHandler(): Promise<boolean>;
  initialize(): Promise<boolean>;
  signIn(
    params?: SignInConfig,
    authorizationCode?: string,
    sessionState?: string,
    afterSignInUrl?: string,
    tokenRequestConfig?: {
      params: Record<string, unknown>;
    },
  ): Promise<BasicUserInfo>;
  signOut(afterSignOutUrl?: string): Promise<boolean>;
  revokeAccessToken(): Promise<boolean>;
  getOpenIDProviderEndpoints(): Promise<OIDCEndpoints>;
  getBasicUserInfo(): Promise<BasicUserInfo>;
  getConfigData(): Promise<AuthClientConfig<WebWorkerClientConfig>>;
  getDecodedIDToken(): Promise<IdTokenPayload>;
  getDecodedIDPIDToken(): Promise<IdTokenPayload>;
  getCrypto(): Promise<IsomorphicCrypto>;
  getIDToken(): Promise<string>;
  isAuthenticated(): Promise<boolean>;
  setHttpRequestSuccessCallback(callback: (response: HttpResponse) => void): void;
  setHttpRequestErrorCallback(callback: (response: HttpError) => void | Promise<void>): void;
  setHttpRequestStartCallback(callback: () => void): void;
  setHttpRequestFinishCallback(callback: () => void): void;
  refreshAccessToken(): Promise<BasicUserInfo>;
  updateConfig(config: Partial<AuthClientConfig<WebWorkerClientConfig>>): Promise<void>;
  trySignInSilently(
    additionalParams?: Record<string, string | boolean>,
    tokenRequestConfig?: {params: Record<string, unknown>},
  ): Promise<BasicUserInfo | boolean>;
}
