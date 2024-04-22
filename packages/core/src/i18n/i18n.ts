/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import {brandingText} from 'src/api/branding-text';
import {AuthClient} from 'src/auth-client';
import {BrandingTextAPIResponse} from 'src/models/branding-text-api-response';
import {BrandingPreferenceText, Customization} from 'src/models/customization';
import {ScreenType} from 'src/models/screen-type';

/**
 * Interface for getLocalization function props.
 */
interface GetLocalization {
  /**
   * Customiztion prop passed to the component
   */
  componentCustomization?: Customization;
  /**
   * Locale to filter the retrieval of localization.
   */
  locale: string;
  /**
   * Customization prop passed to the provider
   */
  providerCustomization?: Customization;
  /**
   * Screen to filter the retrieval of localization.
   */
  screen: ScreenType;
}

/**
 * merge text objects
 */
const getLocalization = async (props: GetLocalization): Promise<BrandingPreferenceText> => {
  const {componentCustomization, locale, providerCustomization, screen} = props;
  /**
   * Default stored branding
   */
  const module: any = await import(`./screens/${screen}/${locale}.ts`); // PRIORITY 04

  /**
   * Text from console branding
   */
  let textFromConsoleBranding: BrandingTextAPIResponse; // PRIORITY 03

  if ((await AuthClient.getInstance().getDataLayer().getConfigData()).enableConsoleTextBranding ?? true) {
    textFromConsoleBranding = await brandingText(
      locale,
      providerCustomization.name,
      screen,
      providerCustomization.type,
    );
  }

  /**
   * Merge text objects according to the priority
   */
  const mergedText: BrandingPreferenceText = await merge(
    module[screen] ?? {},
    textFromConsoleBranding?.preference?.text ?? {},
    providerCustomization?.preference?.text?.[locale]?.[screen] ?? {},
    componentCustomization?.preference?.text?.[locale]?.[screen] ?? {},
  );

  return mergedText;
};

export default getLocalization;
