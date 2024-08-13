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

import {Store} from '@asgardeo/auth-js';

interface GlobalStoreType {
  [key: string]: string | undefined;
}

// Initialize the global store if it doesn't exist
if (!(global as any).store) {
  (global as any).store = {} as GlobalStoreType;
}

// Type guard to cast global store
const getGlobalStore = (): GlobalStoreType => {
  return (global as any).store;
};

export class GlobalStore implements Store {
  public async setData(key: string, value: string): Promise<void> {
    const store = getGlobalStore();
    store[key] = value;
  }

  public async getData(key: string): Promise<string> {
    const store = getGlobalStore();
    return store[key] || '';
  }

  public async removeData(key: string): Promise<void> {
    const store = getGlobalStore();
    delete store[key];
  }
}
