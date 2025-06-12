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
import {SignInOptionType, SignInOptionFactoryProps} from './types';

/**
 * Determines the appropriate sign-in option type based on the authenticator configuration.
 */
export const getSignInOptionType = (authenticator: ApplicationNativeAuthenticationAuthenticator): SignInOptionType => {
  // For federated/social login providers, check specific providers
  if (authenticator.idp !== ApplicationNativeAuthenticationAuthenticatorKnownIdPType.Local) {
    const provider = authenticator.idp.toLowerCase();

    switch (provider) {
      case 'google':
        return SignInOptionType.GoogleButton;
      case 'github':
        return SignInOptionType.GitHubButton;
      case 'microsoft':
        return SignInOptionType.MicrosoftButton;
      case 'facebook':
        return SignInOptionType.FacebookButton;
      case 'linkedin':
        return SignInOptionType.LinkedInButton;
      case 'sign in with ethereum':
        return SignInOptionType.SignInWithEthereumButton;
      default:
        // Fallback to generic social login for unknown providers
        return SignInOptionType.SocialLogin;
    }
  }

  // For local authenticators, check the authenticator type
  switch (authenticator.authenticator) {
    case 'Username & Password':
      return SignInOptionType.UsernamePassword;
    case 'Identifier First':
      return SignInOptionType.IdentifierFirst;
    case 'TOTP':
      return SignInOptionType.Totp;
    case 'SMS OTP':
      return SignInOptionType.SmsOtp;
    case 'Email OTP':
      return SignInOptionType.EmailOtp;
    default:
      // Default to username/password for unknown local authenticators
      return SignInOptionType.UsernamePassword;
  }
};

/**
 * Factory function to create the appropriate sign-in option component.
 */
export const createSignInOption = (props: SignInOptionFactoryProps): ReactElement => {
  const {optionType, ...optionProps} = props;

  switch (optionType) {
    case SignInOptionType.UsernamePassword:
      return <UsernamePassword {...optionProps} />;

    case SignInOptionType.IdentifierFirst:
      return <IdentifierFirst {...optionProps} />;

    case SignInOptionType.GoogleButton:
      return <GoogleButton {...optionProps} />;

    case SignInOptionType.GitHubButton:
      return <GitHubButton {...optionProps} />;

    case SignInOptionType.MicrosoftButton:
      return <MicrosoftButton {...optionProps} />;

    case SignInOptionType.FacebookButton:
      return <FacebookButton {...optionProps} />;

    case SignInOptionType.LinkedInButton:
      return <LinkedInButton {...optionProps} />;

    case SignInOptionType.SignInWithEthereumButton:
      return <SignInWithEthereumButton {...optionProps} />;

    case SignInOptionType.EmailOtp:
      return <EmailOtp {...optionProps} />;

    case SignInOptionType.Totp:
      return <Totp {...optionProps} />;

    case SignInOptionType.SmsOtp:
      return <SmsOtp {...optionProps} />;

    case SignInOptionType.SocialLogin:
      // Legacy fallback for generic social login
      return <SocialLogin {...optionProps} />;

    default:
      // Fallback to username/password
      return <UsernamePassword {...optionProps} />;
  }
};

/**
 * Convenience function that automatically determines the option type and creates the component.
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
  const optionType = getSignInOptionType(authenticator);

  return createSignInOption({
    optionType,
    authenticator,
    formValues,
    isLoading,
    onInputChange,
    onSubmit,
    ...options,
  });
};
