/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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
  AsgardeoNodeClient,
  AuthClientConfig,
  AuthURLCallback,
  TokenResponse,
  Storage,
  BasicUserInfo,
  OIDCEndpoints,
  DecodedIDTokenPayload,
  CustomGrantConfig,
  FetchResponse,
  AsgardeoAuthException,
  Logger,
} from '@asgardeo/node';
import {CookieConfig, DEFAULT_LOGIN_PATH, DEFAULT_LOGOUT_PATH} from './constants';
import {ExpressClientConfig, UnauthenticatedCallback} from './models';
import express from 'express';
import {v4 as uuidv4} from 'uuid';
import {asgardeoExpressAuth, protectRoute} from './middleware';
import {ExpressUtils} from './utils/express-utils';

export class AsgardeoExpressClient {
  private _authClient: AsgardeoNodeClient<AuthClientConfig>;
  private _storage?: Storage;
  private static _clientConfig: ExpressClientConfig;

  private static _instance: AsgardeoExpressClient;

  private constructor(config: ExpressClientConfig, storage?: Storage) {
    //Set the client config
    AsgardeoExpressClient._clientConfig = {...config};

    //Add the signInRedirectURL and signOutRedirectURL
    //Add custom paths if the user has already declared any or else use the defaults
    const nodeClientConfig: AuthClientConfig = {
      ...config,
      signInRedirectURL: config.appURL + (config.loginPath || DEFAULT_LOGIN_PATH),
      signOutRedirectURL: config.appURL + (config.logoutPath || DEFAULT_LOGOUT_PATH),
    };

    //Initialize the user provided storage if there is any
    if (storage) {
      Logger.debug('Initializing user provided storage');
      this._storage = storage;
    }

    //Initialize the Auth Client
    this._authClient = new AsgardeoNodeClient(nodeClientConfig, this._storage);
  }

  public static getInstance(config: ExpressClientConfig, storage?: Storage): AsgardeoExpressClient;
  public static getInstance(): AsgardeoExpressClient;
  public static getInstance(config?: ExpressClientConfig, storage?: Storage): AsgardeoExpressClient {
    //Create a new instance if its not instantiated already
    if (!AsgardeoExpressClient._instance && config) {
      AsgardeoExpressClient._instance = new AsgardeoExpressClient(config, storage);
      Logger.debug('Initialized AsgardeoExpressClient successfully');
    }

    if (!AsgardeoExpressClient._instance && !config) {
      throw Error(
        new AsgardeoAuthException(
          'EXPRESS-CLIENT-GI1-NF01',
          'User configuration  is not found',
          'User config has not been passed to initialize AsgardeoExpressClient',
        ).toString(),
      );
    }

    return AsgardeoExpressClient._instance;
  }

  public async signIn(
    req: express.Request,
    res: express.Response,
    next: express.nextFunction,
    signInConfig?: Record<string, string | boolean>,
  ): Promise<TokenResponse> {
    if (ExpressUtils.hasErrorInURL(req.originalUrl)) {
      return Promise.reject(
        new AsgardeoAuthException(
          'EXPRESS-CLIENT-SI-IV01',
          'Invalid login request URL',
          'Login request contains an error query parameter in the URL',
        ),
      );
    }

    //Check if the user has a valid user ID and if not create one
    let userID = req.cookies.ASGARDEO_SESSION_ID;
    if (!userID) {
      userID = uuidv4();
    }

    //Handle signIn() callback
    const authRedirectCallback = (url: string) => {
      if (url) {
        //DEBUG
        Logger.debug('Redirecting to: ' + url);
        res.cookie('ASGARDEO_SESSION_ID', userID, {
          maxAge: AsgardeoExpressClient._clientConfig.cookieConfig?.maxAge
            ? AsgardeoExpressClient._clientConfig.cookieConfig.maxAge
            : CookieConfig.defaultMaxAge,
          httpOnly: AsgardeoExpressClient._clientConfig.cookieConfig?.httpOnly ?? CookieConfig.defaultHttpOnly,
          sameSite: AsgardeoExpressClient._clientConfig.cookieConfig?.sameSite ?? CookieConfig.defaultSameSite,
          secure: AsgardeoExpressClient._clientConfig.cookieConfig?.secure ?? CookieConfig.defaultSecure,
        });
        res.redirect(url);

        next && typeof next === 'function' && next();
      }
    };

    const authResponse: TokenResponse = await this._authClient.signIn(
      authRedirectCallback,
      userID,
      req.query.code,
      req.query.session_state,
      req.query.state,
      signInConfig,
    );

    if (authResponse.accessToken || authResponse.idToken) {
      return authResponse;
    } else {
      return {
        accessToken: '',
        createdAt: 0,
        expiresIn: '',
        idToken: '',
        refreshToken: '',
        scope: '',
        tokenType: '',
      };
    }
  }

  public async signOut(userId: string): Promise<string> {
    return this._authClient.signOut(userId);
  }

  public async isAuthenticated(userId: string): Promise<boolean> {
    return this._authClient.isAuthenticated(userId);
  }

  public async getIDToken(userId: string): Promise<string> {
    return this._authClient.getIDToken(userId);
  }

  public async getBasicUserInfo(userId: string): Promise<BasicUserInfo> {
    return this._authClient.getBasicUserInfo(userId);
  }

  public async getOIDCServiceEndpoints(): Promise<OIDCEndpoints> {
    return this._authClient.getOIDCServiceEndpoints();
  }

  public async getDecodedIDToken(userId?: string): Promise<DecodedIDTokenPayload> {
    return this._authClient.getDecodedIDToken(userId);
  }

  public async getAccessToken(userId?: string): Promise<string> {
    return this._authClient.getAccessToken(userId);
  }

  public async requestCustomGrant(config: CustomGrantConfig, userId?: string): Promise<TokenResponse | FetchResponse> {
    return this._authClient.requestCustomGrant(config, userId);
  }

  public async updateConfig(config: Partial<AuthClientConfig>): Promise<void> {
    return this._authClient.updateConfig(config);
  }

  public async revokeAccessToken(userId?: string): Promise<FetchResponse> {
    return this._authClient.revokeAccessToken(userId);
  }

  public static didSignOutFail(signOutRedirectURL: string): boolean {
    return AsgardeoNodeClient.didSignOutFail(signOutRedirectURL);
  }

  public static isSignOutSuccessful(signOutRedirectURL: string): boolean {
    return AsgardeoNodeClient.isSignOutSuccessful(signOutRedirectURL);
  }

  public static protectRoute(
    callback: UnauthenticatedCallback,
  ): (req: express.Request, res: express.Response, next: express.nextFunction) => Promise<void> {
    if (!this._instance) {
      throw new AsgardeoAuthException(
        'EXPRESS-CLIENT-PR-NF01',
        'AsgardeoExpressClient is not instantiated',
        'Create an instance of AsgardeoExpressClient before using calling this method.',
      );
    }

    return protectRoute(this._instance, callback);
  }

  public static asgardeoExpressAuth(
    onSignIn: (response: TokenResponse) => void,
    onSignOut: () => void,
    onError: (exception: AsgardeoAuthException) => void,
  ): any {
    if (!this._instance) {
      throw new AsgardeoAuthException(
        'EXPRESS-CLIENT-AEA-NF01',
        'AsgardeoExpressClient is not instantiated',
        'Create an instance of AsgardeoExpressClient before using calling this method.',
      );
    }

    return asgardeoExpressAuth(this._instance, AsgardeoExpressClient._clientConfig, onSignIn, onSignOut, onError);
  }

  public async getStorageManager() {
    return this._authClient.getStorageManager();
  }
}
