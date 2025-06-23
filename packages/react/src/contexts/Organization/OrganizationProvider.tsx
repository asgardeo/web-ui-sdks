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

import {AsgardeoRuntimeError, Organization} from '@asgardeo/browser';
import {FC, PropsWithChildren, ReactElement, useCallback, useEffect, useMemo, useState} from 'react';
import OrganizationContext, {OrganizationContextProps} from './OrganizationContext';
import useAsgardeo from '../Asgardeo/useAsgardeo';

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
  onOrganizationSwitch?: (organization: Organization) => void;
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
  currentOrganization: initialCurrentOrganization = null,
  getOrganizations,
  onError,
  onOrganizationSwitch,
  organizations: initialOrganizations = null,
}: PropsWithChildren<OrganizationProviderProps>): ReactElement => {
  const {baseUrl, isSignedIn} = useAsgardeo();
  const [organizations, setOrganizations] = useState<Organization[] | null>(initialOrganizations);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(initialCurrentOrganization);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

      if (!currentOrganization && organizationsData.length > 0) {
        setCurrentOrganization(organizationsData[0]);
      }
    } catch (fetchError) {
      const errorMessage: string = fetchError instanceof Error ? fetchError.message : 'Failed to fetch organizations';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, currentOrganization, getOrganizations, isSignedIn, onError]);

  /**
   * Revalidates organizations by fetching fresh data
   */
  const revalidateOrganizations: () => Promise<void> = useCallback(async (): Promise<void> => {
    await fetchOrganizations();
  }, [fetchOrganizations]);

  /**
   * Switches to a different organization
   */
  const switchOrganization: (organization: Organization) => void = useCallback(
    (organization: Organization): void => {
      setCurrentOrganization(organization);
      if (onOrganizationSwitch) {
        onOrganizationSwitch(organization);
      }
    },
    [onOrganizationSwitch],
  );

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
    }),
    [
      baseUrl,
      currentOrganization,
      error,
      getOrganizations,
      isLoading,
      organizations,
      revalidateOrganizations,
      switchOrganization,
    ],
  );

  return <OrganizationContext.Provider value={contextValue}>{children}</OrganizationContext.Provider>;
};

export default OrganizationProvider;
