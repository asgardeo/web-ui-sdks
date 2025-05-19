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

import {FC, PropsWithChildren, ReactElement, useEffect, useMemo, useState} from 'react';
import AsgardeoContext from '../contexts/AsgardeoContext';
import AuthAPI from '../__temp__/api';
import {AuthStateInterface} from '../__temp__/models';

export interface AuthenticationFlowBuilderProviderProps {
  /**
   * The base URL of the Asgardeo server.
   */
  baseUrl: string;
  /**
   * The client ID of the Asgardeo application.
   */
  clientId: string;
}

const AsgardeoProvider: FC<PropsWithChildren<AuthenticationFlowBuilderProviderProps>> = ({
  baseUrl,
  clientId,
  children,
}: PropsWithChildren<AuthenticationFlowBuilderProviderProps>): ReactElement => {
  const AuthClient: AuthAPI = useMemo(() => {
    return new AuthAPI();
  }, []);

  const [state, dispatch] = useState<AuthStateInterface>(AuthClient.getState());

  useEffect(() => {
    (async () => {
      await AuthClient.init({
        baseUrl,
        clientID: clientId,
        signInRedirectURL: window.location.origin,
      });
    })();
  }, []);

  const signIn = async (
    config?: any,
    authorizationCode?: string,
    sessionState?: string,
    authState?: string,
    callback?: (response: any) => void,
    tokenRequestConfig?: {
      params: Record<string, unknown>;
    },
  ): Promise<any> => {
    // const _config = await AuthClient.getConfigData();

    // // NOTE: With React 19 strict mode, the initialization logic runs twice, and there's an intermittent
    // // issue where the config object is not getting stored in the storage layer with Vite scaffolding.
    // // Hence, we need to check if the client is initialized but the config object is empty, and reinitialize.
    // // Tracker: https://github.com/asgardeo/asgardeo-auth-react-sdk/issues/240
    // if (!_config || Object.keys(_config).length === 0) {
    //     await AuthClient.init(mergedConfig);
    // }

    try {
      // setError(null);
      return await AuthClient.signIn(
        dispatch,
        state,
        config,
        authorizationCode,
        sessionState,
        authState,
        callback,
        tokenRequestConfig,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const signOut = (callback?: (response: boolean) => void): Promise<boolean> => {
    return AuthClient.signOut(dispatch, state, callback);
  };

  const isSignedIn: boolean = state.isAuthenticated;

  return <AsgardeoContext.Provider value={{signIn, signOut, isSignedIn}}>{children}</AsgardeoContext.Provider>;
};

export default AsgardeoProvider;
