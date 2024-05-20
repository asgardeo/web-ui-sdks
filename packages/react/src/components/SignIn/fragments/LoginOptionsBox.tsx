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

import {ReactElement} from 'react';
import emailSolid from '../../../assets/email-solid.svg';
import facebook from '../../../assets/social-logins/facebook.svg';
import github from '../../../assets/social-logins/github.svg';
import google from '../../../assets/social-logins/google.svg';
import microsoft from '../../../assets/social-logins/microsoft.svg';
import LoginOptionsBoxProps from '../../../models/login-options-box-props';
import {SignIn as UISignIn} from '../../../oxygen-ui-react-auth-components';

const images: {[key: string]: string} = {
  'Email OTP': emailSolid,
  Facebook: facebook,
  Github: github,
  Google: google,
  Microsoft: microsoft,
};

/**
 * This component renders the login options box.
 *
 * @param {LoginOptionsBoxProps} props - Props injected to the component.
 * @param {string} props.socialName - Name of the social login.
 * @param {string} props.displayName - Display name of the social login.
 * @param {Function} props.handleOnClick - On click handler.
 * @return {ReactElement}
 */
const LoginOptionsBox = ({
  isAuthLoading,
  socialName,
  displayName,
  handleOnClick,
}: LoginOptionsBoxProps): ReactElement => (
  <UISignIn.Button
    social
    startIcon={<img className="social-login-img" src={images[socialName]} alt={socialName} />}
    onClick={handleOnClick}
    disabled={isAuthLoading}
  >
    Sign In with {displayName}
  </UISignIn.Button>
);

export default LoginOptionsBox;
