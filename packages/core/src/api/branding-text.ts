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
import {BrandingTextAPIResponse} from 'src/models/branding-text-api-response';

/**
 * Fetch the branding text from the server.
 *
 * @param locale - The locale of the branding text.
 * @param name - The name of the branding text.
 * @param screen - The screen of the branding text.
 * @param type - The type of the branding text.
 * @returns A Promise that resolves to the response from the server.
 * @throws {AsgardeoUIException} If the API call fails or when the response is not successful.
 */
export const brandingText = async (
  locale: string,
  name: string,
  screen: string,
  type: string,
): Promise<BrandingTextAPIResponse> => {
  const headers: Headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');

  const requestOptions: RequestInit = {
    headers,
    method: 'GET',
  };

  const params: URLSearchParams = new URLSearchParams();
  params.append('locale', locale);
  params.append('name', name);
  params.append('screen', screen);
  params.append('type', type);

  const {baseUrl} = await AuthClient.getInstance().getDataLayer().getConfigData();
  const textUrl: string = `${baseUrl}/api/server/v1/branding-preference/text/resolve`;
  const urlWithParams: string = `${textUrl}?${params.toString()}`;
  let response: Response;

  try {
    response = await fetch(new Request(urlWithParams, requestOptions));
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-BT-BT-NE', 'Branding Text API call failed', error.stack);
  }

  if (response.ok) {
    return (await response.json()) as BrandingTextAPIResponse;
  }

  throw new AsgardeoUIException(
    'JS_UI_CORE-BT-BT-HE',
    'Failed to receive a successful response from the branding text endpoint',
  );
};
