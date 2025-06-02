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

import PKCEConstants from '../constants/PKCEConstants';

/**
 * Extracts the PKCE key from a state parameter string.
 *
 * @param stateParam - The state parameter string containing the request index.
 * @returns The PKCE key string in the format `pkce_code_verifier_${index}`.
 * @example
 * const stateParam = "request_1";
 * const pkceKey = getPkceStorageKeyFromState(stateParam);
 * // Returns: "pkce_code_verifier_1"
 */
const getPkceStorageKeyFromState = (stateParam: string): string => {
  const index: number = parseInt(stateParam.split('request_')[1]);

  return `${PKCEConstants.PKCE_CODE_VERIFIER}${PKCEConstants.PKCE_SEPARATOR}${index}`;
};

export default getPkceStorageKeyFromState;
