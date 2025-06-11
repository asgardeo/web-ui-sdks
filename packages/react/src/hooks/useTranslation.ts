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

import {useContext} from 'react';
import I18nContext, {I18nContextValue} from '../contexts/I18n/I18nContext';

export interface UseTranslation {
  /**
   * Translation function that returns a translated string for the given key
   */
  t: (key: string, params?: Record<string, string | number>) => string;

  /**
   * The current language code
   */
  currentLanguage: string;

  /**
   * Function to change the current language
   */
  setLanguage: (language: string) => void;

  /**
   * All available language codes
   */
  availableLanguages: string[];
}

/**
 * Hook for accessing translation functions and language management.
 * Must be used within an I18nProvider context.
 *
 * @returns An object containing translation function and language management utilities
 * @throws Error if used outside of I18nProvider context
 */
const useTranslation = (): UseTranslation => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error(
      'useTranslation must be used within an I18nProvider. Make sure your component is wrapped with AsgardeoProvider which includes I18nProvider.',
    );
  }

  const {t, currentLanguage, setLanguage, bundles} = context;

  return {
    t,
    currentLanguage,
    setLanguage,
    availableLanguages: Object.keys(bundles),
  };
};

export default useTranslation;
