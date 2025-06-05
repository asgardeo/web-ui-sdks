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

import getMeProfile from '../api/scim2/getMeProfile';
import {AsgardeoAPIError, User, WellKnownSchemaIds} from '@asgardeo/browser';
import getSchemas from '../api/scim2/getSchemas';

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
const getUserProfile = async ({baseUrl}): Promise<any> => {
  try {
    const profile = await getMeProfile({url: `${baseUrl}/scim2/Me`});
    const schemas = await getSchemas({url: `${baseUrl}/scim2/Schemas`});

    const result = [];

    for (const schema of schemas) {
      const schemaId = schema.id;

      const source = schemaId.startsWith('urn:ietf:params:scim:schemas:core:2.0') ? profile : profile[schemaId] ?? {};

      for (const attr of schema.attributes || []) {
        const {name, type, subAttributes, multiValued} = attr;

        if (type === 'COMPLEX' && subAttributes?.length && typeof source[name] === 'object') {
          // For complex attributes with subAttributes, create an entry for each subAttribute
          const complexValue = source[name];
          for (const subAttr of subAttributes) {
            if (complexValue[subAttr.name] !== undefined) {
              result.push({
                ...subAttr,
                value: complexValue[subAttr.name],
              });
            }
          }
        } else {
          const value = source[name];
          // Only include if value exists
          if (value !== undefined) {
            result.push({
              ...attr,
              value,
            });
          }
        }
      }
    }

    return result;
  } catch (error) {
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
