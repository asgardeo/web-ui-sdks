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

import {useContext, useEffect, useState} from 'react';
import AsgardeoContext from '../contexts/asgardeo-context';
import I18nContext from '../contexts/i18n-context';
import {I18n, SetTranslationsProps} from '../models/i18n';
import UseTranslations from '../models/use-translations';

/**
 * `useTranslations` is a custom hook that fetches translations.
 * It takes an object of type `SetTranslationsProps` as an argument, which includes the screen type,
 * and optional locale and text overrides.
 *
 * @param {SetTranslationsProps} props - The properties used to fetch the translations.
 * @param {ScreenType} props.screen - The screen type for which to fetch translations.
 * @param {string} [props.componentLocaleOverride] - Optional locale override.
 * @param {BrandingPreferenceTextProps} [props.componentTextOverrides] - Optional text overrides.
 *
 * @returns {UseTranslations} An object containing the translations (`t`) and a loading state (`isLoading`).
 */
const useTranslations = (props: SetTranslationsProps): UseTranslations => {
  const {componentLocaleOverride, componentTextOverrides, screen} = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {setIsTextLoading} = useContext(AsgardeoContext);

  const contextValue: I18n = useContext(I18nContext);
  const {text, setTranslations} = contextValue;

  // useEffect(() => {
  //   setTranslations({componentLocaleOverride, componentTextOverrides, screen}).then((response: boolean) => {
  //     setIsLoading(!response);
  //     setIsTextLoading(!response);
  //   });
  // }, [componentLocaleOverride, componentTextOverrides, screen, setIsTextLoading, setTranslations]);

  // useEffect(() => {
  //   setIsTextLoading(isLoading);
  // }, [isLoading, setIsTextLoading]);

  /**
   * `t` is a function that retrieves a specific translation from the fetched translations.
   * It takes a key as an argument, which is a string that represents a path to the desired translation.
   *
   * @param {string} key - The key of the translation to retrieve. This is a string that represents
   * a path in the translations object, with parts separated by '.'.
   *
   * @returns {string} The requested translation.
   */
  const t = (key: string): string => {
    const keySegments: string[] = key.split('.');

    const screenKey: string = keySegments[0];
    const rightPart: string = keySegments.slice(1).join('.');

    return text[screenKey][rightPart];
  };

  return {isLoading, t};
};

export default useTranslations;
