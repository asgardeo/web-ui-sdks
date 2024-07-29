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

import SessionStore from '../session-store';

describe('SessionStore', () => {
  let sessionStore: SessionStore;

  beforeEach(() => {
    sessionStore = new SessionStore();
    sessionStorage.clear();
  });

  test('should set data in sessionStorage', async () => {
    const key: string = 'testKey';
    const value: string = 'testValue';

    await sessionStore.setData(key, value);

    expect(sessionStorage.getItem(key)).toBe(value);
  });

  test('should get data from sessionStorage', async () => {
    const key: string = 'testKey';
    const value: string = 'testValue';

    sessionStorage.setItem(key, value);

    const result: string = await sessionStore.getData(key);

    expect(result).toBe(value);
  });

  test('should return "{}" when key does not exist in sessionStorage', async () => {
    const key: string = 'nonExistentKey';

    const result: string = await sessionStore.getData(key);

    expect(result).toBe('{}');
  });

  test('should remove data from sessionStorage', async () => {
    const key: string = 'testKey';
    const value: string = 'testValue';

    sessionStorage.setItem(key, value);
    await sessionStore.removeData(key);

    expect(sessionStorage.getItem(key)).toBe(null);
  });
});
