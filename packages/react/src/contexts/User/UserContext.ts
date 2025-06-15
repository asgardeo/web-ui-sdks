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

import {Context, createContext} from 'react';
import {User, Schema, FlattenedSchema} from '@asgardeo/browser';

/**
 * Props interface of {@link UserContext}
 */
export type UserContextProps = {
  /**
   * Flag indicating whether the user data is loading.
   */
  isLoading: boolean;
  /**
   * The raw ME API response object containing user profile information.
   */
  profile: any | null;
  /**
   * Array of SCIM2 schemas used for user profile structure.
   */
  schemas: Schema[] | null;
  /**
   * Flattened user profile with dot-notation keys for easier access.
   */
  flattenedUser: User | null;
  /**
   * The processed user object with nested structure.
   */
  user: User | null;
  /**
   * Function to refresh user data from the server.
   */
  refreshUser: () => Promise<void>;
  /**
   * Function to update user profile.
   */
  updateUser: (payload: any) => Promise<void>;
  /**
   * Error object if there was an issue fetching user data.
   */
  error: Error | null;
};

/**
 * Context object for managing user profile data and related operations.
 */
const UserContext: Context<UserContextProps | null> = createContext<null | UserContextProps>({
  isLoading: true,
  profile: null,
  schemas: null,
  flattenedUser: null,
  user: null,
  refreshUser: async () => {},
  updateUser: async () => {},
  error: null,
});

UserContext.displayName = 'UserContext';

export default UserContext;
