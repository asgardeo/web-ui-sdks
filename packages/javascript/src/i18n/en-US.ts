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

  // Sign In related
  'signin.title': 'Sign In',
  'signin.subtitle': 'Welcome back! Please sign in to continue.',
  'signin.loading': 'Signing in...',

  // Social Login Buttons
  'buttons.continueWithGoogle': 'Continue with Google',
  'buttons.continueWithGitHub': 'Continue with GitHub',
  'buttons.continueWithMicrosoft': 'Continue with Microsoft',
  'buttons.continueWithFacebook': 'Continue with Facebook',
  'buttons.continueWithLinkedIn': 'Continue with LinkedIn',
  'buttons.continueWithEthereum': 'Continue with Sign In Ethereum',

  // Form Fields
  'fields.username': 'Username',
  'fields.password': 'Password',
  'fields.email': 'Email',
  'fields.confirmPassword': 'Confirm Password',
  'fields.rememberMe': 'Remember me',

  // Placeholders
  'placeholders.enterUsername': 'Enter your username',
  'placeholders.enterPassword': 'Enter your password',
  'placeholders.enterEmail': 'Enter your email address',
  'placeholders.enterOTP': 'Enter verification code',

  // Messages
  'messages.loading': 'Loading...',
  'messages.success': 'Success!',
  'messages.error': 'An error occurred',
  'messages.invalidCredentials': 'Invalid username or password',
  'messages.accountLocked': 'Account is locked. Please contact support.',

  // Multi-factor Authentication
  'mfa.title': 'Multi-Factor Authentication',
  'mfa.subtitle': 'Please verify your identity',
  'mfa.emailOtp.title': 'Email Verification',
  'mfa.emailOtp.subtitle': 'Enter the verification code sent to your email',
  'mfa.smsOtp.title': 'SMS Verification',
  'mfa.smsOtp.subtitle': 'Enter the verification code sent to your phone',
  'mfa.totp.title': 'Authenticator App',
  'mfa.totp.subtitle': 'Enter the code from your authenticator app',

  // Links
  'links.forgotPassword': 'Forgot Password?',
  'links.createAccount': 'Create an account',
  'links.backToSignIn': 'Back to Sign In',
  'links.help': 'Need help?',

  // Errors
  'errors.network': 'Network error. Please check your connection.',
  'errors.timeout': 'Request timed out. Please try again.',
  'errors.unauthorized': 'You are not authorized to access this resource.',
  'errors.forbidden': 'Access forbidden.',
  'errors.notFound': 'Resource not found.',
  'errors.serverError': 'Server error. Please try again later.',
  'errors.unknown': 'An unknown error occurred.',
  'errors.authenticationFailed': 'Authentication failed',
  'errors.authenticationFailedDetail': 'Authentication failed. Please check your credentials and try again.',
  'errors.initializationFailed': 'Failed to initialize authentication',
  'errors.title': 'Error',
  'errors.authenticationError': 'Authentication Error',
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
