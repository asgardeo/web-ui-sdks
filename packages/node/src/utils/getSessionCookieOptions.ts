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

import CookieConfig from '../constants/CookieConfig';
import {CookieOptions} from '../models/cookies';

/**
 * Creates a complete set of cookie options by merging provided options with defaults
 *
 * @param options - Partial cookie options to override defaults
 *
 * @returns Complete cookie options with all required fields
 *
 * @example
 * ```ts
 * // Use defaults with only maxAge override
 * const options = getSessionCookieOptions({ maxAge: 3600 });
 *
 * // Override multiple defaults
 * const options = getSessionCookieOptions({
 *   maxAge: 3600,
 *   secure: true,
 *   sameSite: 'strict'
 * });
 * ```
 */
const getSessionCookieOptions = (options: Partial<CookieOptions>): CookieOptions => ({
  ...options,
  httpOnly: options.httpOnly ?? CookieConfig.DEFAULT_HTTP_ONLY,
  maxAge: options.maxAge ?? CookieConfig.DEFAULT_MAX_AGE,
  sameSite: options.sameSite ?? CookieConfig.DEFAULT_SAME_SITE,
  secure: options.secure ?? CookieConfig.DEFAULT_SECURE,
});

export default getSessionCookieOptions;
