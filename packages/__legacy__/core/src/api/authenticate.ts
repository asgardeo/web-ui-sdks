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
import {AuthenticateProps} from '../models/auth-api-request';
import {AuthApiResponse} from '../models/auth-api-response';

/**
 * Send an authentication request to the authentication API.
 *
 * @param {AuthenticateProps} props - The authentication request body.
 * @returns {Promise<AuthApiResponse>} A promise that resolves with the authentication API response.
 */
const authenticate = async (props: AuthenticateProps): Promise<AuthApiResponse> => {
  let authnRequest: Request;
  let response: Response;

  try {
    const formBody: string = JSON.stringify(props);

    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const requestOptions: RequestInit = {
      body: formBody,
      headers,
      method: 'POST',
    };

    /* Getting baseURL from authClient's data layer */
    const {baseUrl} = await AuthClient.getInstance().getDataLayer().getConfigData();

    authnRequest = new Request(`${baseUrl}/oauth2/authn`, requestOptions);
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-AUTHN-A-NF', 'Authentication request building failed', error.stack);
  }

  try {
    response = await fetch(authnRequest);
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-AUTHN-A-NE', `Authentication API call Failed: ${error}`, error.stack);
  }

  if (response.ok) {
    return (await response.json()) as AuthApiResponse;
  }

  throw new AsgardeoUIException(
    'JS_UI_CORE-AUTHN-A-HE',
    'Failed to receive a successful response from the authentication endpoint',
  );
};

export default authenticate;
