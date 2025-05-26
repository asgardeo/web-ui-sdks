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

import {FC, RefObject, PropsWithChildren, ReactElement, useEffect, useMemo, useRef, useState} from 'react';
import AuthAPI from '../__temp__/api';
import {AuthStateInterface} from '../__temp__/models';
import AsgardeoContext from '../contexts/AsgardeoContext';
import useBrowserUrl from '../hooks/useBrowserUrl';
import {AsgardeoReactConfig} from '../models/config';

/**
 * Props interface of {@link AsgardeoProvider}
 */
export type AsgardeoProviderProps = AsgardeoReactConfig;

const AsgardeoProvider: FC<PropsWithChildren<AsgardeoProviderProps>> = ({
  afterSignInUrl = window.location.origin,
  baseUrl,
  clientId,
  children,
}: PropsWithChildren<AsgardeoProviderProps>): ReactElement => {
  const reRenderCheckRef: RefObject<boolean> = useRef(false);
  const AuthClient: AuthAPI = useMemo(() => new AuthAPI(), []);
  const {hasAuthParams} = useBrowserUrl();

  const [state, dispatch] = useState<AuthStateInterface>(AuthClient.getState());

  useEffect(() => {
    (async (): Promise<void> => {
      await AuthClient.init({
        baseUrl,
        clientID: clientId,
        signInRedirectURL: afterSignInUrl,
      });
    })();
  }, []);

  /**
   * Try signing in when the component is mounted.
   */
  useEffect(() => {
    // React 18.x Strict.Mode has a new check for `Ensuring reusable state` to facilitate an upcoming react feature.
    // https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state
    // This will remount all the useEffects to ensure that there are no unexpected side effects.
    // When react remounts the signIn hook of the AuthProvider, it will cause a race condition. Hence, we have to
    // prevent the re-render of this hook as suggested in the following discussion.
    // https://github.com/reactwg/react-18/discussions/18#discussioncomment-795623
    if (reRenderCheckRef.current) {
      return;
    }

    reRenderCheckRef.current = true;

    (async (): Promise<void> => {
      // User is already authenticated. Skip...
      if (state.isAuthenticated) {
        return;
      }

      if (hasAuthParams(new URL(window.location.href), afterSignInUrl)) {
        try {
          await signIn(
            {callOnlyOnRedirect: true},
            // authParams?.authorizationCode,
            // authParams?.sessionState,
            // authParams?.state,
          );

          // setError(null);
        } catch (error) {
          if (error && Object.prototype.hasOwnProperty.call(error, 'code')) {
            // setError(error);
          }
        }
      }
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

  const signUp = (): void => {
    throw new Error('Not implemented');
  };

  const signOut = (callback?: (response: boolean) => void): Promise<boolean> =>
    AuthClient.signOut(dispatch, state, callback);

  const isSignedIn: boolean = state.isAuthenticated;

  return <AsgardeoContext.Provider value={{isSignedIn, signIn, signOut, signUp}}>{children}</AsgardeoContext.Provider>;
};

export default AsgardeoProvider;
