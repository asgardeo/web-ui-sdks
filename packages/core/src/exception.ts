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
 * `AsgardeoUIException` is a custom error class that extends the built-in `Error` class.
 *
 * @extends {Error}
 */
export default class AsgardeoUIException extends Error {
  /**
   * The name of the error, which is set to the name of the constructor.
   * @override
   */
  public override name: string;

  /**
   * The stack trace of the error.
   * @override
   */
  public override stack: string;

  /**
   * The code of the error.
   */
  public code: string;

  /**
   * Constructs a new `AsgardeoUIException`.
   *
   * @param {string} code - The error code.
   * @param {string} message - The error message.
   * @param {any} [stack] - The error stack trace.
   */
  constructor(code: string, message: string, stack?: any) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
    this.stack = stack;
  }
}
