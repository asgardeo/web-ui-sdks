/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {Stores} from '../../models/store';
import {Store} from '../../models/store';
import {AuthClientConfig, SessionData} from '../models';
import {TemporaryStore, TemporaryStoreValue} from '../../models/store';
import {OIDCDiscoveryApiResponse} from '../../models/oidc-discovery';

type PartialData<T> = Partial<AuthClientConfig<T> | OIDCDiscoveryApiResponse | SessionData | TemporaryStore>;

export const ASGARDEO_SESSION_ACTIVE: string = 'asgardeo-session-active';

export class DataLayer<T> {
  protected _id: string;
  protected _store: Store;
  public constructor(instanceID: string, store: Store) {
    this._id = instanceID;
    this._store = store;
  }

  protected async setDataInBulk(key: string, data: PartialData<T>): Promise<void> {
    const existingDataJSON: string = (await this._store.getData(key)) ?? null;
    const existingData: PartialData<T> = existingDataJSON && JSON.parse(existingDataJSON);

    const dataToBeSaved: PartialData<T> = {...existingData, ...data};
    const dataToBeSavedJSON: string = JSON.stringify(dataToBeSaved);

    await this._store.setData(key, dataToBeSavedJSON);
  }

  protected async setValue(
    key: string,
    attribute: keyof AuthClientConfig<T> | keyof OIDCDiscoveryApiResponse | keyof SessionData | keyof TemporaryStore,
    value: TemporaryStoreValue,
  ): Promise<void> {
    const existingDataJSON: string = (await this._store.getData(key)) ?? null;
    const existingData: PartialData<T> = existingDataJSON && JSON.parse(existingDataJSON);

    const dataToBeSaved: PartialData<T> = {...existingData, [attribute]: value};
    const dataToBeSavedJSON: string = JSON.stringify(dataToBeSaved);

    await this._store.setData(key, dataToBeSavedJSON);
  }

  protected async removeValue(
    key: string,
    attribute: keyof AuthClientConfig<T> | keyof OIDCDiscoveryApiResponse | keyof SessionData | keyof TemporaryStore,
  ): Promise<void> {
    const existingDataJSON: string = (await this._store.getData(key)) ?? null;
    const existingData: PartialData<T> = existingDataJSON && JSON.parse(existingDataJSON);

    const dataToBeSaved: PartialData<T> = {...existingData};

    delete dataToBeSaved[attribute as string];

    const dataToBeSavedJSON: string = JSON.stringify(dataToBeSaved);

    await this._store.setData(key, dataToBeSavedJSON);
  }

  protected _resolveKey(store: Stores | string, userID?: string): string {
    return userID ? `${store}-${this._id}-${userID}` : `${store}-${this._id}`;
  }

  protected isLocalStorageAvailable(): boolean {
    try {
      const testValue: string = '__ASGARDEO_AUTH_CORE_LOCAL_STORAGE_TEST__';

      localStorage.setItem(testValue, testValue);
      localStorage.removeItem(testValue);

      return true;
    } catch (error) {
      return false;
    }
  }

  public async setConfigData(config: Partial<AuthClientConfig<T>>): Promise<void> {
    await this.setDataInBulk(this._resolveKey(Stores.ConfigData), config);
  }

  public async setOIDCProviderMetaData(oidcProviderMetaData: Partial<OIDCDiscoveryApiResponse>): Promise<void> {
    this.setDataInBulk(this._resolveKey(Stores.OIDCProviderMetaData), oidcProviderMetaData);
  }

  public async setTemporaryData(temporaryData: Partial<TemporaryStore>, userID?: string): Promise<void> {
    this.setDataInBulk(this._resolveKey(Stores.TemporaryData, userID), temporaryData);
  }

  public async setSessionData(sessionData: Partial<SessionData>, userID?: string): Promise<void> {
    this.setDataInBulk(this._resolveKey(Stores.SessionData, userID), sessionData);
  }

  public async setCustomData<K>(key: string, customData: Partial<K>, userID?: string): Promise<void> {
    this.setDataInBulk(this._resolveKey(key, userID), customData);
  }

  public async getConfigData(): Promise<AuthClientConfig<T>> {
    return JSON.parse((await this._store.getData(this._resolveKey(Stores.ConfigData))) ?? null);
  }

  public async getOIDCProviderMetaData(): Promise<OIDCDiscoveryApiResponse> {
    return JSON.parse((await this._store.getData(this._resolveKey(Stores.OIDCProviderMetaData))) ?? null);
  }

  public async getTemporaryData(userID?: string): Promise<TemporaryStore> {
    return JSON.parse((await this._store.getData(this._resolveKey(Stores.TemporaryData, userID))) ?? null);
  }

  public async getSessionData(userID?: string): Promise<SessionData> {
    return JSON.parse((await this._store.getData(this._resolveKey(Stores.SessionData, userID))) ?? null);
  }

  public async getCustomData<K>(key: string, userID?: string): Promise<K> {
    return JSON.parse((await this._store.getData(this._resolveKey(key, userID))) ?? null);
  }

  public setSessionStatus(status: string): void {
    // Using local storage to store the session status as it is required to be available across tabs.
    this.isLocalStorageAvailable() && localStorage.setItem(`${ASGARDEO_SESSION_ACTIVE}`, status);
  }

  public getSessionStatus(): string {
    return this.isLocalStorageAvailable() ? localStorage.getItem(`${ASGARDEO_SESSION_ACTIVE}`) ?? '' : '';
  }

  public removeSessionStatus(): void {
    this.isLocalStorageAvailable() && localStorage.removeItem(`${ASGARDEO_SESSION_ACTIVE}`);
  }

  public async removeConfigData(): Promise<void> {
    await this._store.removeData(this._resolveKey(Stores.ConfigData));
  }

  public async removeOIDCProviderMetaData(): Promise<void> {
    await this._store.removeData(this._resolveKey(Stores.OIDCProviderMetaData));
  }

  public async removeTemporaryData(userID?: string): Promise<void> {
    await this._store.removeData(this._resolveKey(Stores.TemporaryData, userID));
  }

  public async removeSessionData(userID?: string): Promise<void> {
    await this._store.removeData(this._resolveKey(Stores.SessionData, userID));
  }

  public async getConfigDataParameter(key: keyof AuthClientConfig<T>): Promise<TemporaryStoreValue> {
    const data: string = await this._store.getData(this._resolveKey(Stores.ConfigData));

    return data && JSON.parse(data)[key];
  }

  public async getOIDCProviderMetaDataParameter(key: keyof OIDCDiscoveryApiResponse): Promise<TemporaryStoreValue> {
    const data: string = await this._store.getData(this._resolveKey(Stores.OIDCProviderMetaData));

    return data && JSON.parse(data)[key];
  }

  public async getTemporaryDataParameter(key: keyof TemporaryStore, userID?: string): Promise<TemporaryStoreValue> {
    const data: string = await this._store.getData(this._resolveKey(Stores.TemporaryData, userID));

    return data && JSON.parse(data)[key];
  }

  public async getSessionDataParameter(key: keyof SessionData, userID?: string): Promise<TemporaryStoreValue> {
    const data: string = await this._store.getData(this._resolveKey(Stores.SessionData, userID));

    return data && JSON.parse(data)[key];
  }

  public async setConfigDataParameter(key: keyof AuthClientConfig<T>, value: TemporaryStoreValue): Promise<void> {
    await this.setValue(this._resolveKey(Stores.ConfigData), key, value);
  }

  public async setOIDCProviderMetaDataParameter(
    key: keyof OIDCDiscoveryApiResponse,
    value: TemporaryStoreValue,
  ): Promise<void> {
    await this.setValue(this._resolveKey(Stores.OIDCProviderMetaData), key, value);
  }

  public async setTemporaryDataParameter(
    key: keyof TemporaryStore,
    value: TemporaryStoreValue,
    userID?: string,
  ): Promise<void> {
    await this.setValue(this._resolveKey(Stores.TemporaryData, userID), key, value);
  }

  public async setSessionDataParameter(
    key: keyof SessionData,
    value: TemporaryStoreValue,
    userID?: string,
  ): Promise<void> {
    await this.setValue(this._resolveKey(Stores.SessionData, userID), key, value);
  }

  public async removeConfigDataParameter(key: keyof AuthClientConfig<T>): Promise<void> {
    await this.removeValue(this._resolveKey(Stores.ConfigData), key);
  }

  public async removeOIDCProviderMetaDataParameter(key: keyof OIDCDiscoveryApiResponse): Promise<void> {
    await this.removeValue(this._resolveKey(Stores.OIDCProviderMetaData), key);
  }

  public async removeTemporaryDataParameter(key: keyof TemporaryStore, userID?: string): Promise<void> {
    await this.removeValue(this._resolveKey(Stores.TemporaryData, userID), key);
  }

  public async removeSessionDataParameter(key: keyof SessionData, userID?: string): Promise<void> {
    await this.removeValue(this._resolveKey(Stores.SessionData, userID), key);
  }
}
