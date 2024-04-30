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

import {AuthClient} from 'src/auth-client';
import AsgardeoUIException from 'src/exception';
import {MeAPIResponse} from 'src/models/me-api-response';

/**
 * Fetch the profile information of the authenticated user.
 *
 * This function uses the `AuthClient` instance to get the base URL and access token,
 * and then makes a GET request to the `/scim2/Me` endpoint to fetch the user's profile information.
 *
 * @returns {Promise<MeAPIResponse>} A promise that resolves to an object containing the user's profile information.
 * @throws {AsgardeoUIException} Throws an exception if there's an error getting the base URL and access token, or if the fetch request fails.
 */
const getProfileInformation = async (): Promise<MeAPIResponse> => {
  let baseUrl: string;
  let accessToken: string;
  let response: Response;

  try {
    baseUrl = (await AuthClient.getInstance().getDataLayer().getConfigData()).baseUrl;
    accessToken = await AuthClient.getInstance().getAccessToken();
  } catch (error) {
    throw new AsgardeoUIException(
      'JS_UI_CORE-ME-GPI-NF',
      'Failed in getting the base URL and access token.',
      error.stack,
    );
  }

  if (!accessToken) {
    throw new AsgardeoUIException('JS_UI_CORE-ME-GPI-IV', 'Access token is null.');
  }

  const headers: Headers = new Headers();
  headers.append('Authorization', `Bearer ${accessToken}`);
  headers.append('Content-Type', 'application/json');

  const requestOptions: RequestInit = {
    headers,
    method: 'GET',
  };

  try {
    response = await fetch(new Request(`${baseUrl}/scim2/Me`, requestOptions));
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-ME-GPI-NE', 'Me API call failed.', error.stack);
  }

  if (response.ok) {
    return (await response.json()) as MeAPIResponse;
  }

  throw new AsgardeoUIException('JS_UI_CORE-ME-GPI-HE', 'Failed to receive a successful response from the Me API.');
};

export default getProfileInformation;
