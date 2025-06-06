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

const getMappedUserProfileValue = (key: string, mappings, user) => {
  const mappedKey = mappings[key];

  if (Array.isArray(user)) {
    if (Array.isArray(mappedKey)) {
      for (const field of mappedKey) {
        const found = user.find(u => u.name === field);
        if (found?.value !== undefined) {
          return found.value;
        }
      }
    } else {
      const found = user.find(u => u.name === mappedKey);
      if (found?.value !== undefined) {
        return found.value;
      }
    }

    const found = user.find(u => u.name === key);

    return found?.value;
  }

  return mappedKey ? user[mappedKey] : user[key];
};

export default getMappedUserProfileValue;
