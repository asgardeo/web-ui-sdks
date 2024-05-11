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

import {Branding, getBranding} from '@asgardeo/js-ui-core';
import {ThemeProvider} from '@oxygen-ui/react';
import {FC, PropsWithChildren, useCallback, useEffect, useState} from 'react';
import BrandingPreferenceContext from '../contexts/branding-preference-context';
import generateTheme from '../customization/theme';
import getThemeSkeleton from '../customization/theme/theme-skeleton';
import BrandingPreferenceProviderProps from '../models/branding-preference-provider-props';

const BrandingPreferenceProvider: FC<PropsWithChildren<BrandingPreferenceProviderProps>> = (
  props: PropsWithChildren<BrandingPreferenceProviderProps>,
) => {
  const {children, branding} = props;

  const [brandingPreference, setBrandingPreference] = useState<Branding>();

  const injectBrandingCSSSkeleton: () => void = useCallback((): void => {
    if (brandingPreference) {
      const styleElement: HTMLStyleElement = document.createElement('style');
      styleElement.innerHTML = getThemeSkeleton(brandingPreference.preference.theme);
      document.head.appendChild(styleElement);
    }
  }, [brandingPreference]);

  useEffect(() => {
    getBranding({customization: branding}).then((response: Branding) => {
      setBrandingPreference(response);
      injectBrandingCSSSkeleton();
    });
  }, [branding, injectBrandingCSSSkeleton]);

  return (
    <BrandingPreferenceContext.Provider value={brandingPreference}>
      <ThemeProvider theme={generateTheme({branding: brandingPreference})}>{children}</ThemeProvider>
    </BrandingPreferenceContext.Provider>
  );
};

export default BrandingPreferenceProvider;
