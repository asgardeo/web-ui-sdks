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

import {
  ApplicationNativeAuthenticationAuthenticator,
  ApplicationNativeAuthenticationAuthenticatorKnownIdPType,
  ApplicationNativeAuthenticationConstants,
} from '@asgardeo/browser';
import {ReactElement} from 'react';
import UsernamePassword from './UsernamePassword';
import IdentifierFirst from './IdentifierFirst';
import GoogleButton from './GoogleButton';
import GitHubButton from './GitHubButton';
import MicrosoftButton from './MicrosoftButton';
import FacebookButton from './FacebookButton';
import LinkedInButton from './LinkedInButton';
import SignInWithEthereumButton from './SignInWithEthereumButton';
import EmailOtp from './EmailOtp';
import Totp from './Totp';
import SmsOtp from './SmsOtp';
import SocialLogin from './SocialLogin';

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
 * Creates the appropriate sign-in option component based on the authenticator's ID.
 */
export const createSignInOption = (props: BaseSignInOptionProps): ReactElement => {
  const {authenticator, ...optionProps} = props;

  // Use authenticatorId to determine the component type
  switch (authenticator.authenticatorId) {
    case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.UsernamePassword:
      return <UsernamePassword {...props} />;

    case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.IdentifierFirst:
      return <IdentifierFirst {...props} />;

    case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.Google:
      return <GoogleButton {...props} />;

    case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.GitHub:
      return <GitHubButton {...props} />;

    case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.Microsoft:
      return <MicrosoftButton {...props} />;

    case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.Facebook:
      return <FacebookButton {...props} />;

    case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.LinkedIn:
      return <LinkedInButton {...props} />;

    case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.SignInWithEthereum:
      return <SignInWithEthereumButton {...props} />;

    case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.EmailOtp:
      return <EmailOtp {...props} />;

    case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.Totp:
      return <Totp {...props} />;

    case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.SmsOtp:
      return <SmsOtp {...props} />;

    default:
      // Check if it's a federated authenticator (non-LOCAL idp)
      if (authenticator.idp !== ApplicationNativeAuthenticationAuthenticatorKnownIdPType.Local) {
        // For unknown federated authenticators, use generic social login
        return <SocialLogin {...props} />;
      }

      // Fallback to username/password for unknown local authenticators
      return <UsernamePassword {...props} />;
  }
};

/**
 * Convenience function that creates the appropriate sign-in option component from an authenticator.
 */
export const createSignInOptionFromAuthenticator = (
  authenticator: ApplicationNativeAuthenticationAuthenticator,
  formValues: Record<string, string>,
  isLoading: boolean,
  onInputChange: (param: string, value: string) => void,
  onSubmit: (authenticator: ApplicationNativeAuthenticationAuthenticator, formData?: Record<string, string>) => void,
  options?: {
    inputClassName?: string;
    buttonClassName?: string;
    submitButtonText?: string;
    error?: string | null;
  },
): ReactElement => {
  return createSignInOption({
    authenticator,
    formValues,
    isLoading,
    onInputChange,
    onSubmit,
    ...options,
  });
};
