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

import get from './get';
import {User} from '../models/user';

/**
 * Generates a flattened user profile from a response object and schema definitions.
 *
 * This function processes user data according to schema specifications, creating
 * a flat object with dot notation keys instead of nested objects. Multi-valued
 * properties and type-specific defaults are handled appropriately.
 *
 * @param meResponse - The response object containing user data
 * @param processedSchemas - Array of schema objects defining field properties
 * @param processedSchemas[].name - The field name/path for the property
 * @param processedSchemas[].type - The data type of the field (e.g., 'STRING')
 * @param processedSchemas[].multiValued - Whether the field can contain multiple values
 *
 * @returns A flattened user profile object with dot notation keys
 *
 * @example
 * ```typescript
 * const schemas = [
 *   { name: 'name.givenName', type: 'STRING', multiValued: false },
 *   { name: 'emails', type: 'STRING', multiValued: true }
 * ];
 * const response = { name: { givenName: 'John' }, emails: 'john@example.com' };
 * const profile = generateFlattenedUserProfile(response, schemas);
 * // Result: { "name.givenName": 'John', emails: ['john@example.com'] }
 * ```
 */
const generateFlattenedUserProfile = (meResponse: any, processedSchemas: any[]): User => {
  const profile: User = {};

  const allSchemaNames = processedSchemas.map(schema => schema.name).filter(Boolean);

  processedSchemas.forEach(schema => {
    const {name, type, multiValued} = schema;

    if (!name) return;

    // Skip this property if it's a parent of other flattened properties
    // e.g., skip "name" if "name.givenName" or "name.familyName" exists
    // skip "roles" if "roles.default" exists
    const hasChildProperties = allSchemaNames.some(
      schemaName => schemaName !== name && schemaName.startsWith(name + '.'),
    );

    if (hasChildProperties) {
      // Skip this parent property
      return;
    }

    let value = get(meResponse, name);

    if (value !== undefined) {
      if (multiValued && !Array.isArray(value)) {
        value = [value];
      }
    } else {
      if (multiValued) {
        value = undefined;
      } else if (type === 'STRING') {
        value = '';
      } else {
        value = undefined;
      }
    }

    profile[name] = value;
  });

  return profile;
};

export default generateFlattenedUserProfile;
