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
import AsgardeoContext from './AsgardeoContext';

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

  useEffect(() => {
    if (!preferences?.theme?.mode || preferences.theme.mode === 'system') {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      setIsDarkMode(preferences.theme.mode === 'dark');
    }
  }, [preferences?.theme?.mode]);

  return (
    <AsgardeoContext.Provider value={{}}>
      <I18nProvider preferences={preferences?.i18n}>
        <ThemeProvider theme={preferences?.theme?.overrides} defaultColorScheme={isDarkMode ? 'dark' : 'light'}>
          <FlowProvider>
            <UserProvider
              profile={{
                schemas: [],
                profile: {},
                flattenedProfile: {},
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
