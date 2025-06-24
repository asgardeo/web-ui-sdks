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
import {useCallback, useEffect, useState} from 'react';
import getAllOrganizations, {PaginatedOrganizationsResponse} from '../api/scim2/getAllOrganizations';
import getMeOrganizations from '../api/scim2/getMeOrganizations';
import useAsgardeo from '../contexts/Asgardeo/useAsgardeo';

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
 * Configuration options for the useOrganizations hook.
 */
export interface UseOrganizationsConfig {
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
 * Return type for the useOrganizations hook.
 */
export interface UseOrganizationsReturn {
  /**
   * Current page of organizations with switch access information
   */
  data: OrganizationWithSwitchAccess[];
  /**
   * Error message if any
   */
  error: string | null;
  /**
   * Function to fetch more organizations (pagination)
   */
  fetchMore: () => Promise<void>;
  /**
   * Whether there are more organizations to fetch
   */
  hasMore: boolean;
  /**
   * Whether the initial fetch is loading
   */
  isLoading: boolean;
  /**
   * Whether more organizations are being fetched
   */
  isLoadingMore: boolean;
  /**
   * Function to refresh the organizations list
   */
  refresh: () => Promise<void>;
  /**
   * Total count of organizations
   */
  totalCount: number;
}

/**
 * Hook for fetching and managing paginated organizations with switch access information.
 *
 * This hook combines data from two APIs:
 * 1. All organizations endpoint - to get the complete list of organizations
 * 2. User organizations endpoint - to determine which organizations the user can switch to
 *
 * @param config - Configuration options for the hook
 * @returns Object containing organizations data, loading states, and utility functions
 *
 * @example
 * ```tsx
 * function OrganizationList() {
 *   const {
 *     data: organizations,
 *     isLoading,
 *     hasMore,
 *     fetchMore,
 *     refresh
 *   } = useOrganizations({
 *     limit: 10,
 *     filter: 'active'
 *   });
 *
 *   if (isLoading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   return (
 *     <div>
 *       {organizations.map(org => (
 *         <div key={org.id}>
 *           {org.name} {org.canSwitch && '(Can Switch)'}
 *         </div>
 *       ))}
 *       {hasMore && (
 *         <button onClick={fetchMore}>Load More</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useOrganizations = ({
  autoFetch = true,
  filter = '',
  limit = 10,
  recursive = false,
}: UseOrganizationsConfig = {}): UseOrganizationsReturn => {
  const {baseUrl} = useAsgardeo();
  const [data, setData] = useState<OrganizationWithSwitchAccess[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [switchableOrgIds, setSwitchableOrgIds] = useState<Set<string>>(new Set());

  /**
   * Fetch organizations with switch access information
   */
  const fetchOrganizations: (isLoadMore?: boolean) => Promise<void> = useCallback(
    async (isLoadMore = false): Promise<void> => {
      if (!baseUrl) {
        setError('Base URL is required');
        return;
      }

      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
          setError(null);
        }

        // Fetch user's switchable organizations first (only once, not on load more)
        let switchableIds: Set<string> = switchableOrgIds;
        if (!isLoadMore || switchableIds.size === 0) {
          try {
            const userOrgs: Organization[] = await getMeOrganizations({
              authorizedAppName: 'Console',
              baseUrl,
              limit: 100, // Get all user organizations
              recursive,
            });
            switchableIds = new Set(userOrgs.map((org: Organization) => org.id));
            setSwitchableOrgIds(switchableIds);
          } catch {
            // Continue with empty switchable set if user organizations fetch fails
          }
        }

        // Fetch all organizations
        const response: PaginatedOrganizationsResponse = await getAllOrganizations({
          baseUrl,
          filter,
          limit,
          recursive,
        });

        // Combine organization data with switch access information
        const organizationsWithAccess: OrganizationWithSwitchAccess[] = response.organizations.map(
          (org: Organization) => ({
            ...org,
            canSwitch: switchableIds.has(org.id),
          }),
        );

        if (isLoadMore) {
          setData((prevData: OrganizationWithSwitchAccess[]) => [...prevData, ...organizationsWithAccess]);
        } else {
          setData(organizationsWithAccess);
        }

        setHasMore(response.hasMore || false);
        setTotalCount(response.totalCount || organizationsWithAccess.length);
      } catch (fetchError: any) {
        const errorMessage: string = fetchError.message || 'Failed to fetch organizations';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [baseUrl, filter, limit, recursive, switchableOrgIds],
  );

  /**
   * Fetch more organizations for pagination
   */
  const fetchMore: () => Promise<void> = useCallback(async (): Promise<void> => {
    if (!hasMore || isLoadingMore) {
      return;
    }
    await fetchOrganizations(true);
  }, [fetchOrganizations, hasMore, isLoadingMore]);

  /**
   * Refresh the organizations list
   */
  const refresh: () => Promise<void> = useCallback(async (): Promise<void> => {
    setData([]);
    setSwitchableOrgIds(new Set());
    await fetchOrganizations(false);
  }, [fetchOrganizations]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchOrganizations(false).catch(() => {
        // Error is handled within fetchOrganizations
      });
    }
  }, [autoFetch, fetchOrganizations]);

  return {
    data,
    error,
    fetchMore,
    hasMore,
    isLoading,
    isLoadingMore,
    refresh,
    totalCount,
  };
};

export default useOrganizations;
