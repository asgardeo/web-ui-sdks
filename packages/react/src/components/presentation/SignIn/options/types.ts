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

import {ApplicationNativeAuthenticationAuthenticator} from '@asgardeo/browser';

/**
 * Base props that all sign-in option components share.
 */
export interface BaseSignInOptionProps {
  /**
   * The authenticator configuration.
   */
  authenticator: ApplicationNativeAuthenticationAuthenticator;

  /**
   * Current form values.
   */
  formValues: Record<string, string>;

  /**
   * Whether the component is in loading state.
   */
  isLoading: boolean;

  /**
   * Error message to display.
   */
  error?: string | null;

  /**
   * Callback function called when input values change.
   */
  onInputChange: (param: string, value: string) => void;

  /**
   * Callback function called when the option is submitted.
   */
  onSubmit: (authenticator: ApplicationNativeAuthenticationAuthenticator, formData?: Record<string, string>) => void;

  /**
   * Custom CSS class name for form inputs.
   */
  inputClassName?: string;

  /**
   * Custom CSS class name for the submit button.
   */
  buttonClassName?: string;

  /**
   * Text for the submit button.
   */
  submitButtonText?: string;
}

/**
 * Sign-in option types.
 */
export enum SignInOptionType {
  UsernamePassword = 'username-password',
  IdentifierFirst = 'identifier-first',
  GoogleButton = 'google-button',
  GitHubButton = 'github-button',
  MicrosoftButton = 'microsoft-button',
  FacebookButton = 'facebook-button',
  LinkedInButton = 'linkedin-button',
  SignInWithEthereumButton = 'signin-with-ethereum-button',
  EmailOtp = 'email-otp',
  Totp = 'totp',
  SmsOtp = 'sms-otp',
  // Legacy SocialLogin for backwards compatibility
  SocialLogin = 'social-login',
}

/**
 * Factory function props.
 */
export interface SignInOptionFactoryProps extends BaseSignInOptionProps {
  /**
   * The type of sign-in option to create.
   */
  optionType: SignInOptionType;
}
