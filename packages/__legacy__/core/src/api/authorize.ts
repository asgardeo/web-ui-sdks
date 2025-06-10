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
import {AuthApiResponse} from '../models/auth-api-response';
import {UIAuthClient} from '../models/auth-config';

/**
 * This function is used to authorize the user.
 * @returns {Promise<AuthApiResponse>} A promise that resolves with the authorization response.
 */
const authorize = async (): Promise<AuthApiResponse> => {
  let response: Response;
  let requestOptions: RequestInit;
  let authzURL: string;

  try {
    const authInstace: UIAuthClient = AuthClient.getInstance();
    // FIXME: We should be able to get the URL itself.
    // const params: Map<string, string> = await authInstace.getAuthorizationURLParams();
    const params: Map<string, string> = new Map();

    const formBody: URLSearchParams = new URLSearchParams();

    Array.from(params.entries()).forEach(([key, value]: [string, string]) => {
      formBody.append(key, value);
    });

    /* Save the state temporarily in the data layer, this needs to be passed when token is requested */
    await authInstace.getStorageManager().setTemporaryDataParameter('state', params.get('state'));

    const headers: Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    requestOptions = {
      body: formBody.toString(),
      headers,
      method: 'POST',
    };

    authzURL = (await authInstace.getOpenIDProviderEndpoints()).authorizationEndpoint;
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-AUTHZ-A-NF', 'Authorization request building failed', error.stack);
  }

  try {
    response = await fetch(authzURL, requestOptions);
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-AUTHZ-A-NE', 'Authorization API call failed', error.stack);
  }

  if (response.ok) {
    return (await response.json()) as AuthApiResponse;
  }

  throw new AsgardeoUIException(
    'JS_UI_CORE-AUTHZ-A-HE',
    'Failed to receive a successful response from the authorization server',
  );
};

export default authorize;
