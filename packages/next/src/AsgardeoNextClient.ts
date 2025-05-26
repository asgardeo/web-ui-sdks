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

import {AsgardeoNodeClient} from '@asgardeo/node';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {AsgardeoNextConfig} from './models/config';

export interface SignInOptions {
  /**
   * The authorization code received from the OAuth provider
   */
  code?: string;

  /**
   * Additional parameters to include in the authorization request
   */
  params?: Record<string, string>;

  /**
   * The session state received from the OAuth provider
   */
  sessionState?: string;

  /**
   * The state parameter from the OAuth flow
   */
  state?: string;
}

/**
 * Next.js-specific implementation of the Asgardeo authentication client.
 * Extends the Node.js client with Next.js-specific functionality for handling
 * authentication flows in Next.js applications.
 */
class AsgardeoNextClient extends AsgardeoNodeClient<AsgardeoNextConfig> {}

export default AsgardeoNextClient;
