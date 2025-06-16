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
  'elements.buttons.facebook': 'Continue with Facebook',
  'elements.buttons.google': 'Continue with Google',
  'elements.buttons.github': 'Continue with GitHub',
  'elements.buttons.microsoft': 'Continue with Microsoft',
  'elements.buttons.linkedin': 'Continue with LinkedIn',
  'elements.buttons.ethereum': 'Continue with Sign In Ethereum',
  'elements.buttons.multi.option': 'Continue with {connection}',
  'elements.buttons.social': 'Continue with {connection}',
  
  /* Fields */
  'elements.fields.placeholder': 'Enter your {field}',

  /* |---------------------------------------------------------------| */
  /* |                        Widgets                                | */
  /* |---------------------------------------------------------------| */

  /* Base Sign In */
  'signin.title': 'Sign In',

  /* Email OTP */
  'email.otp.title': 'OTP Verification',
  'email.otp.subtitle': 'Enter the code sent to your email address.',
  'email.otp.submit.button': 'Continue',

  /* Identifier First */
  'identifier.first.title': 'Sign In',
  'identifier.first.subtitle': 'Enter your username or email address.',
  'identifier.first.submit.button': 'Continue',

  /* SMS OTP */
  'sms.otp.title': 'OTP Verification',
  'sms.otp.subtitle': 'Enter the code sent to your phone number.',
  'sms.otp.submit.button': 'Continue',

  /* TOTP */
  'totp.title': 'Verify Your Identity',
  'totp.subtitle': 'Enter the code from your authenticator app.',
  'totp.submit.button': 'Continue',

  /* Username Password */
  'username.password.submit.button': 'Continue',
  'username.password.title': 'Sign In',
  'username.password.subtitle': 'Enter your username and password to continue.',
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
