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

import {FC, PropsWithChildren, useEffect, useMemo, useState} from 'react';
import {I18nProvider, FlowProvider, UserProvider, ThemeProvider} from '@asgardeo/react';
import {User} from '@asgardeo/node';
import AsgardeoContext from './AsgardeoContext';
import InternalAuthAPIRoutesConfig from '../../../configs/InternalAuthAPIRoutesConfig';

/**
 * Props interface of {@link AsgardeoClientProvider}
 */
export type AsgardeoClientProviderProps = {
  /**
   * Preferences for theming, i18n, and other UI customizations.
   */
  preferences?: any;
};

const AsgardeoClientProvider: FC<PropsWithChildren<AsgardeoClientProviderProps>> = ({
  children,
  preferences,
}: PropsWithChildren<AsgardeoClientProviderProps>) => {
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

        const sessionResponse = await fetch(InternalAuthAPIRoutesConfig.session);
        const sessionData = await sessionResponse.json();
        setIsSignedIn(sessionData.isSignedIn);

        if (sessionData.isSignedIn) {
          const userResponse = await fetch(InternalAuthAPIRoutesConfig.user);

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
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

  const contextValue = useMemo(
    () => ({
      user,
      isSignedIn,
      isLoading,
      signIn: () => (window.location.href = InternalAuthAPIRoutesConfig.signIn),
      signOut: () => (window.location.href = InternalAuthAPIRoutesConfig.signOut),
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
