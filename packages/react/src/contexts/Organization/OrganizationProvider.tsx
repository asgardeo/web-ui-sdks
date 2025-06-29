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

import {AsgardeoRuntimeError, Organization, PaginatedOrganizationsResponse} from '@asgardeo/browser';
import {FC, PropsWithChildren, ReactElement, useCallback, useEffect, useMemo, useState} from 'react';
import OrganizationContext, {OrganizationContextProps, OrganizationWithSwitchAccess} from './OrganizationContext';
import useAsgardeo from '../Asgardeo/useAsgardeo';
import getAllOrganizations from '../../api/getAllOrganizations';
import getMeOrganizations from '../../api/getMeOrganizations';

/**
 * Props interface of {@link OrganizationProvider}
 */
export interface OrganizationProviderProps {
  /**
   * Whether to automatically fetch organizations on mount
   */
  autoFetch?: boolean;
  /**
   * Initial current organization
   */
  currentOrganization?: Organization | null;
  /**
   * Function to fetch organizations
   */
  getOrganizations: () => Promise<Organization[]>;
  /**
   * Callback function called when an error occurs
   */
  onError?: (error: string) => void;
  /**
   * Callback function called when switching organizations
   */
  onOrganizationSwitch?: (organization: Organization) => Promise<void>;
  /**
   * Initial list of organizations
   */
  organizations?: Organization[] | null;
}

/**
 * OrganizationProvider component that manages organization data and provides it through OrganizationContext.
 *
 * This provider:
 * - Fetches organization data from the organizations endpoint
 * - Manages current organization state
 * - Provides functions for switching organizations and refreshing data
 * - Handles loading states and errors
 * - Accepts a custom getOrganizations function for flexible data fetching
 *
 * @example
 * ```tsx
 * // Basic usage with auto-fetch (uses internal API)
 * <OrganizationProvider>
 *   <App />
 * </OrganizationProvider>
 *
 * // With custom getOrganizations function
 * <OrganizationProvider getOrganizations={async () => asgardeo.getOrganizations()}>
 *   <App />
 * </OrganizationProvider>
 *
 * // With custom error handling
 * <OrganizationProvider onError={(error) => console.error('Organization error:', error)}>
 *   <App />
 * </OrganizationProvider>
 *
 * // With custom organization switch handler
 * <OrganizationProvider
 *   onOrganizationSwitch={(org) => console.log('Switched to:', org.name)}
 * >
 *   <App />
 * </OrganizationProvider>
 *
 * // Disable auto-fetch (fetch manually using revalidateOrganizations)
 * <OrganizationProvider autoFetch={false}>
 *   <App />
 * </OrganizationProvider>
 * ```
 */
const OrganizationProvider: FC<PropsWithChildren<OrganizationProviderProps>> = ({
  autoFetch = true,
  children,
  currentOrganization,
  getOrganizations,
  onError,
  onOrganizationSwitch,
  organizations: initialOrganizations = null,
}: PropsWithChildren<OrganizationProviderProps>): ReactElement => {
  const {baseUrl, isSignedIn} = useAsgardeo();
  const [organizations, setOrganizations] = useState<Organization[] | null>(initialOrganizations);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Enhanced state for paginated organizations with switch access
  const [paginatedOrganizations, setPaginatedOrganizations] = useState<OrganizationWithSwitchAccess[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [switchableOrgIds, setSwitchableOrgIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentFilter, setCurrentFilter] = useState<{
    filter?: string;
    limit?: number;
    recursive?: boolean;
  }>({});

  /**
   * Fetches organizations from the API
   */
  const fetchOrganizations: () => Promise<void> = useCallback(async (): Promise<void> => {
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let organizationsData: Organization[];

      if (getOrganizations) {
        organizationsData = await getOrganizations();
      } else {
        throw new AsgardeoRuntimeError(
          'getOrganizations function is required',
          'OrganizationProvider-ValidationError-001',
          'react',
          'The getOrganizations function must be provided to fetch organization data.',
        );
      }

      setOrganizations(organizationsData);
    } catch (fetchError) {
      const errorMessage: string = fetchError instanceof Error ? fetchError.message : 'Failed to fetch organizations';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, getOrganizations, isSignedIn, onError]);

  /**
   * Revalidates organizations by fetching fresh data
   */
  const revalidateOrganizations: () => Promise<void> = useCallback(async (): Promise<void> => {
    await fetchOrganizations();
  }, [fetchOrganizations]);

  /**
   * Switches to a different organization
   */
  const switchOrganization: (organization: Organization) => Promise<void> = useCallback(
    async (organization: Organization): Promise<void> => {
      if (!onOrganizationSwitch) {
        throw new AsgardeoRuntimeError(
          'onOrganizationSwitch callback is required',
          'OrganizationProvider-SwitchError-001',
          'react',
          'The onOrganizationSwitch callback must be provided to handle organization switching.',
        );
      }

      setIsLoading(true);
      setError(null);

      try {
        await onOrganizationSwitch(organization);
        // The organization state will be updated by the parent provider
      } catch (switchError) {
        const errorMessage: string =
          switchError instanceof Error ? switchError.message : 'Failed to switch organization';
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        throw switchError; // Re-throw so the UI can handle it
      } finally {
        setIsLoading(false);
      }
    },
    [onOrganizationSwitch, onError],
  );

  /**
   * Fetches paginated organizations with switch access information
   */
  const fetchPaginatedOrganizations: (config?: {
    filter?: string;
    limit?: number;
    recursive?: boolean;
    reset?: boolean;
  }) => Promise<void> = useCallback(
    async (config = {}): Promise<void> => {
      const {filter = '', limit = 10, recursive = false, reset = false} = config;

      if (!isSignedIn || !baseUrl) {
        return;
      }

      try {
        if (reset) {
          setIsLoading(true);
          setError(null);
          setCurrentPage(1);
          setPaginatedOrganizations([]);
          setCurrentFilter({filter, limit, recursive});
        } else {
          setIsLoadingMore(true);
        }

        // Fetch user's switchable organizations first (only once per session)
        let switchableIds: Set<string> = switchableOrgIds;
        if (switchableIds.size === 0) {
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

        // Fetch all organizations with pagination
        const response: PaginatedOrganizationsResponse = await getAllOrganizations({
          baseUrl,
          filter,
          limit,
          recursive,
          ...(reset ? {} : {startIndex: (currentPage - 1) * limit}),
        });

        // Combine organization data with switch access information
        const organizationsWithAccess: OrganizationWithSwitchAccess[] = response.organizations.map(
          (org: Organization) => ({
            ...org,
            canSwitch: switchableIds.has(org.id),
          }),
        );

        if (reset) {
          setPaginatedOrganizations(organizationsWithAccess);
        } else {
          setPaginatedOrganizations((prevData: OrganizationWithSwitchAccess[]) => [
            ...prevData,
            ...organizationsWithAccess,
          ]);
          setCurrentPage(prev => prev + 1);
        }

        setHasMore(response.hasMore || false);
        setTotalCount(response.totalCount || organizationsWithAccess.length);
      } catch (fetchError: any) {
        const errorMessage: string = fetchError.message || 'Failed to fetch paginated organizations';
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [baseUrl, isSignedIn, onError, switchableOrgIds, currentPage],
  );

  /**
   * Fetch more organizations for pagination
   */
  const fetchMore: () => Promise<void> = useCallback(async (): Promise<void> => {
    if (!hasMore || isLoadingMore) {
      return;
    }
    await fetchPaginatedOrganizations(currentFilter);
  }, [fetchPaginatedOrganizations, hasMore, isLoadingMore, currentFilter]);

  // Auto-fetch organizations when component mounts or dependencies change
  useEffect(() => {
    if (autoFetch && isSignedIn) {
      fetchOrganizations();
    }
  }, [autoFetch, fetchOrganizations, isSignedIn]);

  const contextValue: OrganizationContextProps = useMemo(
    () => ({
      currentOrganization,
      error,
      getOrganizations,
      isLoading,
      organizations,
      revalidateOrganizations,
      switchOrganization,

      // Enhanced features
      paginatedOrganizations,
      hasMore,
      isLoadingMore,
      totalCount,
      fetchMore,
      fetchPaginatedOrganizations,
    }),
    [
      currentOrganization,
      error,
      getOrganizations,
      isLoading,
      organizations,
      revalidateOrganizations,
      switchOrganization,
      paginatedOrganizations,
      hasMore,
      isLoadingMore,
      totalCount,
      fetchMore,
      fetchPaginatedOrganizations,
    ],
  );

  return <OrganizationContext.Provider value={contextValue}>{children}</OrganizationContext.Provider>;
};

export default OrganizationProvider;
