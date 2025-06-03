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

import {describe, expect, it} from 'vitest';
import extractPkceStorageKeyFromState from '../extractPkceStorageKeyFromState';
import PkceConstants from '../../constants/PkceConstants';

describe('extractPkceStorageKeyFromState', (): void => {
  it('should extract PKCE key from state parameter', (): void => {
    const state: string = 'request_1';
    const expectedKey: string = `${PkceConstants.PkceStorageKeys.CODE_VERIFIER}${PkceConstants.PkceStorageKeys.SEPARATOR}1`;

    expect(extractPkceStorageKeyFromState(state)).toBe(expectedKey);
  });

  it('should handle state with prefix', (): void => {
    const state: string = 'myState_request_2';
    const expectedKey: string = `${PkceConstants.PkceStorageKeys.CODE_VERIFIER}${PkceConstants.PkceStorageKeys.SEPARATOR}2`;

    expect(extractPkceStorageKeyFromState(state)).toBe(expectedKey);
  });

  it('should extract index from complex state string', (): void => {
    const state: string = 'custom_state_with_request_3';
    const expectedKey: string = `${PkceConstants.PkceStorageKeys.CODE_VERIFIER}${PkceConstants.PkceStorageKeys.SEPARATOR}3`;

    expect(extractPkceStorageKeyFromState(state)).toBe(expectedKey);
  });
});
