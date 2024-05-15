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

import {Store} from '@asgardeo/js-ui-core';

export default class SessionStore implements Store {
  private storage: Storage;

  constructor() {
    this.storage = sessionStorage;
  }

  public async setData(key: string, value: string): Promise<void> {
    this.storage.setItem(key, value);
  }

  public async getData(key: string): Promise<string> {
    return this.storage.getItem(key) ?? '{}';
  }

  public async removeData(key: string): Promise<void> {
    this.storage.removeItem(key);
  }
}
