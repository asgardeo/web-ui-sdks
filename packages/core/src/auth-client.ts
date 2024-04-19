/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {AsgardeoAuthClient, Store, CryptoUtils} from '@asgardeo/auth-js';
import {UIAuthClient, UIAuthConfig} from './models/auth-config';

/**
 * The `AuthClient` class is a singleton class that provides an instance of the `UIAuthClient`.
 */
export class AuthClient {
  private static instance: UIAuthClient;

  /**
   * Private constructor to prevent direct object creation.
   * This is necessary because this is a singleton class.
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Returns the singleton instance of `UIAuthClient`. If the instance does not exist, it is created.
   *
   * @param {UIAuthConfig} authClientConfig - The configuration for the `UIAuthClient`.
   * @param {Store} store - The store for the `UIAuthClient`.
   * @param {CryptoUtils} cryptoUtils - The crypto utilities for the `UIAuthClient`.
   * @returns {UIAuthClient} The singleton instance of `UIAuthClient`.
   */
  static getInstance(authClientConfig?: UIAuthConfig, store?: Store, cryptoUtils?: CryptoUtils): UIAuthClient {
    if (!AuthClient.instance) {
      AuthClient.instance = new AsgardeoAuthClient();
      AuthClient.instance.initialize(authClientConfig, store, cryptoUtils);
    }
    return AuthClient.instance;
  }
}

/* Interfaces, classes and enums required from the auth-js package */
export {CryptoUtils, JWKInterface, Store, AsgardeoAuthClient, TokenResponse, ResponseMode} from '@asgardeo/auth-js';
