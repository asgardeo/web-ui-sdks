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
import {BrandingPreferenceAPIResponseInterface, BrandingPreferenceTypes} from '../models/branding-api-response';

/**
 * Fetch branding preferences from the server.
 *
 * @returns {Promise<BrandingPreferenceAPIResponseInterface>} A promise that resolves with the branding preferences.
 * @throws {AsgardeoUIException} If an error occurs while fetching the branding preferences or when the response is unsuccessful.
 */
const getBrandingPreference = async (): Promise<BrandingPreferenceAPIResponseInterface> => {
  const {
    baseUrl,
    type = BrandingPreferenceTypes.Org,
    name = 'WSO2',
  } = await AuthClient.getInstance().getDataLayer().getConfigData();
  const brandingUrl: string = `${baseUrl}/api/server/v1/branding-preference?type=${type}&name=${name}`;
  let response: Response;

  try {
    response = await fetch(brandingUrl);
  } catch (error) {
    throw new AsgardeoUIException('JS_UI_CORE-BR-GBP-NE', 'Error while fetching branding data.', error.stack);
  }

  if (response.ok) {
    return (await response.json()) as Promise<BrandingPreferenceAPIResponseInterface>;
  }

  throw new AsgardeoUIException(
    'JS_UI_CORE-BR-GBP-HE',
    'Failed to receive a successful response from the branding API.',
  );
};

export default getBrandingPreference;
