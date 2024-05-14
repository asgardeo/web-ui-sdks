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

import {BrandingPreferenceTextProps, TextObject, getLocalization} from '@asgardeo/js-ui-core';
import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import I18nContext from '../contexts/i18n-context';
import {I18n, I18nLocalization, SetTranslationsProps} from '../models/i18n';

interface I18nProviderProps {
  providerLocaleOverride?: string;
  providerTextOverrides?: BrandingPreferenceTextProps;
}

const I18nProvider: FC<PropsWithChildren<I18nProviderProps>> = (props: PropsWithChildren<I18nProviderProps>) => {
  const {children, providerLocaleOverride, providerTextOverrides} = props;

  const [text, setText] = useState<I18nLocalization>({});

  const setTranslations: (setTranslationProps: SetTranslationsProps) => Promise<boolean> = useCallback(
    async (setTranslationProps: SetTranslationsProps): Promise<boolean> => {
      const {componentLocaleOverride, componentTextOverrides, screen} = setTranslationProps;

      if (!Object.prototype.hasOwnProperty.call(text, screen)) {
        const newText: TextObject = await getLocalization({
          componentTextOverrides,
          locale: componentLocaleOverride ?? providerLocaleOverride ?? 'en-US',
          providerTextOverrides,
          screen,
        });

        setText({...text, [screen]: newText});
      }
      return true;
    },
    [providerLocaleOverride, providerTextOverrides, text],
  );

  const value: I18n = useMemo(() => ({setTranslations, text}), [setTranslations, text]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export default I18nProvider;
