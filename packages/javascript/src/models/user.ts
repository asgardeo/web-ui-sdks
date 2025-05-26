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
 * Represents a user in the Asgardeo system
 *
 * @template User - Core user interface for authentication
 *
 * @remarks
 * This interface defines the basic user properties needed for authentication
 * and user management in Asgardeo applications.
 *
 * @example
 * ```typescript
 * const user: User = {
 *   email: "user@example.com",
 *   id: "123e4567-e89b-12d3-a456-426614174000",
 *   username: "johnsmith"
 * };
 * ```
 */
export interface User {
  /**
   * Email address of the user
   */
  email: string;
  /**
   * Unique identifier for the user
   */
  id: string;
  /**
   * Username used for authentication
   */
  username: string;
}
