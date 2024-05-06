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

import {AuthClient, ResponseMode} from 'src/auth-client';
import AsgardeoUIException from 'src/exception';

const logout = async (): Promise<void> => {
  let response: Response;
  let logoutUrl: string;

  const headers: Headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/x-www-form-urlencoded');

  const formBody: URLSearchParams = new URLSearchParams();

  try {
    formBody.append('id_token_hint', await AuthClient.getInstance().getIDToken());
    formBody.append('client_id', (await AuthClient.getInstance().getDataLayer().getConfigData()).clientID);
    formBody.append('response_mode', ResponseMode.direct);
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-LOGOUT-L-IV', 'Failed to build the body of the logout request.');
  }

  const requestOptions: RequestInit = {
    body: formBody.toString(),
    headers,
    method: 'POST',
  };

  try {
    logoutUrl = (await AuthClient.getInstance().getOIDCServiceEndpoints()).endSessionEndpoint;
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-LOGOUT-L-NF', 'Failed to retrieve the logout endpoint.');
  }

  try {
    response = await fetch(logoutUrl, requestOptions);
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-LOGOUT-L-NE', 'Failed to send a request to the logout endpoint.');
  }

  if (!response.ok) {
    throw new AsgardeoUIException(
      'JS_UI_CORE-LOGOUT-L-HE',
      'Failed to receive a successful response from the logout endpoint.',
    );
  }
};

export default logout;
