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
import branding from 'src/api/branding';
import {AuthClient} from 'src/auth-client';
import {BrandingPreferenceAPIResponseInterface} from 'src/models/branding-api-response';
import {Customization} from 'src/models/customization';
import DEFAULT_BRANDING from './default-branding/default-branding';

/**
 * Interface for the getBranding function props.
 */
interface BrandingProps {
  /**
   * Customization prop passed to the component/provider.
   */
  customization?: Customization;
  /**
   * Merged customization object.
   */
  merged?: Customization;
}

/**
 * Fetch and merge branding properties.
 *
 * @param {BrandingProps} props - Branding properties.
 * @returns {Promise<Customization>} A promise that resolves with the merged branding properties.
 */
export const getBranding = async (props: BrandingProps): Promise<Customization> => {
  const {customization, merged} = props;
  let mergedBranding: Customization;

  /**
   * If the `merged` prop is not provided, fetch the branding from the console and merge it with the default branding.
   * If the `merged` prop is provided, merge it with the branding props.
   */
  if (!merged) {
    let brandingFromConsole: BrandingPreferenceAPIResponseInterface;

    if ((await AuthClient.getInstance().getDataLayer().getConfigData()).enableConsoleBranding ?? true) {
      brandingFromConsole = await branding();
    }

    if (brandingFromConsole?.preference?.configs?.isBrandingEnabled) {
      mergedBranding = await merge(DEFAULT_BRANDING, brandingFromConsole ?? {}, customization ?? {});
    } else {
      mergedBranding = await merge(DEFAULT_BRANDING, customization ?? {});
    }
  } else {
    mergedBranding = await merge(merged ?? {}, customization ?? {});
  }

  return mergedBranding;
};
