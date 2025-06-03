/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import {TemporaryData} from '../__legacy__/models';

/**
 * Generates the next available PKCE storage key based on the current temporary data.
 *
 * The generated key will follow the format: `pkce_code_verifier_<index>`, where `<index>` is incremented
 * based on the highest existing index in the provided storage object.
 *
 * @param tempStore - The object that holds temporary PKCE-related data (e.g., sessionStorage).
 *
 * @returns A new unique PKCE storage key to store the next `code_verifier`.
 *
 * @example
 * const key = generatePkceStorageKey(sessionStorage);
 * // Returns: "pkce_code_verifier_3" (if existing keys are pkce_code_verifier_0 to _2)
 */
const generatePkceStorageKey = (tempStore: TemporaryData): string => {
  const keys: string[] = [];

  Object.keys(tempStore).forEach((key: string) => {
    if (key.startsWith(PkceConstants.PKCE_CODE_VERIFIER)) {
      keys.push(key);
    }
  });

  const lastKey: string | undefined = keys.sort().pop();
  const index: number = parseInt(lastKey?.split(PkceConstants.PKCE_SEPARATOR)[1] ?? '-1');

  return `${PkceConstants.PKCE_CODE_VERIFIER}${PkceConstants.PKCE_SEPARATOR}${index + 1}`;
};

export default generatePkceStorageKey;
