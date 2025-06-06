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
 * Enum representing different OAuth response modes.
 */
export enum ResponseMode {
  /**
   * Response is returned as POST parameters in an HTML form.
   */
  FormPost = 'form_post',

  /**
   * Response is returned as query parameters in the URL.
   */
  Query = 'query',

  /**
   * Response is returned directly to the client.
   */
  Direct = 'direct',
}
