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

import {FC, JSX, ReactElement} from 'react';
import Button from '../../../primitives/Button/Button';
import {BaseSignInOptionProps} from './SignInOptionFactory';
import {
  ApplicationNativeAuthenticationConstants,
  ApplicationNativeAuthenticationAuthenticatorKnownIdPType,
} from '@asgardeo/browser';
import useTranslation from '../../../../hooks/useTranslation';

/**
 * Multi Option Button Component.
 * Renders authenticators as selectable buttons for multi-option prompts.
 * Used when authenticators don't require immediate user input but need to be selected first.
 */
const MultiOptionButton: FC<BaseSignInOptionProps> = ({
  authenticator,
  isLoading,
  onSubmit,
  buttonClassName = '',
  preferences,
}) => {
  const {t} = useTranslation(preferences?.i18n);

  /**
   * Get display name for the authenticator.
   */
  const getDisplayName = (): string => {
    let authenticatorName = authenticator.authenticator;

    if (authenticator.idp !== ApplicationNativeAuthenticationAuthenticatorKnownIdPType.Local) {
      authenticatorName = authenticator.idp;
    }

    switch (authenticatorName) {
      default:
        return t('elements.buttons.multi.option', {connection: authenticatorName});
    }
  };

  /**
   * Get appropriate icon for the authenticator type.
   */
  const getIcon = (): ReactElement | null => {
    const authenticatorId: string = authenticator.authenticatorId;

    switch (authenticatorId) {
      case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.SmsOtp:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 0 0-1.02.24l-2.2 2.2a15.074 15.074 0 0 1-6.59-6.59l2.2-2.2c.27-.27.35-.67.24-1.02A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1M12 3v10l3-3h6V3z"
            />
          </svg>
        );
      case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.EmailOtp:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5z"
            />
          </svg>
        );
      case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.Totp:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5z" />
          </svg>
        );
      case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.PushNotification:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m1-13h-2v6h2zm0 8h-2v2h2z"
            />
          </svg>
        );
      case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.Passkey:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m1-13h-2v6h2zm0 8h-2v2h2z"
            />
          </svg>
        );
      case ApplicationNativeAuthenticationConstants.SupportedAuthenticators.MagicLink:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m1-13h-2v6h2zm0 8h-2v2h2z"
            />
          </svg>
        );
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"
            />
          </svg>
        );
    }
  };

  /**
   * Handle button click.
   */
  const handleClick = () => {
    // For multi-option buttons, we call onSubmit without form data
    // This will trigger the authenticator selection and likely move to the next step
    onSubmit(authenticator);
  };

  return (
    <Button
      type="button"
      variant="outline"
      color="primary"
      fullWidth
      disabled={isLoading}
      loading={isLoading}
      onClick={handleClick}
      className={buttonClassName}
      startIcon={getIcon()}
    >
      {getDisplayName()}
    </Button>
  );
};

export default MultiOptionButton;
