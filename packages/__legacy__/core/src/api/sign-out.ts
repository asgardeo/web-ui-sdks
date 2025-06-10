/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import {AuthClient} from '../auth-client';
import AsgardeoUIException from '../exception';
import {UIAuthClient} from '../models/auth-config';

/**
 * Sign out the user.
 *
 * This function sends a signout request to the server.
 *
 * @returns {Promise<void>} A promise that resolves when the sign out process is complete.
 *
 * @example
 * signOut()
 *   .then(() => {
 *     console.log('Signed out!');
 *   })
 *   .catch((error) => {
 *     console.error('Failed to sign out:', error);
 *   });
 */
const signOut = async (): Promise<void> => {
  let response: Response;
  let signOutUrl: string;

  const headers: Headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/x-www-form-urlencoded');

  const formBody: URLSearchParams = new URLSearchParams();

  const authClient: UIAuthClient = AuthClient.getInstance();

  try {
    formBody.append('id_token_hint', await authClient.getIDToken());
    formBody.append('client_id', (await authClient.getStorageManager().getConfigData()).clientId);
    formBody.append('response_mode', 'direct');
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-SIGNOUT-SO-IV', 'Failed to build the body of the signout request.');
  }

  const requestOptions: RequestInit = {
    body: formBody.toString(),
    headers,
    method: 'POST',
  };

  try {
    const {endSessionEndpoint} = await authClient.getOpenIDProviderEndpoints();
    signOutUrl = endSessionEndpoint;
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-SIGNOUT-SO-NF', 'Failed to retrieve the sign out endpoint.');
  }

  try {
    response = await fetch(signOutUrl, requestOptions);
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-SIGNOUT-SO-NE', 'Failed to send a request to the sign out endpoint.');
  }

  if (!response.ok) {
    throw new AsgardeoUIException(
      'JS_UI_CORE-SIGNOUT-SO-HE',
      'Failed to receive a successful response from the sign out endpoint.',
    );
  }
};

export default signOut;
