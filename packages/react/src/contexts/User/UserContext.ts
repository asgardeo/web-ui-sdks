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

import {User, Schema, UpdateMeProfileConfig, ProfileSchemaType, SchemaAttribute} from '@asgardeo/browser';
import {Context, createContext} from 'react';

/**
 * Props interface of {@link UserContext}
 */
export type UserContextProps = {
  flattenedProfile: User | null;
  profile: User | null;
  revalidateProfile: () => Promise<void>;
  schemas: Schema[] | null;
  updateProfile: (
    requestConfig: UpdateMeProfileConfig,
    sessionId?: string,
  ) => Promise<{success: boolean; data: {user: User}; error: string}>;
  onUpdateProfile: (payload: User) => void;
  getAttributeProfileSchema: (profileSchemaType: ProfileSchemaType) => SchemaAttribute[];
};

/**
 * Context object for managing user profile data and related operations.
 */
const UserContext: Context<UserContextProps | null> = createContext<null | UserContextProps>({
  profile: null,
  schemas: null,
  flattenedProfile: null,
  revalidateProfile: () => null,
  updateProfile: () => null,
  onUpdateProfile: () => null,
  getAttributeProfileSchema: () => [],
});

UserContext.displayName = 'UserContext';

export default UserContext;
