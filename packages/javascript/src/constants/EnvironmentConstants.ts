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
 * Abstract class defining environment variable constants for Asgardeo authentication.
 * This class serves as a base for platform-specific environment constant implementations.
 */
abstract class EnvironmentConstants {
  /**
   * Base URL environment variable name for Asgardeo .
   */
  static readonly ASGARDEO_BASE_URL_ENV_VAR: string;

  /**
   * Client ID environment variable name for Asgardeo.
   */
  static readonly ASGARDEO_CLIENT_ID_ENV_VAR: string;

  /**
   * Client secret environment variable name for Asgardeo.
   */
  static readonly ASGARDEO_CLIENT_SECRET_ENV_VAR: string;

  protected constructor() {
    // Protected constructor allows inheritance while still preventing direct instantiation
  }
}

export default EnvironmentConstants;
