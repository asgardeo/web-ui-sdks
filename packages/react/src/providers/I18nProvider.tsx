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

import {TextObject, getLocalization} from '@asgardeo/js-ui-core';
import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import I18nContext from '../contexts/i18n-context';
import {I18n, I18nLocalization, I18nProviderProps, SetTranslationsProps} from '../models/i18n';

/**
 * `I18nProvider` is a component that provides an internationalization context to all its children.
 * It takes an object of type `I18nProviderProps` as props, which includes the children to render,
 * a locale override, and text overrides.
 *
 * @param {PropsWithChildren<I18nProviderProps>} props - The properties passed to the component.
 * @param {ReactNode} props.children - The children to render inside the provider.
 * @param {string} [props.providerLocaleOverride] - Optional locale override.
 * @param {TextObject} [props.providerTextOverrides] - Optional text overrides.
 *
 * @returns {ReactElement} A React element that provides the internationalization context to all its children.
 */
const I18nProvider: FC<PropsWithChildren<I18nProviderProps>> = (props: PropsWithChildren<I18nProviderProps>) => {
  const {children, providerLocaleOverride, providerTextOverrides} = props;

  const [text, setText] = useState<I18nLocalization>({});

  /**
   * `setTranslations` is a function that fetches and sets the translations for a specific screen.
   * It takes an object of type `SetTranslationsProps` as an argument, which includes the screen type,
   * and optional locale and text overrides.
   *
   * @param {SetTranslationsProps} setTranslationProps - The properties used to fetch and set the translations.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` when the translations have been set.
   */
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
