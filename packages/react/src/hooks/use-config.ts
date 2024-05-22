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

import {UIAuthConfig} from '@asgardeo/js';
import {useContext} from 'react';
import AsgardeoContext from '../contexts/asgardeo-context';
import UseConfig from '../models/use-config';

/**
 * Custom hook to access the authentication configuration from the AsgardeoProviderContext.
 * @returns An object containing the authentication configuration.
 */
export const useConfig = (): UseConfig => {
  const {config} = useContext(AsgardeoContext) as {
    config: UIAuthConfig;
  };

  return {config};
};
