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

import {FC, PropsWithChildren, ReactElement, useEffect, useMemo, useState, useCallback} from 'react';
import {
  createTheme,
  Theme,
  ThemeConfig,
  ThemeMode,
  RecursivePartial,
  detectThemeMode,
  createClassObserver,
  createMediaQueryListener,
  BrowserThemeDetection,
} from '@asgardeo/browser';
import ThemeContext from './ThemeContext';

export interface ThemeProviderProps {
  theme?: RecursivePartial<ThemeConfig>;
  /**
   * The theme mode to use for automatic detection
   * - 'light': Always use light theme
   * - 'dark': Always use dark theme
   * - 'system': Use system preference (prefers-color-scheme media query)
   * - 'class': Detect theme based on CSS classes on HTML element
   */
  mode?: ThemeMode;
  /**
   * Configuration for theme detection when using 'class' or 'system' mode
   */
  detection?: BrowserThemeDetection;
}

const applyThemeToDOM = (theme: Theme) => {
  Object.entries(theme.cssVariables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
};

const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  children,
  theme: themeConfig,
  mode = 'system',
  detection = {},
}: PropsWithChildren<ThemeProviderProps>): ReactElement => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(() => {
    // Initialize with detected theme mode or fallback to defaultMode
    if (mode === 'light' || mode === 'dark') {
      return mode;
    }
    return detectThemeMode(mode, detection);
  });

  const theme = useMemo(() => createTheme(themeConfig, colorScheme === 'dark'), [themeConfig, colorScheme]);

  const handleThemeChange = useCallback((isDark: boolean) => {
    setColorScheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    setColorScheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    let observer: MutationObserver | null = null;
    let mediaQuery: MediaQueryList | null = null;

    if (mode === 'class') {
      const targetElement = detection.targetElement || document.documentElement;
      if (targetElement) {
        observer = createClassObserver(targetElement, handleThemeChange, detection);
      }
    } else if (mode === 'system') {
      mediaQuery = createMediaQueryListener(handleThemeChange);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (mediaQuery) {
        // Clean up media query listener
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleThemeChange as any);
        } else {
          // Fallback for older browsers
          mediaQuery.removeListener(handleThemeChange as any);
        }
      }
    };
  }, [mode, detection, handleThemeChange]);

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
