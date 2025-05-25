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

/**
 * Configuration options for cookie settings
 *
 * @typeParam CookieOptions - Interface for cookie configuration options
 *
 * @remarks
 * These options control how cookies are set and handled by the browser:
 * - Use `httpOnly` to prevent JavaScript access
 * - Set `secure` to true for HTTPS-only cookies
 * - Configure `sameSite` for cross-origin request handling
 * - Set `maxAge` to control cookie expiration
 *
 * @example
 * Setting secure cookie options:
 * ```ts
 * const options: CookieOptions = {
 *   httpOnly: true,
 *   secure: true,
 *   sameSite: 'strict',
 *   maxAge: 3600 // 1 hour
 * };
 * ```
 */
export interface CookieOptions {
  /**
   * When true, makes the cookie inaccessible through JavaScript
   */
  httpOnly?: boolean;
  /**
   * Maximum age of the cookie in seconds
   */
  maxAge?: number;
  /**
   * Controls how the cookie behaves with cross-site requests
   */
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  /**
   * When true, cookie will only be sent over HTTPS
   */
  secure?: boolean;
}
