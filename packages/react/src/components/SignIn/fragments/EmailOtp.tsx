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
import {CircularProgress} from '@oxygen-ui/react';
import {ReactElement, useState} from 'react';
import useTranslations from '../../../hooks/use-translations';
import EmailOtpProps from '../../../models/email-otp-props';
import {SignIn as UISignIn} from '../../../oxygen-ui-react-auth-components';

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
  const [otp, setOtp] = useState<string>();

  const {isLoading, t} = useTranslations({
    componentLocaleOverride: brandingProps?.locale,
    componentTextOverrides: brandingProps?.preference?.text,
    screen: ScreenType.EmailOTP,
  });

  if (isLoading) {
    return (
      <div className="circular-progress-holder">
        <CircularProgress className="circular-progress" />
      </div>
    );
  }

  return (
    <UISignIn.Paper>
      <UISignIn.Typography title>{t(keys.emailOtp.email.otp.heading)}</UISignIn.Typography>

      {alert && <UISignIn.Alert {...alert?.alertType}>{alert.message}</UISignIn.Alert>}

      <UISignIn.TextField
        fullWidth
        autoComplete="off"
        label={t(keys.emailOtp.enter.verification.code.got.by.device)}
        name="text"
        value={otp}
        type="password"
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setOtp(e.target.value)}
      />

      <UISignIn.Button
        fullWidth
        variant="contained"
        type="submit"
        onClick={(): void => {
          handleAuthenticate();
          setOtp('');
        }}
      >
        {t(keys.emailOtp.continue)}
      </UISignIn.Button>

      <UISignIn.Button
        className="email-otp-resend-button"
        onClick={(): void => handleAuthenticate(authenticator.authenticatorId)}
        color="secondary"
        variant="contained"
      >
        {t(keys.emailOtp.resend.code)}
      </UISignIn.Button>
    </UISignIn.Paper>
  );
};

export default EmailOtp;
