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

import PkceConstants from '../constants/PkceConstants';

/**
 * Extracts the PKCE key from a state parameter string.
 *
 * @param state - The state parameter string containing the request index.
 * @returns The PKCE key string in the format `pkce_code_verifier_${index}`.
 * @example
 * const state = "request_1";
 * const pkceKey = getPkceStorageKeyFromState(state);
 * // Returns: "pkce_code_verifier_1"
 */
const getPkceStorageKeyFromState = (state: string): string => {
  const index: number = parseInt(state.split('request_')[1]);

  return `${PkceConstants.PKCE_CODE_VERIFIER}${PkceConstants.PKCE_SEPARATOR}${index}`;
};

export default getPkceStorageKeyFromState;
