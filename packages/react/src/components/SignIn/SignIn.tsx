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

import {
  AsgardeoUIException,
  AuthApiResponse,
  AuthClient,
  Authenticator,
  Branding,
  FlowStatus,
  Metadata,
  PromptType,
  ScreenType,
  UIAuthClient,
  authenticate,
  authorize,
  getBranding,
  keys,
} from '@asgardeo/js-ui-core';
import {CircularProgress, ThemeProvider} from '@oxygen-ui/react';
import {FC, ReactElement, useContext, useEffect, useState} from 'react';
import BasicAuth from './fragments/BasicAuth';
import EmailOtp from './fragments/EmailOtp';
import LoginOptionsBox from './fragments/LoginOptionsBox';
import SmsOtp from './fragments/SmsOtp';
import Totp from './fragments/Totp';
import AsgardeoContext from '../../contexts/asgardeo-context';
import BrandingPreferenceContext from '../../contexts/branding-preference-context';
import useAuthentication from '../../hooks/use-authentication';
import {useConfig} from '../../hooks/use-config';
import useTranslations from '../../hooks/use-translations';
import AuthContext from '../../models/auth-context';
import {AlertType, SignInProps} from '../../models/sign-in';
import {SignIn as UISignIn} from '../../oxygen-ui-react-auth-components';
import generateThemeSignIn from '../../theme/generate-theme-sign-in';
import SPACryptoUtils from '../../utils/crypto-utils';
import './sign-in.scss';

/**
 * This component provides the sign-in functionality.
 *
 * @param {SignInProps} props - Props injected to the component.
 * @param {BrandingProps} props.brandingProps - Branding related props.
 * @param {boolean} props.showSignUp - Show sign-up.
 *
 * @returns {ReactElement} - React element.
 */
const SignIn: FC<SignInProps> = (props: SignInProps): ReactElement => {
  const {brandingProps, showSignUp} = props;

  const [authResponse, setAuthResponse] = useState<AuthApiResponse>();
  const [isComponentLoading, setIsComponentLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType>();
  const [showSelfSignUp, setShowSelfSignUp] = useState<boolean>(showSignUp);
  const [componentBranding, setComponentBranding] = useState<Branding>();

  const {isAuthenticated} = useAuthentication();
  const {config} = useConfig();

  const authContext: AuthContext | undefined = useContext(AsgardeoContext);
  const brandingPreference: Branding = useContext(BrandingPreferenceContext);

  const {isLoading, t} = useTranslations({
    componentLocaleOverride: brandingProps?.locale,
    componentTextOverrides: brandingProps?.preference?.text,
    screen: ScreenType.Common,
  });

  useEffect(() => {
    getBranding({branding: brandingProps, merged: brandingPreference}).then((response: Branding) => {
      setComponentBranding(response);
    });

    /**
     * Calling authorize function and initiating the flow
     */
    authorize()
      .then((response: AuthApiResponse) => {
        setAuthResponse(response);
        setIsComponentLoading(false);
      })
      .catch((error: Error) => {
        setAlert({alertType: {error: true}, key: keys.common.error});
        setIsComponentLoading(false);
        throw new AsgardeoUIException('REACT_UI-SIGN_IN-SI-SE01', 'Authorization failed', error.stack);
      });
  }, [brandingPreference, brandingProps]);

  /**
   * Handles the generalized authentication process.
   * @param {string} authenticatorId - Authenticator ID.
   * @param {object} [authParams] - Authentication parameters.
   */
  const handleAuthenticate = async (authenticatorId: string, authParams?: {[key: string]: string}): Promise<void> => {
    setAlert(undefined);

    if (authResponse === undefined) {
      throw new AsgardeoUIException('REACT_UI-SIGN_IN-HA-IV02', 'Auth response is undefined.');
    }

    authContext.setIsAuthLoading(true);

    const resp: AuthApiResponse = await authenticate({
      flowId: authResponse.flowId,
      selectedAuthenticator: {
        authenticatorId,
        params: authParams,
      },
    }).catch((authnError: Error) => {
      setAlert({alertType: {error: true}, key: keys.common.error});
      authContext.setIsAuthLoading(false);
      throw new AsgardeoUIException('REACT_UI-SIGN_IN-HA-SE03', 'Authentication failed.', authnError.stack);
    });

    if (!authParams) {
      const metaData: Metadata = resp.nextStep?.authenticators[0]?.metadata;
      if (metaData.promptType === PromptType.RedirectionPromt) {
        /**
         * Open a popup window to handle redirection prompts
         */
        window.open(
          metaData.additionalData?.redirectUrl,
          resp.nextStep.authenticators[0].authenticator,
          'width=500,height=600',
        );

        /**
         * Add an event listener to the window to capture the message from the popup
         */
        window.addEventListener('message', function messageEventHandler(event: MessageEvent) {
          /**
           * Check the origin of the message to ensure it's from the popup window
           */
          if (event.origin !== config.signInRedirectURL) return;

          const {code, state} = event.data;

          if (code && state) {
            handleAuthenticate(resp.nextStep.authenticators[0].authenticatorId, {code, state});
          }

          /**
           * Remove the event listener
           */
          window.removeEventListener('message', messageEventHandler);
        });
      } else if (metaData.promptType === PromptType.UserPrompt) {
        setAuthResponse(resp);
      }
    } else if (resp.flowStatus === FlowStatus.SuccessCompleted && resp.authData) {
      /**
       * when the authentication is successful, generate the token
       */
      setAuthResponse(resp);

      const authInstance: UIAuthClient = AuthClient.getInstance();
      const state: string = (await authInstance.getDataLayer().getTemporaryDataParameter('state')).toString();

      await authInstance.requestAccessToken(resp.authData.code, resp.authData.session_state, state);

      authContext.setAuthentication();
    } else if (resp.flowStatus === FlowStatus.FailIncomplete) {
      setAuthResponse({
        ...resp,
        nextStep: authResponse.nextStep,
      });

      setAlert({alertType: {error: true}, key: keys.login.retry});
    } else {
      setAuthResponse(resp);
      setShowSelfSignUp(false);
    }

    authContext.setIsAuthLoading(false);
  };

  const renderLoginOptions = (authenticators: Authenticator[]): ReactElement[] => {
    const LoginOptions: ReactElement[] = [];

    authenticators.forEach((authenticator: Authenticator) => {
      const displayName: string = authenticator.idp === 'LOCAL' ? authenticator.authenticator : authenticator.idp;
      LoginOptions.push(
        <LoginOptionsBox
          isAuthLoading={authContext.isAuthLoading}
          socialName={authenticator.authenticator}
          displayName={displayName}
          handleOnClick={(): Promise<void> => handleAuthenticate(authenticator.authenticatorId)}
          key={authenticator.authenticatorId}
        />,
      );
    });

    return LoginOptions;
  };

  const renderSignIn = (): ReactElement => {
    const authenticators: Authenticator[] = authResponse?.nextStep?.authenticators;

    if (authenticators) {
      const usernamePasswordAuthenticator: Authenticator = authenticators.find(
        (authenticator: Authenticator) => authenticator.authenticator === 'Username & Password',
      );

      if (usernamePasswordAuthenticator) {
        return (
          <BasicAuth
            brandingProps={brandingProps}
            authenticator={usernamePasswordAuthenticator}
            handleAuthenticate={handleAuthenticate}
            showSelfSignUp={showSelfSignUp}
            alert={alert}
            renderLoginOptions={renderLoginOptions(
              authenticators.filter(
                (auth: Authenticator) => auth.authenticatorId !== usernamePasswordAuthenticator.authenticatorId,
              ),
            )}
          />
        );
      }

      if (authenticators.length === 1) {
        if (authenticators[0].authenticator === 'TOTP') {
          return (
            <Totp
              brandingProps={brandingProps}
              authenticator={authenticators[0]}
              alert={alert}
              handleAuthenticate={handleAuthenticate}
            />
          );
        }
        if (
          // TODO: change after api based auth gets fixed
          new SPACryptoUtils()
            .base64URLDecode(authResponse.nextStep.authenticators[0].authenticatorId)
            .split(':')[0] === 'email-otp-authenticator'
        ) {
          return (
            <EmailOtp
              alert={alert}
              brandingProps={brandingProps}
              authenticator={authenticators[0]}
              handleAuthenticate={handleAuthenticate}
            />
          );
        }

        if (
          // TODO: change after api based auth gets fixed
          new SPACryptoUtils()
            .base64URLDecode(authResponse.nextStep.authenticators[0].authenticatorId)
            .split(':')[0] === 'sms-otp-authenticator'
        ) {
          return (
            <SmsOtp
              alert={alert}
              brandingProps={brandingProps}
              authenticator={authenticators[0]}
              handleAuthenticate={handleAuthenticate}
            />
          );
        }
      }

      /**
       * If there are multiple authenticators without Username and password, render the multiple options screen
       */
      if (authenticators.length > 1) {
        return (
          <UISignIn.Paper className="asgardeo-multiple-options-paper">
            <UISignIn.Typography title className="multiple-otions-title">
              Sign In
            </UISignIn.Typography>
            {!usernamePasswordAuthenticator && alert && (
              <UISignIn.Alert className="asgardeo-sign-in-alert" {...alert?.alertType}>
                {t(alert.key)}
              </UISignIn.Alert>
            )}
            {renderLoginOptions(authenticators)}
          </UISignIn.Paper>
        );
      }
    }
    return null;
  };

  /**
   * Renders the circular progress component while the component or text is loading.
   */
  if (isComponentLoading || isLoading || authContext.isBrandingLoading) {
    return (
      <div className="circular-progress-holder">
        <CircularProgress className="circular-progress" />
      </div>
    );
  }

  const imgUrl: string = brandingPreference?.preference?.theme?.LIGHT?.images?.logo?.imgURL;
  let copyrightText: string = t(keys.common.copyright);

  if (copyrightText.includes('{{currentYear}}')) {
    copyrightText = copyrightText.replace('{{currentYear}}', new Date().getFullYear().toString());
  }

  return (
    <ThemeProvider theme={generateThemeSignIn(componentBranding?.preference.theme)}>
      <UISignIn className="asgardeo-sign-in">
        {!(isLoading || isComponentLoading) && <UISignIn.Image className="asgardeo-sign-in-logo" src={imgUrl} />}
        {authResponse?.flowStatus !== FlowStatus.SuccessCompleted && !isAuthenticated && (
          <>
            {renderSignIn()}

            {!(isLoading || isComponentLoading) && (
              <UISignIn.Footer
                className="asgardeo-sign-in-footer"
                copyrights={{children: copyrightText}}
                items={[
                  {
                    children: (
                      <UISignIn.Link href={componentBranding.preference.urls.privacyPolicyURL}>
                        {t(keys.common.privacy.policy)}
                      </UISignIn.Link>
                    ),
                  },
                  {
                    children: (
                      <UISignIn.Link href={componentBranding.preference.urls.termsOfUseURL}>
                        {t(keys.common.terms.of.service)}
                      </UISignIn.Link>
                    ),
                  },
                  {children: <UISignIn.Typography>{componentBranding?.locale ?? 'en-US'}</UISignIn.Typography>},
                ]}
              />
            )}
          </>
        )}
        {(authResponse?.flowStatus === FlowStatus.SuccessCompleted || isAuthenticated) && (
          <div style={{backgroundColor: 'white', padding: '1rem'}}>Successfully Authenticated</div>
        )}
      </UISignIn>
    </ThemeProvider>
  );
};

export default SignIn;
