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
import {Navigate, Route, RouteProps} from 'react-router-dom';
import {useAsgardeo} from '@asgardeo/react';

/**
 * Props for the ProtectedRoute component.
 */
export interface ProtectedRouteProps {
  /**
   * The element to render when the user is authenticated.
   */
  element: React.ReactElement;
  /**
   * Custom fallback element to render when the user is not authenticated.
   * If not provided, will redirect to the sign-in URL or a default fallback.
   */
  fallback?: React.ReactElement;
  /**
   * URL to redirect to when the user is not authenticated.
   * If not provided and no fallback is specified, will use a default sign-in flow.
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
  /**
   * The path prop for the route.
   */
  path?: string;
  /**
   * Additional route props that are safe to pass through.
   */
  caseSensitive?: boolean;
  children?: React.ReactNode;
  id?: string;
}

/**
 * A wrapper around React Router's Route component that protects routes based on authentication status.
 *
 * This component integrates with the Asgardeo React SDK to automatically redirect
 * unauthenticated users and render protected content only for authenticated users.
 *
 * @example
 * ```tsx
 * import { ProtectedRoute } from '@asgardeo/react-router';
 * import { BrowserRouter, Routes } from 'react-router-dom';
 * import Dashboard from './Dashboard';
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <Routes>
 *         <ProtectedRoute
 *           path="/dashboard"
 *           element={<Dashboard />}
 *         />
 *       </Routes>
 *     </BrowserRouter>
 *   );
 * }
 * ```
 *
 * @example With custom fallback
 * ```tsx
 * <ProtectedRoute
 *   path="/dashboard"
 *   element={<Dashboard />}
 *   fallback={<div>Please sign in to access this page</div>}
 * />
 * ```
 *
 * @example With redirect
 * ```tsx
 * <ProtectedRoute
 *   path="/dashboard"
 *   element={<Dashboard />}
 *   redirectTo="/login"
 * />
 * ```
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  fallback,
  redirectTo,
  showLoading = true,
  loadingElement,
  path,
  caseSensitive,
  children,
  id,
}) => {
  // Create a wrapper component to use the hook within React Router context
  const ProtectedElement: React.FC = () => {
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

    // If user is authenticated, render the protected element
    if (isSignedIn) {
      return element;
    }

    // If user is not authenticated, handle fallback/redirect
    if (fallback) {
      return fallback;
    }

    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Default behavior: trigger sign-in flow
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <div>
          <h2>Authentication Required</h2>
          <p>You need to sign in to access this page.</p>
          <button
            onClick={() => signIn()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  };

  // Pass only the safe props to Route
  const routeProps: RouteProps = {
    path,
    element: <ProtectedElement />,
    ...(caseSensitive !== undefined && {caseSensitive}),
    ...(children && {children}),
    ...(id && {id}),
  };

  return <Route {...routeProps} />;
};

export default ProtectedRoute;
