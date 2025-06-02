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

import PkceConstants from '../../constants/PkceConstants';
import {IdTokenPayload} from '../../models/id-token';

export class AuthenticationUtils {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static filterClaimsFromIDTokenPayload(payload: IdTokenPayload): any {
    const optionalizedPayload: Partial<IdTokenPayload> = {...payload};

    delete optionalizedPayload?.iss;
    delete optionalizedPayload?.aud;
    delete optionalizedPayload?.['exp'];
    delete optionalizedPayload?.['iat'];
    delete optionalizedPayload?.['acr'];
    delete optionalizedPayload?.['amr'];
    delete optionalizedPayload?.['azp'];
    delete optionalizedPayload?.['auth_time'];
    delete optionalizedPayload?.['nonce'];
    delete optionalizedPayload?.['c_hash'];
    delete optionalizedPayload?.['at_hash'];
    delete optionalizedPayload?.['nbf'];
    delete optionalizedPayload?.['isk'];
    delete optionalizedPayload?.['sid'];

    const camelCasedPayload: any = {};

    Object.entries(optionalizedPayload).forEach(([key, value]: [key: string, value: unknown]) => {
      const keyParts: string[] = key.split('_');

      const camelCasedKey: string = keyParts
        .map((key: string, index: number) => {
          if (index === 0) {
            return key;
          }

          return [key[0].toUpperCase(), ...key.slice(1)].join('');
        })
        .join('');

      camelCasedPayload[camelCasedKey] = value;
    });

    return camelCasedPayload;
  }
}
