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

import {BrandingPreference, BrandingPreferenceTypes} from './branding-api-response';
import {RecursivePartial} from './common';
import {TextPreference} from '../i18n/screens/model';

/**
 * Interface for the text in the customization object.
 */
export type BrandingPreferenceText = Record<string, TextPreference>;

interface BrandingPreferenceWithText extends BrandingPreference {
  text?: BrandingPreferenceText;
}

/**
 * Interface for the branding object.
 */
export interface Branding {
  locale: string;
  /**
   * Requested resource name.
   */
  name: string;
  /**
   * Preference object.
   */
  preference: BrandingPreferenceWithText;
  /**
   * Preference type.
   */
  type: BrandingPreferenceTypes;
}

/**
 * Type for the branding props.
 */
export type BrandingProps = RecursivePartial<Branding>;
