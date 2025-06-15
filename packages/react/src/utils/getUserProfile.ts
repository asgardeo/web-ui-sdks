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
import {
  AsgardeoAPIError,
  flattenSchemaAttributes,
  FlattenedSchema,
  SchemaAttribute,
  User,
  generateUserProfile,
  generateFlattenedUserProfile
} from '@asgardeo/browser';
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
 *     baseUrl: "https://api.asgardeo.io/t/<ORGANIZATION>",
 *   });
 *
 *   // Access flattened properties directly:
 *   console.log("Email:", userProfile.emails);
 *   console.log("Given Name:", userProfile.name?.givenName);
 *   console.log("Username:", userProfile.userName);
 *
 *   // WSO2 specific properties:
 *   console.log("Country:", userProfile.country);
 *   console.log("Date of Birth:", userProfile.dateOfBirth);
 *
 *   // Enterprise properties (if available):
 *   console.log("Verified Emails:", userProfile.verifiedEmailAddresses);
 *   console.log("Mobile Numbers:", userProfile.mobileNumbers);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Failed to get user profile:', error.message);
 *   }
 * }
 * ```
 */
const getUserProfile = async ({baseUrl}): Promise<User> => {
  try {
    const profile = await getMeProfile({url: `${baseUrl}/scim2/Me`});
    const schemas = await getSchemas({url: `${baseUrl}/scim2/Schemas`});

    const processedSchemas = flattenSchemaAttributes(schemas);

    console.log('Processed Schemas:', JSON.stringify(processedSchemas));

    // Create flat profile from ME response and processed schemas
    const profles = generateUserProfile(profile, processedSchemas);
    const flatProfile = generateFlattenedUserProfile(profile, processedSchemas);

    console.log('profles profles:', JSON.stringify(profles, null, 2));
    console.log('Flat Profile:', JSON.stringify(flatProfile, null, 2));

    return flatProfile;
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
