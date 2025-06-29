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
import AsgardeoContext, {AsgardeoContextProps} from './AsgardeoContext';
import {getUserAction} from '../../../server/actions/authActions';

/**
 * Props interface of {@link AsgardeoClientProvider}
 */
export type AsgardeoClientProviderProps = Partial<Omit<AsgardeoProviderProps, 'baseUrl' | 'clientId'>> &
  Pick<AsgardeoProviderProps, 'baseUrl' | 'clientId'> & {
    signOut: AsgardeoContextProps['signOut'];
    signIn: AsgardeoContextProps['signIn'];
    isSignedIn: boolean;
  };

const AsgardeoClientProvider: FC<PropsWithChildren<AsgardeoClientProviderProps>> = ({
  children,
  signIn,
  signOut,
  preferences,
  isSignedIn,
  signInUrl,
}: PropsWithChildren<AsgardeoClientProviderProps>) => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!preferences?.theme?.mode || preferences.theme.mode === 'system') {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      setIsDarkMode(preferences.theme.mode === 'dark');
    }
  }, [preferences?.theme?.mode]);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    (async () => {
      try {
        setIsLoading(true);

        if (isSignedIn) {
          console.log('[AsgardeoClientProvider] Fetching user data...');
          const userResult = await getUserAction();

          console.log('[AsgardeoClientProvider] User fetched:', userResult);
          setUser(userResult?.data?.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isSignedIn]);

  const handleSignIn = async (
    payload: EmbeddedSignInFlowHandleRequestPayload,
    request: EmbeddedFlowExecuteRequestConfig,
  ) => {
    try {
      const result = await signIn(payload, request);

      if (result?.data?.afterSignInUrl) {
        router.push(result.data.afterSignInUrl);
        return {redirected: true, location: result.data.afterSignInUrl};
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      return result?.data ?? result;
    } catch (error) {
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      const result = await signOut();

      if (result?.data?.afterSignOutUrl) {
        router.push(result.data.afterSignOutUrl);
        return {redirected: true, location: result.data.afterSignOutUrl};
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      return result?.data ?? result;
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
      signInUrl,
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
