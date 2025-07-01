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

import {ThemeDetection, ThemeMode} from './types';

/**
 * Detects the current theme mode based on the specified method
 */
export const detectThemeMode = (mode: ThemeMode, config: ThemeDetection = {}): 'light' | 'dark' => {
  const {
    darkClass = 'dark',
    lightClass = 'light',
    targetElement = typeof document !== 'undefined' ? document.documentElement : null,
  } = config;

  if (typeof window === 'undefined') {
    return 'light'; // Default to light mode on server side
  }

  switch (mode) {
    case 'dark':
      return 'dark';
    case 'light':
      return 'light';
    case 'system':
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    case 'class':
      if (!targetElement) {
        console.warn('ThemeProvider: Target element not available for class-based theme detection');
        return 'light';
      }

      // Check for dark class first, then light class, then default to light
      if (targetElement.classList.contains(darkClass)) {
        return 'dark';
      }
      if (targetElement.classList.contains(lightClass)) {
        return 'light';
      }

      // If neither class is present, default to light
      return 'light';
    default:
      return 'light';
  }
};

/**
 * Creates a MutationObserver to watch for class changes on the target element
 */
export const createClassObserver = (
  targetElement: HTMLElement,
  callback: (isDark: boolean) => void,
  config: ThemeDetection = {},
): MutationObserver => {
  const {darkClass = 'dark', lightClass = 'light'} = config;

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const classList = (mutation.target as HTMLElement).classList;
        const isDark = classList.contains(darkClass);
        callback(isDark);
      }
    });
  });

  observer.observe(targetElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  return observer;
};

/**
 * Creates a media query listener for system theme changes
 */
export const createMediaQueryListener = (callback: (isDark: boolean) => void): MediaQueryList | null => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return null;
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  // Use addEventListener if available, otherwise use deprecated addListener
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
  }

  return mediaQuery;
};
