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

import merge from 'lodash.merge';
import DEFAULT_BRANDING from './default-branding/default-branding';
import getBrandingPreference from '../api/get-branding-preference';
import {AuthClient} from '../auth-client';
import {Branding} from '../models/branding';
import {BrandingPreferenceAPIResponse} from '../models/branding-api-response';
import GetBrandingProps from '../models/get-branding-props';

/**
 * Fetch and merge branding properties.
 *
 * @param {GetBrandingProps} props - Branding properties.
 * @returns {Promise<Branding>} A promise that resolves with the merged branding properties.
 */
const getBranding = async (props: GetBrandingProps): Promise<Branding> => {
  const {branding, merged} = props;
  let mergedBranding: Branding;

  /**
   * If the `merged` prop is not provided, fetch the branding from the console and merge it with the default branding.
   * If the `merged` prop is provided, merge it with the branding props.
   */
  if (!merged) {
    let brandingFromConsole: BrandingPreferenceAPIResponse;

    try {
      if ((await AuthClient.getInstance().getDataLayer().getConfigData()).enableConsoleBranding ?? true) {
        brandingFromConsole = await getBrandingPreference();
      }
    } catch {
      /**
       * If the branding from the console cannot be fetched, proceed with the default branding.
       */
    }

    if (brandingFromConsole?.preference?.configs?.isBrandingEnabled) {
      mergedBranding = merge(DEFAULT_BRANDING, brandingFromConsole ?? {}, branding ?? {});
    } else {
      mergedBranding = merge(DEFAULT_BRANDING, branding ?? {});
    }
  } else {
    mergedBranding = merge(merged, branding ?? {});
  }

  return mergedBranding;
};

export default getBranding;
