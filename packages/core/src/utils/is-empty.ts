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

/**
 * Checks if the given value is empty.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} Returns `true` if the value is empty, otherwise `false`.
 *
 * @example
 * isEmpty(null); // => true
 * isEmpty(''); // => true
 * isEmpty([]); // => true
 * isEmpty({}); // => true
 * isEmpty('Hello'); // => false
 * isEmpty([1, 2, 3]); // => false
 * isEmpty({ a: 1 }); // => false
 */
const isEmpty = (value: unknown): boolean => {
  /**
   * If the value is null or undefined, return true.
   */
  if (value === null || undefined) {
    return true;
  }

  /**
   * If the value is a string or an array, check if it's length is 0. If it is, return true.
   */
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  /**
   * If the value is an object, check if it has any keys. If it doesn't, return true.
   */
  return Object.keys(value).length === 0;
};

export default isEmpty;
