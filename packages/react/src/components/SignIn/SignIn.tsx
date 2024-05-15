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
} from '@asgardeo/js-ui-core';
import {CircularProgress, ThemeProvider} from '@oxygen-ui/react';
import {FC, ReactElement, useContext, useEffect, useState} from 'react';
import BasicAuth from './fragments/BasicAuth';
import LoginOptionsBox from './fragments/LoginOptionsBox';
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

const SignIn: FC<SignInProps> = (props: SignInProps) => {
  const {brandingProps} = props;
  const [authResponse, setAuthResponse] = useState<AuthApiResponse>();
  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [Alert, setAlert] = useState<AlertType>();
  const [showSelfSignUp, setShowSelfSignUp] = useState(true);
  const [componentBranding, setComponentBranding] = useState<Branding>();

  const {isAuthenticated} = useAuthentication();

  const authContext: AuthContext | undefined = useContext(AsgardeoContext);

  const {config} = useConfig();

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
        setAlert({alertType: {error: true}, message: error.message});
        setIsComponentLoading(false);
        throw new AsgardeoUIException('REACT_UI-SIGN_IN-SI-SE01', 'Authorization failed', error.stack);
      });
  }, [brandingPreference, brandingProps]);

  /**
   * Handles the generalized authentication process.
   * @param {any} authParams - The authentication parameters.
   */
  const handleAuthenticate = async (authenticatorId: string, authParams?: {[key: string]: string}): Promise<void> => {
    if (authResponse === undefined) {
      throw new AsgardeoUIException('REACT_UI-SIGN_IN-HA-IV02', 'Auth response is undefined.');
    }

    setIsComponentLoading(true);

    const resp: AuthApiResponse = await authenticate({
      flowId: authResponse.flowId,
      selectedAuthenticator: {
        authenticatorId,
        params: authParams,
      },
    });

    if (!authParams) {
      const metaData: Metadata = resp.nextStep.authenticators[0].metadata;
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

      // TODO: Move this to core: and take from i18n
      setAlert({alertType: {error: true}, message: 'authentication failed'});
    } else {
      setAuthResponse(resp);
      setShowSelfSignUp(false);
    }

    setIsComponentLoading(false);
  };

  const renderLoginOptions = (authenticators: Authenticator[]): ReactElement[] => {
    const LoginOptions: ReactElement[] = [];

    authenticators.forEach((authenticator: Authenticator) => {
      LoginOptions.push(
        <LoginOptionsBox
          socialName={authenticator.authenticator}
          displayName={authenticator.idp}
          handleOnClick={(): Promise<void> => handleAuthenticate(authenticator.authenticatorId)}
          key={authenticator.authenticatorId}
        />,
      );
    });

    return LoginOptions;
  };

  const renderSignIn = (): ReactElement => {
    const {authenticators} = authResponse.nextStep;
    let SignInCore: JSX.Element = <div />;

    if (authenticators) {
      let usernamePassword: boolean = false;
      let isMultipleAuthenticators: boolean = false;
      let usernamePasswordID: string = '';

      if (authenticators.length > 1) {
        isMultipleAuthenticators = true;
      }

      authenticators.forEach((authenticator: Authenticator) => {
        if (authenticator.authenticator === 'Username & Password') {
          usernamePassword = true;
          usernamePasswordID = authenticator.authenticatorId;
          SignInCore = (
            <BasicAuth
              brandingProps={brandingProps}
              authenticatorId={authenticator.authenticatorId}
              handleAuthenticate={handleAuthenticate}
              showSelfSignUp={showSelfSignUp}
              isAlert={Alert}
              renderLoginOptions={renderLoginOptions(
                authenticators.filter((auth: Authenticator) => auth.authenticatorId !== usernamePasswordID),
              )}
            />
          );
        }
      });

      if (authenticators.length === 1) {
        if (authenticators[0].authenticator === 'TOTP') {
          SignInCore = (
            <Totp
              brandingProps={brandingProps}
              authenticatorId={authenticators[0].authenticatorId}
              isAlert={Alert}
              handleAuthenticate={handleAuthenticate}
            />
          );
        } else if (
          // TODO: change after api based auth gets fixed
          new SPACryptoUtils()
            .base64URLDecode(authResponse.nextStep.authenticators[0].authenticatorId)
            .split(':')[0] === 'email-otp-authenticator'
        ) {
          SignInCore = <EmailOtp />;
        }
      }
    }

    return SignInCore;
  };

  if (isComponentLoading) {
    return (
      <div className="circular-progress-holder">
        <CircularProgress className="circular-progress" />
      </div>
    );
  }

  const imgUrl: string = brandingPreference?.preference?.theme?.LIGHT?.images?.logo?.imgURL;

  return (
    <ThemeProvider theme={generateThemeSignIn(componentBranding?.preference.theme)}>
      <UISignIn>
        <UISignIn.Image src={imgUrl} />
        {authResponse?.flowStatus !== FlowStatus.SuccessCompleted && !isAuthenticated && (
          <>
            {renderSignIn()}
            <UISignIn.Footer />
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
