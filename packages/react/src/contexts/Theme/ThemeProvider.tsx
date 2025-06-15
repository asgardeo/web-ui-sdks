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
import {createTheme, Theme, ThemeConfig, RecursivePartial} from '@asgardeo/browser';
import ThemeContext from './ThemeContext';

export interface ThemeProviderProps {
  theme?: RecursivePartial<ThemeConfig>;
  defaultColorScheme?: 'light' | 'dark';
}

const applyThemeToDOM = (theme: Theme) => {
  Object.entries(theme.cssVariables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
};

const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  children,
  theme: themeConfig,
  defaultColorScheme = 'light',
}: PropsWithChildren<ThemeProviderProps>): ReactElement => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(defaultColorScheme);

  const theme = useMemo(() => createTheme(themeConfig, colorScheme === 'dark'), [themeConfig, colorScheme]);

  const toggleTheme = () => {
    setColorScheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const value = {
    theme,
    colorScheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
