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

import {Common} from './common/model';
import {Login} from './login/model';
import {TOTP} from './totp/model';
import {BrandingProps} from '../../models/branding';
import {ScreenType} from '../../models/screen-type';

/**
 * Interface for the text preference.
 */
export interface TextPreference {
  common: Common;
  login: Login;
  totp: TOTP;
}

/**
 * Interface for the return type of the getLocalization function.
 */
export type TextObject = Login | TOTP | Common;

/**
 * Interface for getLocalization function props.
 */
export interface GetLocalization {
  /**
   * Customiztion prop passed to the component
   */
  componentCustomization?: BrandingProps;
  /**
   * Locale to filter the retrieval of localization.
   */
  locale: string;
  /**
   * Customization prop passed to the provider
   */
  providerCustomization?: BrandingProps;
  /**
   * Screen to filter the retrieval of localization.
   */
  screen: ScreenType;
}
