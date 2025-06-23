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

import {Organization} from '@asgardeo/browser';
import {Context, createContext} from 'react';

/**
 * Props interface of {@link OrganizationContext}
 */
export type OrganizationContextProps = {
  currentOrganization: Organization | null;
  error: string | null;
  getOrganizations: () => Promise<Organization[]>;
  isLoading: boolean;
  organizations: Organization[] | null;
  revalidateOrganizations: () => Promise<void>;
  switchOrganization: (organization: Organization) => Promise<void>;
};

/**
 * Context object for managing organization data and related operations.
 */
const OrganizationContext: Context<OrganizationContextProps | null> = createContext<null | OrganizationContextProps>({
  currentOrganization: null,
  error: null,
  getOrganizations: () => Promise.resolve([]),
  isLoading: false,
  organizations: null,
  revalidateOrganizations: () => Promise.resolve(),
  switchOrganization: () => Promise.resolve(),
});

OrganizationContext.displayName = 'OrganizationContext';

export default OrganizationContext;
