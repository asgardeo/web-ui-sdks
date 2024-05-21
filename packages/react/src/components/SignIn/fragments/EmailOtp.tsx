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

import {ScreenType, keys} from '@asgardeo/js-ui-core';
import {CircularProgress, Skeleton} from '@oxygen-ui/react';
import {ReactElement, useContext, useState} from 'react';
import AsgardeoContext from '../../../contexts/asgardeo-context';
import useTranslations from '../../../hooks/use-translations';
import EmailOtpProps from '../../../models/email-otp-props';
import {SignIn as UISignIn} from '../../../oxygen-ui-react-auth-components';
import './email-otp.scss';

/**
 * Email OTP component.
 *
 * @param {EmailOtpProps} props - Props injected to the component.
 * @param {BrandingProps} props.brandingProps - Branding props.
 * @param {Authenticator} props.authenticator - Authenticator.
 * @param {Function} props.handleAuthenticate - Callback to handle authentication.
 * @param {AlertType} props.alert - Alert type.
 * @return {ReactElement}
 */
const EmailOtp = ({alert, brandingProps, authenticator, handleAuthenticate}: EmailOtpProps): ReactElement => {
  const [inputValue, setInputValue] = useState<string>();
  const [isContinueLoading, setIsContinueLoading] = useState<boolean>(false);
  const [isResendLoading, setIsResendLoading] = useState<boolean>(false);

  const {isAuthLoading} = useContext(AsgardeoContext);

  const param: string = authenticator?.metadata?.params[0]?.param;
  /**
   * Temporary i18n mapping.
   * TODO: Remove once the i18n keys are implemented correctly in the API response.
   */
  const i18nMapping: {[key: string]: {heading: string; inputLabel: string; placeholder?: string}} = {
    OTPCode: {heading: keys.emailOtp.email.heading, inputLabel: keys.emailOtp.enter.verification.code.got.by.device},
    username: {
      heading: keys.emailOtp.email.otp.heading,
      inputLabel: keys.emailOtp.username.label,
      placeholder: keys.emailOtp.username.placeholder,
    },
  };

  const {isLoading, t} = useTranslations({
    componentLocaleOverride: brandingProps?.locale,
    componentTextOverrides: brandingProps?.preference?.text,
    screen: ScreenType.EmailOTP,
  });

  if (isLoading) {
    return (
      <UISignIn.Paper className="asgardeo-email-otp-skeleton">
        <Skeleton className="skeleton-title" variant="text" width={100} height={55} />
        <Skeleton className="skeleton-text-field-label" variant="text" width={70} />
        <Skeleton variant="rectangular" width={300} height={40} />
        <Skeleton className="skeleton-submit-button" variant="rectangular" width={270} height={40} />
      </UISignIn.Paper>
    );
  }

  return (
    <UISignIn.Paper className="asgardeo-email-otp-paper">
      <UISignIn.Typography title>{t(i18nMapping[param].heading)}</UISignIn.Typography>

      {alert && <UISignIn.Alert {...alert?.alertType}>{alert.key}</UISignIn.Alert>}

      <UISignIn.TextField
        fullWidth
        autoComplete="off"
        label={t(i18nMapping[param].inputLabel) ?? param}
        name="text"
        value={inputValue}
        type={param === 'OTPCode' ? 'password' : undefined}
        placeholder={param === 'username' ? t(i18nMapping[param].placeholder) : undefined}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setInputValue(e.target.value)}
      />

      <UISignIn.Button
        fullWidth
        variant="contained"
        type="submit"
        disabled={isAuthLoading}
        onClick={(): void => {
          handleAuthenticate(authenticator.authenticatorId, {[authenticator.requiredParams[0]]: inputValue});
          setInputValue('');
          setIsResendLoading(false);
          setIsContinueLoading(true);
        }}
      >
        {t(keys.emailOtp.continue)}
        {isAuthLoading && isContinueLoading && <CircularProgress className="sign-in-button-progress" />}
      </UISignIn.Button>

      {param === 'OTPCode' && (
        <UISignIn.Button
          className="email-otp-resend-button"
          color="secondary"
          disabled={isAuthLoading}
          variant="contained"
          onClick={(): void => {
            handleAuthenticate(authenticator.authenticatorId);
            setInputValue('');
            setIsContinueLoading(false);
            setIsResendLoading(true);
          }}
        >
          {t(keys.emailOtp.resend.code)}
          {isAuthLoading && isResendLoading && <CircularProgress className="sign-in-button-progress" />}
        </UISignIn.Button>
      )}
    </UISignIn.Paper>
  );
};

export default EmailOtp;
