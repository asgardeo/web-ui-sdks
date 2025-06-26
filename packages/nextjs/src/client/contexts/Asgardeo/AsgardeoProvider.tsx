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

'use client';

import {EmbeddedFlowExecuteRequestConfig, EmbeddedSignInFlowHandleRequestPayload, User} from '@asgardeo/node';
import {I18nProvider, FlowProvider, UserProvider, ThemeProvider, AsgardeoProviderProps} from '@asgardeo/react';
import {FC, PropsWithChildren, useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import AsgardeoContext from './AsgardeoContext';
import {getIsSignedInAction, getUserAction} from '../../../server/actions/authActions';

/**
 * Props interface of {@link AsgardeoClientProvider}
 */
export type AsgardeoClientProviderProps = AsgardeoProviderProps;

const AsgardeoClientProvider: FC<PropsWithChildren<AsgardeoClientProviderProps>> = ({
  children,
  signIn,
  signOut,
  preferences,
}: PropsWithChildren<AsgardeoClientProviderProps>) => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (!preferences?.theme?.mode || preferences.theme.mode === 'system') {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      setIsDarkMode(preferences.theme.mode === 'dark');
    }
  }, [preferences?.theme?.mode]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        const sessionResult = await getIsSignedInAction();

        setIsSignedIn(sessionResult.isSignedIn);

        if (sessionResult.isSignedIn) {
          const userResult = await getUserAction();

          if (userResult.user) {
            setUser(userResult.user);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        setIsSignedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignIn = async (
    payload: EmbeddedSignInFlowHandleRequestPayload,
    request: EmbeddedFlowExecuteRequestConfig,
  ) => {
    try {
      const result = await signIn(payload, request);

      if (result?.afterSignInUrl) {
        router.push(result.afterSignInUrl);
        return {redirected: true, location: result.afterSignInUrl};
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      const result = await signOut();

      if (result?.afterSignOutUrl) {
        router.push(result.afterSignOutUrl);
        return {redirected: true, location: result.afterSignOutUrl};
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      isSignedIn,
      isLoading,
      signIn: handleSignIn,
      signOut: handleSignOut,
    }),
    [user, isSignedIn, isLoading],
  );

  return (
    <AsgardeoContext.Provider value={contextValue}>
      <I18nProvider preferences={preferences?.i18n}>
        <ThemeProvider theme={preferences?.theme?.overrides} defaultColorScheme={isDarkMode ? 'dark' : 'light'}>
          <FlowProvider>
            <UserProvider
              profile={{
                schemas: [],
                profile: user || {},
                flattenedProfile: user || {},
              }}
            >
              {children}
            </UserProvider>
          </FlowProvider>
        </ThemeProvider>
      </I18nProvider>
    </AsgardeoContext.Provider>
  );
};

export default AsgardeoClientProvider;
