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

import {IdTokenPayload} from '../models/id-token';

/**
 * Extracts the tenant domain from the ID token payload.
 *
 * @deprecated since v1.0.6 — This utility assumes a legacy tenant extraction pattern from the `sub` claim,
 * which may not be reliable. Will be removed in a future version.
 *
 * Consider extracting the tenant domain using a dedicated claim (e.g., `tenant_domain`) when available.
 */
const getTenantDomainFromIdTokenPayload = (payload: IdTokenPayload, uidSeparator: string = '@'): string => {
  const uid: string = payload.sub;

  if (!uid) return '';

  const tokens: string[] = uid.split(uidSeparator);

  // This pattern assumes a format like: `<username>@<something>@<tenant_domain>`
  return tokens.length > 2 ? tokens[tokens.length - 1] : '';
};

export default getTenantDomainFromIdTokenPayload;
