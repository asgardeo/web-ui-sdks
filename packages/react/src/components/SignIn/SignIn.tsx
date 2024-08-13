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

import {AsgardeoUIException, AuthApiResponse, Branding, authorize, getBranding} from '@asgardeo/js';
import {FC, ReactElement, useContext, useEffect, useState} from 'react';
import SignInGeneric from './SignInGeneric';
import AsgardeoContext from '../../contexts/asgardeo-context';
import BrandingPreferenceContext from '../../contexts/branding-preference-context';
import AuthContext from '../../models/auth-context';
import {SignInProps} from '../../models/sign-in';
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
  const {brandingProps, showFooter = true, showLogo = true, showSignUp} = props;

  // const [setAlert] = useState<AlertType>();
  const [componentBranding, setComponentBranding] = useState<Branding>();

  const authContext: AuthContext | undefined = useContext(AsgardeoContext);
  const brandingPreference: Branding = useContext(BrandingPreferenceContext);

  useEffect(() => {
    getBranding({branding: brandingProps, merged: brandingPreference}).then((response: Branding) => {
      setComponentBranding(response);
    });
  }, [brandingPreference, brandingProps]);

  useEffect(() => {
    /**
     * Calling authorize function and initiating the api based authentication flow
     */
    authorize()
      .then((response: AuthApiResponse) => {
        authContext?.setAuthResponse(response);
      })
      .catch((error: Error) => {
        // setAlert({alertType: {error: true}, key: keys.common.error});
        throw new AsgardeoUIException('REACT_UI-SIGN_IN-SI-SE01', 'Authorization failed', error.stack);
      })
      .finally(() => {
        authContext?.setIsComponentLoading(false);
      });
  }, []);

  return (
    <SignInGeneric
      showFooter={showFooter}
      showLogo={showLogo}
      showSignUp={showSignUp}
      brandingPreference={componentBranding}
      authResponse={authContext?.authResponse}
      isComponentLoading={authContext?.isComponentLoading}
    />
  );
};

export default SignIn;
