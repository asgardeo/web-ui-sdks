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

import {signOut as signOutApiCall} from '@asgardeo/js';
import {useContext} from 'react';
import AsgardeoContext from '../contexts/asgardeo-context';
import AuthContext from '../models/auth-context';
import UseAuthentication from '../models/use-authentication';

/**
 * `useAuthentication` is a custom hook that provides access to the authentication context.
 * It returns an object containing the current user, the authentication status, the access token, and a sign out function.
 *
 * @returns {UseAuthentication} An object containing the current user (`user`), the authentication status (`isSignedIn`),
 * the access token (`accessToken`), and a sign out function (`signOut`).
 */
const useAuthentication = (): UseAuthentication => {
  const contextValue: AuthContext = useContext(AsgardeoContext);

  const {accessToken, authResponse, isSignedIn, isGlobalLoading, setUsername, user, username} = contextValue;

  const signOut: () => void = () => {
    signOutApiCall().then(() => {
      sessionStorage.clear();
      if (contextValue.onSignOutRef.current) {
        contextValue.onSignOutRef.current();
      }
    });
  };

  return {
    accessToken,
    authResponse,
    isSignedIn,
    isGlobalLoading,
    setUsername,
    signOut,
    user,
    username,
  };
};

export default useAuthentication;
