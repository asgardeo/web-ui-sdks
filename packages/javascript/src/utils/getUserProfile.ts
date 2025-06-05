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

import getMeProfile from '../../../react/src/api/scim2/getMeProfile';
import AsgardeoAPIError from '../errors/AsgardeoAPIError';
import {User} from '../models/user';
import {WellKnownSchemaIds} from '../models/scim2-schema';

/**
 * Retrieves the authenticated user's profile information with all SCIM2 schema properties
 * flattened to the root level for easier access.
 *
 * The function flattens properties from all schemas defined in WellKnownSchemaIds:
 * - Core User properties (urn:ietf:params:scim:schemas:core:2.0:User)
 * - Enterprise User properties (urn:ietf:params:scim:schemas:extension:enterprise:2.0:User)
 * - System User properties (urn:scim:wso2:schema)
 * - Custom User properties (urn:scim:schemas:extension:custom:User)
 *
 * @param requestConfig - Request configuration object.
 * @returns A promise that resolves with the flattened user profile information.
 * @example
 * ```typescript
 * try {
 *   const userProfile = await getUserProfile({
 *     url: "https://api.asgardeo.io/t/<ORGANIZATION>/scim2/Me",
 *   });
 *
 *   // Access flattened properties directly:
 *   console.log("Email:", userProfile.emails[0]);
 *   console.log("Name:", userProfile.name.formatted);
 *   console.log("Username:", userProfile.userName);
 *
 *   // WSO2 specific properties:
 *   console.log("Account State:", userProfile.accountState);
 *   console.log("Email Verified:", userProfile.emailVerified);
 *
 *   // Enterprise properties (if available):
 *   console.log("Employee Number:", userProfile.employeeNumber);
 *   console.log("Cost Center:", userProfile.costCenter);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Failed to get user profile:', error.message);
 *   }
 * }
 * ```
 */
const getUserProfile = async (requestConfig: Partial<Request>): Promise<User> => {
  try {
    const response = await getMeProfile(requestConfig);

    // Flatten all known schema properties to root level
    Object.values(WellKnownSchemaIds).forEach(schemaId => {
      const schemaData = response[schemaId];
      if (schemaData && typeof schemaData === 'object') {
        Object.assign(response, schemaData);
        delete response[schemaId];
      }
    });

    // Remove the schemas array since we've flattened all schema properties
    delete response.schemas;

    return response;
  } catch (error) {
    if (error instanceof AsgardeoAPIError) {
      throw error;
    }
    throw new AsgardeoAPIError(
      'Failed to get user profile',
      'getUserProfile-Error-001',
      'javascript',
      500,
      'Internal Server Error',
    );
  }
};

export default getUserProfile;
