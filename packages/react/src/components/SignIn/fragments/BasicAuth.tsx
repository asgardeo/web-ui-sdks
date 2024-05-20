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
import {CircularProgress, Grid} from '@oxygen-ui/react';
import {useState} from 'react';
import useTranslations from '../../../hooks/use-translations';
import BasicAuthProps from '../../../models/basic-auth-props';
import {SignIn as UISignIn} from '../../../oxygen-ui-react-auth-components';

/**
 * This component renders the basic authentication form.
 *
 * @param {BasicAuthProps} props - Props injected to the basic authentication component.
 * @param {BrandingProps} props.brandingProps - Branding props.
 * @param {Function} props.handleAuthenticate - Callback to handle authentication.
 * @param {Authenticator} props.authenticator - Authenticator.
 * @param {AlertType} props.alert - Alert type.
 * @param {ReactElement[]} props.renderLoginOptions - Login options.
 * @param {boolean} props.showSelfSignUp - Show self sign up.
 *
 * @return {JSX.Element}
 */
const BasicAuth = ({
  handleAuthenticate,
  authenticator,
  alert,
  brandingProps,
  showSelfSignUp,
  renderLoginOptions,
}: BasicAuthProps): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {t, isLoading} = useTranslations({
    componentLocaleOverride: brandingProps?.locale,
    componentTextOverrides: brandingProps?.preference?.text,
    screen: ScreenType.Login,
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
      <UISignIn.Typography title>{t(keys.login.login.heading)}</UISignIn.Typography>

      {alert && <UISignIn.Alert {...alert?.alertType}>{t(alert.key)}</UISignIn.Alert>}

      <UISignIn.TextField
        fullWidth
        autoComplete="off"
        label={t(keys.login.username)}
        name="text"
        value={username}
        placeholder={t(keys.login.enter.your.username)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setUsername(e.target.value)}
      />

      <UISignIn.TextField
        fullWidth
        name="password"
        autoComplete="new-password"
        label={t(keys.login.password)}
        type="password"
        value={password}
        placeholder={t(keys.login.enter.your.password)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
      />

      <UISignIn.Button
        color="primary"
        variant="contained"
        type="submit"
        fullWidth
        onClick={(): void => {
          handleAuthenticate(authenticator.authenticatorId, {password, username});
          setUsername('');
          setPassword('');
        }}
      >
        {t(keys.login.button)}
      </UISignIn.Button>

      {showSelfSignUp && (
        <Grid container>
          <UISignIn.Typography>{t(keys.common.prefix.register)}</UISignIn.Typography>
          <UISignIn.Link href="./register" className="asgardeo-register-link">
            {t(keys.common.register)}
          </UISignIn.Link>
        </Grid>
      )}

      {renderLoginOptions.length !== 0 && <UISignIn.Divider> {t(keys.common.or)} </UISignIn.Divider>}

      {renderLoginOptions}
    </UISignIn.Paper>
  );
};

export default BasicAuth;
