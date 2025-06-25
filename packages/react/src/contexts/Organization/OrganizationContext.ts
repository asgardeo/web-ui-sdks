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
 * Interface for organizations with switch access information.
 */
export interface OrganizationWithSwitchAccess extends Organization {
  /**
   * Whether the user has switch access to this organization
   */
  canSwitch: boolean;
}

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

  // Enhanced features for paginated organizations with switch access
  /**
   * Paginated organizations with switch access information
   */
  paginatedOrganizations: OrganizationWithSwitchAccess[];
  /**
   * Whether there are more organizations to load
   */
  hasMore: boolean;
  /**
   * Whether more data is being loaded
   */
  isLoadingMore: boolean;
  /**
   * Total number of organizations
   */
  totalCount: number;
  /**
   * Function to fetch more organizations (pagination)
   */
  fetchMore: () => Promise<void>;
  /**
   * Function to fetch paginated organizations with switch access
   */
  fetchPaginatedOrganizations: (config?: {
    filter?: string;
    limit?: number;
    recursive?: boolean;
    reset?: boolean;
  }) => Promise<void>;
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

  // Enhanced features for paginated organizations with switch access
  paginatedOrganizations: [],
  hasMore: false,
  isLoadingMore: false,
  totalCount: 0,
  fetchMore: () => Promise.resolve(),
  fetchPaginatedOrganizations: () => Promise.resolve(),
});

OrganizationContext.displayName = 'OrganizationContext';

export default OrganizationContext;
