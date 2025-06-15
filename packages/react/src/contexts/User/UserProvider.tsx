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

import {FC, PropsWithChildren, ReactElement, useEffect, useState, useCallback, useMemo} from 'react';
import {
  User,
  Schema,
  AsgardeoAPIError,
  flattenSchemaAttributes,
  generateUserProfile,
  generateFlattenedUserProfile,
} from '@asgardeo/browser';
import UserContext from './UserContext';
import useAsgardeo from '../Asgardeo/useAsgardeo';
import getMeProfile from '../../api/scim2/getMeProfile';
import getSchemas from '../../api/scim2/getSchemas';
import updateMeProfile from '../../api/scim2/updateMeProfile';

/**
 * Props interface of {@link UserProvider}
 */
export interface UserProviderProps {
  /**
   * Whether to automatically fetch user data when the component mounts.
   * @default true
   */
  autoFetch?: boolean;
  /**
   * Custom error handler for user data operations.
   */
  onError?: (error: Error) => void;
}

/**
 * UserProvider component that manages user profile data and provides it through UserContext.
 *
 * This provider:
 * - Fetches user profile data from the ME endpoint
 * - Retrieves SCIM2 schemas for profile structure
 * - Generates both nested and flattened user profiles
 * - Provides functions for refreshing and updating user data
 * - Handles loading states and errors
 *
 * @example
 * ```tsx
 * // Basic usage
 * <UserProvider>
 *   <App />
 * </UserProvider>
 *
 * // With custom error handling
 * <UserProvider onError={(error) => console.error('User error:', error)}>
 *   <App />
 * </UserProvider>
 *
 * // Disable auto-fetch (fetch manually using refreshUser)
 * <UserProvider autoFetch={false}>
 *   <App />
 * </UserProvider>
 * ```
 */
const UserProvider: FC<PropsWithChildren<UserProviderProps>> = ({
  children,
  autoFetch = true,
  onError,
}: PropsWithChildren<UserProviderProps>): ReactElement => {
  const {isSignedIn, baseUrl} = useAsgardeo();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [schemas, setSchemas] = useState<Schema[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [flattenedUser, setFlattenedUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetches user profile data including ME response and schemas.
   */
  const fetchUserData = useCallback(async (): Promise<void> => {
    if (!isSignedIn || !baseUrl) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [meResponse, schemasResponse] = await Promise.all([
        getMeProfile({url: `${baseUrl}/scim2/Me`}),
        getSchemas({url: `${baseUrl}/scim2/Schemas`}),
      ]);

      const processedSchemas = flattenSchemaAttributes(schemasResponse);

      const userProfile = generateUserProfile(meResponse, processedSchemas);
      const flatProfile = generateFlattenedUserProfile(meResponse, processedSchemas);

      setProfile(meResponse);
      setSchemas(schemasResponse);
      setUser(userProfile);
      setFlattenedUser(flatProfile);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch user data');
      setError(error);

      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, baseUrl, onError]);

  /**
   * Refreshes user data by re-fetching from the server.
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    await fetchUserData();
  }, [fetchUserData]);

  /**
   * Updates user profile with the provided payload.
   */
  const updateUser = useCallback(
    async (payload: any): Promise<void> => {
      if (!baseUrl) {
        throw new AsgardeoAPIError(
          'Base URL is not available',
          'updateUser-NoBaseUrl-001',
          'javascript',
          400,
          'Bad Request',
        );
      }

      setIsLoading(true);
      setError(null);

      try {
        await updateMeProfile({url: `${baseUrl}/scim2/Me`, payload});
        await fetchUserData();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update user profile');
        setError(error);

        if (onError) {
          onError(error);
        }

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [baseUrl, fetchUserData, onError],
  );

  /**
   * Auto-fetch user data when user signs in and autoFetch is enabled.
   */
  useEffect(() => {
    if (autoFetch && isSignedIn) {
      fetchUserData();
    }
  }, [autoFetch, isSignedIn, fetchUserData]);

  /**
   * Clear user data when user signs out.
   */
  useEffect(() => {
    if (!isSignedIn) {
      setProfile(null);
      setSchemas(null);
      setUser(null);
      setFlattenedUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isSignedIn]);

  const contextValue = useMemo(
    () => ({
      isLoading,
      profile,
      schemas,
      flattenedUser,
      user,
      refreshUser,
      updateUser,
      error,
    }),
    [isLoading, profile, schemas, flattenedUser, user, refreshUser, updateUser, error],
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export default UserProvider;
