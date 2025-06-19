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

import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAsgardeo} from '@asgardeo/react';

/**
 * Props for the ProtectedRoute component.
 */
export interface ProtectedRouteProps {
  /**
   * The element to render when the user is authenticated.
   */
  children: React.ReactElement;
  /**
   * Custom fallback element to render when the user is not authenticated.
   * If provided, this takes precedence over redirectTo.
   */
  fallback?: React.ReactElement;
  /**
   * URL to redirect to when the user is not authenticated.
   * Required unless a fallback element is provided.
   */
  redirectTo?: string;
  /**
   * Whether to show a loading state while authentication status is being determined.
   * @default true
   */
  showLoading?: boolean;
  /**
   * Custom loading element to render while authentication status is being determined.
   */
  loadingElement?: React.ReactElement;
}

/**
 * A protected route component that requires authentication to access.
 *
 * This component should be used as the element prop of a Route component.
 * It checks authentication status and either renders the protected content,
 * shows a loading state, redirects, or shows a fallback.
 *
 * Either a `redirectTo` prop or a `fallback` prop must be provided to handle
 * unauthenticated users.
 *
 * @example Basic usage with redirect
 * ```tsx
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute redirectTo="/signin">
 *       <Dashboard />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 *
 * @example With custom fallback
 * ```tsx
 * <Route
 *   path="/admin"
 *   element={
 *     <ProtectedRoute fallback={<div>Access denied</div>}>
 *       <AdminPanel />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  redirectTo,
  showLoading = true,
  loadingElement,
}) => {
  const {isSignedIn, isLoading, signIn} = useAsgardeo();

  // Show loading state while authentication status is being determined
  if (isLoading && showLoading) {
    if (loadingElement) {
      return loadingElement;
    }
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <div>Loading...</div>
      </div>
    );
  }

  // If user is authenticated, render the protected content
  if (isSignedIn) {
    return children;
  }

  // If user is not authenticated, handle fallback/redirect
  if (fallback) {
    return fallback;
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  // If neither fallback nor redirectTo is provided, throw an error
  throw new Error(
    'ProtectedRoute: Either "fallback" or "redirectTo" prop must be provided to handle unauthenticated users.',
  );
};

export default ProtectedRoute;
