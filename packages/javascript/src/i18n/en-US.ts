/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import {I18nTranslations, I18nMetadata, I18nBundle} from '../models/i18n';

const translations: I18nTranslations = {
  /* |---------------------------------------------------------------| */
  /* |                        Elements                               | */
  /* |---------------------------------------------------------------| */

  //* Buttons */
  'elements.buttons.signIn': 'Sign In',
  'elements.buttons.signOut': 'Sign Out',
  'elements.buttons.signUp': 'Sign Up',
  'elements.buttons.facebook': 'Continue With Facebook',
  'elements.buttons.google': 'Continue With Google',
  'elements.buttons.github': 'Continue With GitHub',
  'elements.buttons.microsoft': 'Continue With Microsoft',
  'elements.buttons.linkedin': 'Continue With LinkedIn',
  'elements.buttons.ethereum': 'Continue With Sign In Ethereum',
  'elements.buttons.multi.option': 'Continue With {connection}',
  'elements.buttons.social': 'Continue With {connection}',

  /* |---------------------------------------------------------------| */
  /* |                        Widgets                                | */
  /* |---------------------------------------------------------------| */

  /* Email OTP */
  'email.otp.submit.button': 'Continue',
  
  /* Identifier First */
  'identifier.first.submit.button': 'Continue',
  
  /* SMS OTP */
  'sms.otp.submit.button': 'Continue',
  
  /* TOTP */
  'totp.submit.button': 'Continue',
  
  /* Username Password */
  'username.password.submit.button': 'Continue',
};

const metadata: I18nMetadata = {
  localeCode: 'en-US',
  countryCode: 'US',
  languageCode: 'en',
  displayName: 'English (United States)',
  direction: 'ltr',
};

const en_US: I18nBundle = {
  metadata,
  translations,
};

export default en_US;
