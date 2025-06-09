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

import {Schema} from './scim2-schema';

/**
 * Type for the Meta object in SCIM2 responses
 */
export interface UserMeta {
  created: string;
  location: string;
  lastModified: string;
  resourceType: string;
}

/**
 * Type for the Role object in SCIM2 responses
 */
export interface UserRole {
  audienceValue: string;
  display: string;
  audienceType: string;
  value: string;
  $ref: string;
  audienceDisplay: string;
}

/**
 * Type for the Name object in SCIM2 responses
 */
export interface UserName {
  formatted: string;
  givenName: string;
  familyName: string;
}

/**
 * Represents a user in the Asgardeo system.
 *
 * @remarks
 * This interface defines the user properties based on the SCIM2 schema.
 * WSO2 specific properties are flattened to the root level for easier access.
 *
 * @example
 * ```typescript
 * const user: User = {
 *   emails: ["user@example.com"],
 *   profileUrl: "https://gravatar.com/avatar/123",
 *   meta: {
 *     created: "2021-06-21T11:28:21.800618Z",
 *     location: "https://api.asgardeo.io/scim2/Users/123",
 *     lastModified: "2025-04-30T06:46:48.520896Z",
 *     resourceType: "User"
 *   },
 *   name: {
 *     formatted: "John Smith",
 *     givenName: "John",
 *     familyName: "Smith"
 *   },
 *   userName: "john@example.com",
 *   id: "123",
 *   // Flattened WSO2 schema properties
 *   accountState: "UNLOCKED",
 *   accountLocked: "false",
 *   photoUrl: "https://gravatar.com/avatar/123",
 *   emailVerified: "true",
 *   lastLogonTime: "1749098996152"
 * };
 * ```
 */
export interface User {
  // Base SCIM2 properties
  emails: string[];
  profileUrl?: string;
  meta: UserMeta;
  schemas: Schema[];
  roles?: UserRole[];
  name: UserName;
  id: string;
  userName: string;

  // Flattened WSO2 schema properties
  accountState?: string;
  accountLocked?: string;
  failedLoginLockoutCount?: string;
  failedTOTPAttempts?: string;
  failedLoginAttempts?: string;
  totpEnabled?: string;
  photoUrl?: string;
  emailVerified?: string;
  backupCodeEnabled?: string;
  lastLogonTime?: string;
  signedUpRegion?: string;
  unlockTime?: string;
  isReadOnlyUser?: string;
  failedLoginAttemptsBeforeSuccess?: string;

  // Allow additional properties
  [key: string]: any;
}

export default User;

export type UserInfoResolvingStrategy = 'SCIM' | 'ID_TOKEN' | 'USER_INFO';
