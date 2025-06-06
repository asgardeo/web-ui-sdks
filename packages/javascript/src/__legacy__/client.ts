/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {AuthenticationCore} from './core';
import {DataLayer} from './data';
import {
  AuthClientConfig,
  BasicUserInfo,
  CustomGrantConfig,
  FetchResponse,
  GetAuthURLConfig,
} from './models';
import {Crypto} from '../models/crypto';
import {TokenResponse} from '../models/token';
import {IdTokenPayload} from '../models/id-token';
import {OIDCEndpoints} from '../models/oidc-endpoints';
import {Store} from '../models/store';
import {ResponseMode} from '../models/oauth-response';
import ScopeConstants from '../constants/ScopeConstants';
import OIDCDiscoveryConstants from '../constants/OIDCDiscoveryConstants';
import OIDCRequestConstants from '../constants/OIDCRequestConstants';
import { IsomorphicCrypto } from '../IsomorphicCrypto';

/**
 * Default configurations.
 */
const DefaultConfig: Partial<AuthClientConfig<unknown>> = {
  clockTolerance: 300,
  enablePKCE: true,
  responseMode: ResponseMode.Query,
  scope: [ScopeConstants.OPENID],
  sendCookiesInRequests: true,
  validateIDToken: true,
  validateIDTokenIssuer: true,
};

/**
 * This class provides the necessary methods needed to implement authentication.
 */
export class AsgardeoAuthClient<T> {
  private _dataLayer!: DataLayer<T>;
  private _authenticationCore!: AuthenticationCore<T>;

  private static _instanceID: number;
  static _authenticationCore: any;

  /**
   * This is the constructor method that returns an instance of the .
   *
   * @param store - The store object.
   *
   * @example
   * ```
   * const _store: Store = new DataStore();
   * const auth = new AsgardeoAuthClient<CustomClientConfig>(_store);
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#constructor}
   *
   * @preserve
   */
  public constructor() {}

  /**
   *
   * This method initializes the SDK with the config data.
   *
   * @param config - The config object to initialize with.
   *
   * @example
   * const config = \{
   *     signInRedirectURL: "http://localhost:3000/sign-in",
   *     clientID: "client ID",
   *     baseUrl: "https://localhost:9443"
   * \}
   *
   * await auth.initialize(config);
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#initialize}
   *
   * @preserve
   */
  public async initialize(
    config: AuthClientConfig<T>,
    store: Store,
    cryptoUtils: Crypto,
    instanceID?: number,
  ): Promise<void> {
    const clientId: string = config.clientID;

    if (!AsgardeoAuthClient._instanceID) {
      AsgardeoAuthClient._instanceID = 0;
    } else {
      AsgardeoAuthClient._instanceID += 1;
    }

    if (instanceID) {
      AsgardeoAuthClient._instanceID = instanceID;
    }

    if (!clientId) {
      this._dataLayer = new DataLayer<T>(`instance_${AsgardeoAuthClient._instanceID}`, store);
    } else {
      this._dataLayer = new DataLayer<T>(`instance_${AsgardeoAuthClient._instanceID}-${clientId}`, store);
    }

    this._authenticationCore = new AuthenticationCore(this._dataLayer, cryptoUtils);
    AsgardeoAuthClient._authenticationCore = new AuthenticationCore(this._dataLayer, cryptoUtils);

    await this._dataLayer.setConfigData({
      ...DefaultConfig,
      ...config,
      scope: [
        ...(DefaultConfig.scope ?? []),
        ...(config.scope?.filter((scope: string) => !DefaultConfig?.scope?.includes(scope)) ?? []),
      ],
    });
  }

  /**
   * This method returns the `DataLayer` object that allows you to access authentication data.
   *
   * @returns - The `DataLayer` object.
   *
   * @example
   * ```
   * const data = auth.getDataLayer();
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getDataLayer}
   *
   * @preserve
   */
  public getDataLayer(): DataLayer<T> {
    return this._dataLayer;
  }

  /**
   * This method returns the `instanceID` variable of the given instance.
   *
   * @returns - The `instanceID` number.
   *
   * @example
   * ```
   * const instanceId = auth.getInstanceID();
   * ```
   *
   * @preserve
   */
  public getInstanceID(): number {
    return AsgardeoAuthClient._instanceID;
  }

  /**
   * This is an async method that returns a Promise that resolves with the authorization URL parameters.
   *
   * @param config - (Optional) A config object to force initialization and pass
   * custom path parameters such as the `fidp` parameter.
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * @returns - A promise that resolves with the authorization URL parameters.
   *
   * @example
   * ```
   * auth.getAuthorizationURLParams().then((params)=>{
   *  // console.log(params);
   * }).catch((error)=>{
   *  // console.error(error);
   * });
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getAuthorizationURLParams}
   *
   * @preserve
   */
  public async getAuthorizationURLParams(config?: GetAuthURLConfig, userID?: string): Promise<Map<string, string>> {
    const authRequestConfig: GetAuthURLConfig = {...config};

    delete authRequestConfig?.forceInit;

    if (
      await this._dataLayer.getTemporaryDataParameter(
        OIDCDiscoveryConstants.Storage.StorageKeys.OPENID_PROVIDER_CONFIG_INITIATED,
      )
    ) {
      return this._authenticationCore.getAuthorizationURLParams(authRequestConfig, userID);
    }

    return this._authenticationCore.getOIDCProviderMetaData(config?.forceInit as boolean).then(() => {
      return this._authenticationCore.getAuthorizationURLParams(authRequestConfig, userID);
    });
  }

  /**
   * This is an async method that returns a Promise that resolves with the authorization URL.
   *
   * @param config - (Optional) A config object to force initialization and pass
   * custom path parameters such as the fidp parameter.
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * @returns - A promise that resolves with the authorization URL.
   *
   * @example
   * ```
   * auth.getAuthorizationURL().then((url)=>{
   *  // console.log(url);
   * }).catch((error)=>{
   *  // console.error(error);
   * });
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getAuthorizationURL}
   *
   * @preserve
   */
  public async getAuthorizationURL(config?: GetAuthURLConfig, userID?: string): Promise<string> {
    const authRequestConfig: GetAuthURLConfig = {...config};

    delete authRequestConfig?.forceInit;

    if (
      await this._dataLayer.getTemporaryDataParameter(
        OIDCDiscoveryConstants.Storage.StorageKeys.OPENID_PROVIDER_CONFIG_INITIATED,
      )
    ) {
      return this._authenticationCore.getAuthorizationURL(authRequestConfig, userID);
    }

    return this._authenticationCore.getOIDCProviderMetaData(config?.forceInit as boolean).then(() => {
      return this._authenticationCore.getAuthorizationURL(authRequestConfig, userID);
    });
  }

  /**
   * This is an async method that sends a request to obtain the access token and returns a Promise
   * that resolves with the token and other relevant data.
   *
   * @param authorizationCode - The authorization code.
   * @param sessionState - The session state.
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * @returns - A Promise that resolves with the token response.
   *
   * @example
   * ```
   * auth.requestAccessToken(authCode, sessionState).then((token)=>{
   *  // console.log(token);
   * }).catch((error)=>{
   *  // console.error(error);
   * });
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#requestAccessToken}
   *
   *
   * @preserve
   */
  public async requestAccessToken(
    authorizationCode: string,
    sessionState: string,
    state: string,
    userID?: string,
    tokenRequestConfig?: {
      params: Record<string, unknown>;
    },
  ): Promise<TokenResponse> {
    if (
      await this._dataLayer.getTemporaryDataParameter(
        OIDCDiscoveryConstants.Storage.StorageKeys.OPENID_PROVIDER_CONFIG_INITIATED,
      )
    ) {
      return this._authenticationCore.requestAccessToken(
        authorizationCode,
        sessionState,
        state,
        userID,
        tokenRequestConfig,
      );
    }

    return this._authenticationCore.getOIDCProviderMetaData(false).then(() => {
      return this._authenticationCore.requestAccessToken(
        authorizationCode,
        sessionState,
        state,
        userID,
        tokenRequestConfig,
      );
    });
  }

  /**
   * This method returns the sign-out URL.
   *
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * **This doesn't clear the authentication data.**
   *
   * @returns - A Promise that resolves with the sign-out URL.
   *
   * @example
   * ```
   * const signOutUrl = await auth.getSignOutURL();
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getSignOutURL}
   *
   * @preserve
   */
  public async getSignOutURL(userID?: string): Promise<string> {
    return this._authenticationCore.getSignOutURL(userID);
  }

  /**
   * This method returns OIDC service endpoints that are fetched from the `.well-known` endpoint.
   *
   * @returns - A Promise that resolves with an object containing the OIDC service endpoints.
   *
   * @example
   * ```
   * const endpoints = await auth.getOIDCServiceEndpoints();
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getOIDCServiceEndpoints}
   *
   * @preserve
   */
  public async getOIDCServiceEndpoints(): Promise<Partial<OIDCEndpoints>> {
    return this._authenticationCore.getOIDCServiceEndpoints();
  }

  /**
   * This method decodes the payload of the ID token and returns it.
   *
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * @returns - A Promise that resolves with the decoded ID token payload.
   *
   * @example
   * ```
   * const decodedIdToken = await auth.getDecodedIDToken();
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getDecodedIDToken}
   *
   * @preserve
   */
  public async getDecodedIDToken(userID?: string): Promise<IdTokenPayload> {
    return this._authenticationCore.getDecodedIDToken(userID);
  }

  /**
   * This method returns the ID token.
   *
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * @returns - A Promise that resolves with the ID token.
   *
   * @example
   * ```
   * const idToken = await auth.getIDToken();
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getIDToken}
   *
   * @preserve
   */
  public async getIDToken(userID?: string): Promise<string> {
    return this._authenticationCore.getIDToken(userID);
  }

  /**
   * This method returns the basic user information obtained from the ID token.
   *
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * @returns - A Promise that resolves with an object containing the basic user information.
   *
   * @example
   * ```
   * const userInfo = await auth.getBasicUserInfo();
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getBasicUserInfo}
   *
   * @preserve
   */
  public async getBasicUserInfo(userID?: string): Promise<BasicUserInfo> {
    return this._authenticationCore.getBasicUserInfo(userID);
  }

  /**
   * This method returns the crypto helper object.
   *
   * @returns - A Promise that resolves with a IsomorphicCrypto object.
   *
   * @example
   * ```
   * const cryptoHelper = await auth.IsomorphicCrypto();
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getCryptoHelper}
   *
   * @preserve
   */
  public async getCryptoHelper(): Promise<IsomorphicCrypto> {
    return this._authenticationCore.getCryptoHelper();
  }

  /**
   * This method revokes the access token.
   *
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * **This method also clears the authentication data.**
   *
   * @returns - A Promise that returns the response of the revoke-access-token request.
   *
   * @example
   * ```
   * auth.revokeAccessToken().then((response)=>{
   *  // console.log(response);
   * }).catch((error)=>{
   *  // console.error(error);
   * });
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#revokeAccessToken}
   *
   * @preserve
   */
  public revokeAccessToken(userID?: string): Promise<FetchResponse> {
    return this._authenticationCore.revokeAccessToken(userID);
  }

  /**
   * This method refreshes the access token and returns a Promise that resolves with the new access
   * token and other relevant data.
   *
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * @returns - A Promise that resolves with the token response.
   *
   * @example
   * ```
   * auth.refreshAccessToken().then((response)=>{
   *  // console.log(response);
   * }).catch((error)=>{
   *  // console.error(error);
   * });
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#refreshAccessToken}
   *
   * @preserve
   */
  public refreshAccessToken(userID?: string): Promise<TokenResponse> {
    return this._authenticationCore.refreshAccessToken(userID);
  }

  /**
   * This method returns the access token.
   *
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * @returns - A Promise that resolves with the access token.
   *
   * @example
   * ```
   * const accessToken = await auth.getAccessToken();
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getAccessToken}
   *
   * @preserve
   */
  public async getAccessToken(userID?: string): Promise<string> {
    return this._authenticationCore.getAccessToken(userID);
  }

  /**
   * This method sends a custom-grant request and returns a Promise that resolves with the response
   * depending on the config passed.
   *
   * @param config - A config object containing the custom grant configurations.
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * @returns - A Promise that resolves with the response depending
   * on your configurations.
   *
   * @example
   * ```
   * const config = {
   *   attachToken: false,
   *   data: {
   *       client_id: "{{clientID}}",
   *       grant_type: "account_switch",
   *       scope: "{{scope}}",
   *       token: "{{token}}",
   *   },
   *   id: "account-switch",
   *   returnResponse: true,
   *   returnsSession: true,
   *   signInRequired: true
   * }
   *
   * auth.requestCustomGrant(config).then((response)=>{
   *  // console.log(response);
   * }).catch((error)=>{
   *  // console.error(error);
   * });
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#requestCustomGrant}
   *
   * @preserve
   */
  public requestCustomGrant(config: CustomGrantConfig, userID?: string): Promise<TokenResponse | FetchResponse> {
    return this._authenticationCore.requestCustomGrant(config, userID);
  }

  /**
   * This method returns if the user is authenticated or not.
   *
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * @returns - A Promise that resolves with `true` if the user is authenticated, `false` otherwise.
   *
   * @example
   * ```
   * await auth.isAuthenticated();
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#isAuthenticated}
   *
   * @preserve
   */
  public async isAuthenticated(userID?: string): Promise<boolean> {
    return this._authenticationCore.isAuthenticated(userID);
  }

  /**
   * This method returns the PKCE code generated during the generation of the authentication URL.
   *
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   * @param state - The state parameter that was passed in the authentication URL.
   *
   * @returns - A Promise that resolves with the PKCE code.
   *
   * @example
   * ```
   * const pkce = await getPKCECode();
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getPKCECode}
   *
   * @preserve
   */
  public async getPKCECode(state: string, userID?: string): Promise<string> {
    return this._authenticationCore.getPKCECode(state, userID);
  }

  /**
   * This method sets the PKCE code to the data store.
   *
   * @param pkce - The PKCE code.
   * @param state - The state parameter that was passed in the authentication URL.
   * @param userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
   * scenarios where each user should be uniquely identified.
   *
   * @example
   * ```
   * await auth.setPKCECode("pkce_code")
   * ```
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#setPKCECode}
   *
   * @preserve
   */
  public async setPKCECode(pkce: string, state: string, userID?: string): Promise<void> {
    await this._authenticationCore.setPKCECode(pkce, state, userID);
  }

  /**
   * This method returns if the sign-out is successful or not.
   *
   * @param signOutRedirectUrl - The URL to which the user has been redirected to after signing-out.
   *
   * **The server appends path parameters to the `signOutRedirectURL` and these path parameters
   *  are required for this method to function.**
   *
   * @returns - `true` if successful, `false` otherwise.
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#isSignOutSuccessful}
   *
   * @preserve
   */
  public static isSignOutSuccessful(signOutRedirectURL: string): boolean {
    const url: URL = new URL(signOutRedirectURL);
    const stateParam: string | null = url.searchParams.get(OIDCRequestConstants.Params.STATE);
    const error: boolean = Boolean(url.searchParams.get('error'));

    return stateParam ? stateParam === OIDCRequestConstants.Params.SIGN_OUT_SUCCESS && !error : false;
  }

  /**
   * This method returns if the sign-out has failed or not.
   *
   * @param signOutRedirectUrl - The URL to which the user has been redirected to after signing-out.
   *
   * **The server appends path parameters to the `signOutRedirectURL` and these path parameters
   *  are required for this method to function.**
   *
   * @returns - `true` if successful, `false` otherwise.
   *
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#didSignOutFail}
   *
   * @preserve
   */
  public static didSignOutFail(signOutRedirectURL: string): boolean {
    const url: URL = new URL(signOutRedirectURL);
    const stateParam: string | null = url.searchParams.get(OIDCRequestConstants.Params.STATE);
    const error: boolean = Boolean(url.searchParams.get('error'));

    return stateParam ? stateParam === OIDCRequestConstants.Params.SIGN_OUT_SUCCESS && error : false;
  }

  /**
   * This method updates the configuration that was passed into the constructor when instantiating this class.
   *
   * @param config - A config object to update the SDK configurations with.
   *
   * @example
   * ```
   * const config = {
   *     signInRedirectURL: "http://localhost:3000/sign-in",
   *     clientID: "client ID",
   *     baseUrl: "https://localhost:9443"
   * }
   *
   * await auth.updateConfig(config);
   * ```
   * {@link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#updateConfig}
   *
   * @preserve
   */
  public async updateConfig(config: Partial<AuthClientConfig<T>>): Promise<void> {
    await this._authenticationCore.updateConfig(config);
  }

  public static async clearUserSessionData(userID?: string): Promise<void> {
    await this._authenticationCore.clearUserSessionData(userID);
  }
}
