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
  AuthApiResponse,
  AuthClient,
  Crypto,
  MeAPIResponse,
  Store,
  UIAuthClient,
  getProfileInformation,
} from '@asgardeo/js';
import {FC, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import BrandingPreferenceProvider from './BrandingPreferenceProvider';
import I18nProvider from './I18nProvider';
import AsgardeoContext from '../contexts/asgardeo-context';
import AsgardeoProviderProps from '../models/asgardeo-provider-props';
import AuthContext from '../models/auth-context';
import SPACryptoUtils from '../utils/crypto-utils';
import SessionStore from '../utils/session-store';

/**
 * `AsgardeoProvider` is a component that provides an Asgardeo context to all its children.
 * It takes an object of type `AsgardeProviderProps` as props, which includes the children to render,
 * a configuration object, a store instance, and a branding object.
 *
 * @param {PropsWithChildren<AsgardeoProviderProps>} props - The properties passed to the component.
 * @param {ReactNode} props.children - The children to render inside the provider.
 * @param {Config} props.config - The configuration object for the Asgardeo context.
 * @param {Store} [props.store] - An optional store instance. If not provided, a new SessionStore will be created.
 * @param {Branding} props.branding - The branding object for the Asgardeo context.
 *
 * @returns {ReactElement} A React element that provides the Asgardeo context to all its children.
 */
const AsgardeoProvider: FC<PropsWithChildren<AsgardeoProviderProps>> = (
  props: PropsWithChildren<AsgardeoProviderProps>,
) => {
  const {children, config, store, branding} = props;

  const [accessToken, setAccessToken] = useState<string>('');
  const [isSignedIn, setIsAuthenticated] = useState<boolean>();
  const [user, setUser] = useState<MeAPIResponse>();
  const [isBrandingLoading, setIsBrandingLoading] = useState<boolean>(true);
  const [isTextLoading, setIsTextLoading] = useState<boolean>(true);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [isComponentLoading, setIsComponentLoading] = useState<boolean>(true);
  const [authResponse, setAuthResponse] = useState<AuthApiResponse>();
  const [username, setUsername] = useState<string>('');

  const onSignInRef: React.MutableRefObject<Function> = useRef<Function>();
  const onSignOutRef: React.MutableRefObject<Function> = useRef<Function>();

  const setOnSignIn: (newOnSignIn: Function) => void = useCallback(
    (newOnSignIn: Function): void => {
      onSignInRef.current = newOnSignIn;
    },
    [], // Add any dependencies here...
  );

  const setOnSignOut: (newOnSignOut: Function) => void = useCallback(
    (newOnSignOut: Function): void => {
      onSignOutRef.current = newOnSignOut;
    },
    [], // Add any dependencies here...
  );

  const storeInstance: Store = store || new SessionStore();

  const spaUtils: Crypto = new SPACryptoUtils();

  const authClient: UIAuthClient = AuthClient.getInstance(config, storeInstance, spaUtils);

  /**
   * Sets the authentication status and access token.
   */
  const setAuthentication: () => void = useCallback((): void => {
    authClient.isSignedIn().then((isAuth: boolean) => {
      setIsAuthenticated(isAuth);

      if (isAuth) {
        authClient.getAccessToken().then((accessTokenFromClient: string) => {
          if (accessTokenFromClient) {
            setAccessToken(accessTokenFromClient);

            getProfileInformation().then((response: MeAPIResponse) => {
              setUser(response);
            });

            if (onSignInRef.current) {
              onSignInRef.current();
            }
          }
        });
      }
    });
  }, [authClient]);

  useEffect(() => {
    setAuthentication();

    /**
     * This script is added so that the popup window can send the code and state to the parent window
     */
    const url: URL = new URL(window.location.href);
    if (url.searchParams.has('code') && url.searchParams.has('state')) {
      const code: string = url.searchParams.get('code');
      const state: string = url.searchParams.get('state');

      /**
       * Send the 'code' and 'state' to the parent window and close the current window (popup)
       */
      window.opener.postMessage({code, state}, config.afterSignInUrl);
      window.close();
    }
  }, [config.afterSignInUrl, setAuthentication]);

  const value: AuthContext = useMemo(
    () => ({
      accessToken,
      authResponse,
      config,
      isAuthLoading,
      isSignedIn,
      isBrandingLoading,
      isComponentLoading,
      isGlobalLoading: isAuthLoading || isBrandingLoading || isComponentLoading || isTextLoading,
      isTextLoading,
      onSignOutRef,
      setAuthResponse,
      setAuthentication,
      setIsAuthLoading,
      setIsBrandingLoading,
      setIsComponentLoading,
      setIsTextLoading,
      setOnSignIn,
      setOnSignOut,
      setUsername,
      user,
      username,
    }),
    [
      accessToken,
      authResponse,
      config,
      isAuthLoading,
      isSignedIn,
      isBrandingLoading,
      isComponentLoading,
      isTextLoading,
      setAuthResponse,
      setAuthentication,
      setIsComponentLoading,
      setOnSignIn,
      setOnSignOut,
      setUsername,
      user,
      username,
    ],
  );

  return (
    <AsgardeoContext.Provider value={value}>
      <BrandingPreferenceProvider branding={branding}>
        <I18nProvider providerLocaleOverride={branding?.locale} providerTextOverrides={branding?.preference?.text}>
          {children}
        </I18nProvider>
      </BrandingPreferenceProvider>
    </AsgardeoContext.Provider>
  );
};

export default AsgardeoProvider;
