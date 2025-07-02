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

import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import {FC, ReactElement, useEffect, useMemo, CSSProperties} from 'react';
import {BaseOrganizationListProps} from './BaseOrganizationList';
import BaseOrganizationList from './BaseOrganizationList';
import useOrganization from '../../../contexts/Organization/useOrganization';
import useTheme from '../../../contexts/Theme/useTheme';
import {OrganizationWithSwitchAccess} from '../../../contexts/Organization/OrganizationContext';
import {Avatar} from '../../primitives/Avatar/Avatar';

/**
 * Configuration options for the OrganizationList component.
 */
export interface OrganizationListConfig {
  /**
   * Whether to automatically fetch organizations on mount
   */
  autoFetch?: boolean;
  /**
   * Filter string for organizations
   */
  filter?: string;
  /**
   * Number of organizations to fetch per page
   */
  limit?: number;
  /**
   * Whether to include recursive organizations
   */
  recursive?: boolean;
}

/**
 * Props interface for the OrganizationList component.
 * Uses the enhanced OrganizationContext instead of the useOrganizations hook.
 */
export interface OrganizationListProps
  extends Omit<
      BaseOrganizationListProps,
      'data' | 'error' | 'fetchMore' | 'hasMore' | 'isLoading' | 'isLoadingMore' | 'totalCount'
    >,
    OrganizationListConfig {
  /**
   * Function called when an organization is selected/clicked
   */
  onOrganizationSelect?: (organization: OrganizationWithSwitchAccess) => void;
}

/**
 * OrganizationList component that provides organization listing functionality with pagination.
 * This component uses the enhanced OrganizationContext, eliminating the polling issue and
 * providing better integration with the existing context system.
 *
 * @example
 * ```tsx
 * import { OrganizationList } from '@asgardeo/react';
 *
 * // Basic usage
 * <OrganizationList />
 *
 * // With custom limit and filter
 * <OrganizationList
 *   limit={20}
 *   filter="active"
 *   onOrganizationSelect={(org) => {
 *     console.log('Selected organization:', org.name);
 *   }}
 * />
 *
 * // As a popup dialog
 * <OrganizationList
 *   mode="popup"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Select Organization"
 * />
 *
 * // With custom organization renderer
 * <OrganizationList
 *   renderOrganization={(org) => (
 *     <div key={org.id}>
 *       <h3>{org.name}</h3>
 *       <p>Can switch: {org.canSwitch ? 'Yes' : 'No'}</p>
 *     </div>
 *   )}
 * />
 * ```
 */
export const OrganizationList: FC<OrganizationListProps> = ({
  autoFetch = true,
  filter = '',
  limit = 10,
  onOrganizationSelect,
  recursive = false,
  ...baseProps
}: OrganizationListProps): ReactElement => {
  const {
    paginatedOrganizations,
    error,
    fetchMore,
    hasMore,
    isLoading,
    isLoadingMore,
    totalCount,
    fetchPaginatedOrganizations,
  } = useOrganization();

  // Auto-fetch organizations on mount or when parameters change
  useEffect(() => {
    if (autoFetch) {
      fetchPaginatedOrganizations({
        filter,
        limit,
        recursive,
        reset: true,
      });
    }
  }, [autoFetch, filter, limit, recursive, fetchPaginatedOrganizations]);

  const refreshHandler = async () => {
    await fetchPaginatedOrganizations({
      filter,
      limit,
      recursive,
      reset: true,
    });
  };

  return (
    <BaseOrganizationList
      data={paginatedOrganizations}
      error={error}
      fetchMore={fetchMore}
      hasMore={hasMore}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      onOrganizationSelect={onOrganizationSelect}
      onRefresh={refreshHandler}
      totalCount={totalCount}
      {...baseProps}
    />
  );
};

export default OrganizationList;
