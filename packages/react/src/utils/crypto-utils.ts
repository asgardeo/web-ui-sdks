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

import {Buffer} from 'buffer';
import {CryptoUtils, JWKInterface, AsgardeoUIException} from '@asgardeo/js-ui-core';
import base64url from 'base64url';
import sha256 from 'fast-sha256';
import {createLocalJWKSet, jwtVerify} from 'jose';
import randombytes from 'randombytes';
import JwtVerifyOptions from '../models/jwt-verify-options';

export default class SPACryptoUtils implements CryptoUtils<Buffer | string> {
  /**
   * Get URL encoded string.
   *
   * @returns {string} base 64 url encoded value.
   */
  public base64URLEncode(value: Buffer | string): string {
    return base64url.encode(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * Get URL decoded string.
   *
   * @returns {string} base 64 url decoded value.
   */
  public base64URLDecode(value: string): string {
    return base64url.decode(value).toString();
  }

  /**
   * Get SHA256 hash of the given data.
   *
   * @returns {string | Buffer} SHA256 hash of the data.
   */
  public hashSha256(data: string): string | Buffer {
    return Buffer.from(sha256(new TextEncoder().encode(data)));
  }

  /**
   * Generate random bytes.
   *
   * @returns {string | Buffer} Random bytes.
   */
  public generateRandomBytes(length: number): string | Buffer {
    return randombytes(length);
  }

  /**
   * Verify the given JWT.
   *
   * @returns {Promise<boolean>} Promise containing the verification status.
   */
  public verifyJwt(
    idToken: string,
    jwk: Partial<JWKInterface>,
    algorithms: string[],
    clientID: string,
    issuer: string,
    subject: string,
    clockTolerance?: number,
    validateJwtIssuer?: boolean,
  ): Promise<boolean> {
    const jwtVerifyOptions: JwtVerifyOptions = {
      algorithms,
      audience: clientID,
      clockTolerance,
      issuer,
      subject,
    };

    if (validateJwtIssuer ?? true) {
      jwtVerifyOptions.issuer = issuer;
    }

    return jwtVerify(
      idToken,
      createLocalJWKSet({
        keys: [jwk],
      }),
      jwtVerifyOptions,
    )
      .then(() => Promise.resolve(true))
      .catch(error =>
        Promise.reject(
          new AsgardeoUIException(
            'REACT_UI-CRYPTO-UTILS-VJ-IV01',
            error?.reason ?? JSON.stringify(error),
            `${error?.code} ${error?.claim}`,
          ),
        ),
      );
  }
}
