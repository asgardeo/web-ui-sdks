/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
 * The interface for the response from the "me" API endpoint.
 */
export interface MeAPIResponse {
  /**
   * The user's email addresses.
   */
  emails: string[];
  /**
   * The user's id.
   */
  id: string;
  /**
   * The user's names.
   */
  name: Name;
  /**
   * When signed in using a social login, the photos field will be populated instead of profile URL.
   */
  photos?: Photos[];
  /**
   * The user's profile URL.
   */
  profileUrl: string;
  /**
   * The user's username.
   */
  userName: string;
}

/**
 * The interface for the name field in the "me" API response.
 */
export interface Name {
  familyName?: string;
  givenName?: string;
}

/**
 * The interface for the photos field in the "me" API response.
 */
export interface Photos {
  type: string;
  value: string;
}
