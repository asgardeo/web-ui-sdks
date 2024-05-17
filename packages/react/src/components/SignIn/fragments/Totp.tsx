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
import {Grid, Skeleton} from '@oxygen-ui/react';
import {useState, ReactElement} from 'react';
import useTranslations from '../../../hooks/use-translations';
import TotpProps from '../../../models/totp-props';
import {SignIn as UISignIn} from '../../../oxygen-ui-react-auth-components';
import './totp.scss';

/**
 * This component renders the TOTP authentication screen.
 *
 * @param {TotpProps} props - Props injected to the component.
 * @param {AlertType} props.alert - Alert type.
 * @param {string} props.authenticator - Authenticator.
 * @param {BrandingProps} props.brandingProps - Branding props.
 * @param {Function} props.handleAuthenticate - Callback to handle authentication.
 *
 * @return {ReactElement}
 */
const Totp = ({brandingProps, authenticator, handleAuthenticate, alert}: TotpProps): ReactElement => {
  const [totp, setTotp] = useState<string>();

  const {isLoading, t} = useTranslations({
    componentLocaleOverride: brandingProps?.locale,
    componentTextOverrides: brandingProps?.preference?.text,
    screen: ScreenType.TOTP,
  });

  if (isLoading) {
    return (
      <UISignIn.Paper className="asgardeo-totp-skeleton">
        <Skeleton className="skeleton-title" variant="text" width={100} height={55} />
        <Skeleton className="skeleton-title" variant="text" width={280} height={35} />
        <Grid container>
          <Skeleton className="skeleton-pin-box" variant="rectangular" width={45} height={50} />
          <Skeleton className="skeleton-pin-box" variant="rectangular" width={45} height={50} />
          <Skeleton className="skeleton-pin-box" variant="rectangular" width={45} height={50} />
          <Skeleton className="skeleton-pin-box" variant="rectangular" width={45} height={50} />
          <Skeleton className="skeleton-pin-box" variant="rectangular" width={45} height={50} />
          <Skeleton className="skeleton-pin-box" variant="rectangular" width={45} height={50} />
        </Grid>

        <Skeleton className="skeleton-submit-button" variant="rectangular" width={300} height={40} />
      </UISignIn.Paper>
    );
  }
  return (
    <UISignIn.Paper>
      <UISignIn.Typography title>{t(keys.totp.heading)}</UISignIn.Typography>

      <UISignIn.Typography subtitle>{t(keys.totp.enter.verification.code.got.by.device)}</UISignIn.Typography>

      {alert && <UISignIn.Alert {...alert?.alertType}>{alert.key}</UISignIn.Alert>}

      <UISignIn.PinInput length={6} onPinChange={setTotp} pinValue={totp} />

      <UISignIn.Button
        color="primary"
        variant="contained"
        className="oxygen-sign-in-cta"
        type="submit"
        fullWidth
        onClick={(): void => {
          handleAuthenticate(authenticator.authenticatorId, {token: totp});
          setTotp('');
        }}
      >
        {t(keys.totp.continue)}
      </UISignIn.Button>

      <UISignIn.Typography subtitle>
        {t(keys.totp.enroll.message1)}
        <br />
        {t(keys.totp.enroll.message2)}
      </UISignIn.Typography>
    </UISignIn.Paper>
  );
};

export default Totp;
