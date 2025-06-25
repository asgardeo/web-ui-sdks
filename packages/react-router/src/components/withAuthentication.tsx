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
 * Options for the withAuthentication higher-order component.
 */
export interface WithAuthenticationOptions {
  /**
   * Custom fallback element to render when the user is not authenticated.
   */
  fallback?: React.ReactElement;
  /**
   * URL to redirect to when the user is not authenticated.
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
   * Additional condition that must be met for the user to access the component.
   * This function receives the authentication context and should return true if access is allowed.
   */
  additionalCheck?: (authContext: ReturnType<typeof useAsgardeo>) => boolean;
}

/**
 * Higher-order component that wraps a component with authentication protection.
 *
 * This HOC can be used to protect any React component, not just Route components.
 * It provides more flexibility for complex authentication scenarios.
 *
 * @param WrappedComponent - The component to protect with authentication
 * @param options - Configuration options for the authentication protection
 *
 * @example
 * ```tsx
 * import { withAuthentication } from '@asgardeo/react-router';
 *
 * const Dashboard = () => <div>Protected Dashboard</div>;
 *
 * const ProtectedDashboard = withAuthentication(Dashboard, {
 *   redirectTo: '/login'
 * });
 * ```
 *
 * @example With additional checks
 * ```tsx
 * const AdminPanel = withAuthentication(AdminPanelComponent, {
 *   additionalCheck: (authContext) => {
 *     // Only allow users with admin role
 *     return authContext.user?.groups?.includes('admin');
 *   },
 *   fallback: <div>You don't have permission to access this page</div>
 * });
 * ```
 */
const withAuthentication = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthenticationOptions = {},
): React.FC<P> => {
  const {fallback, redirectTo, showLoading = true, loadingElement, additionalCheck} = options;

  const AuthenticatedComponent: React.FC<P> = props => {
    const authContext = useAsgardeo();
    const {isSignedIn, isLoading, signIn} = authContext;

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

    // Check if user is authenticated
    if (!isSignedIn) {
      if (fallback) {
        return fallback;
      }

      if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
      }

      // Default behavior: show sign-in prompt
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
    }

    // Check additional conditions if provided
    if (additionalCheck && !additionalCheck(authContext)) {
      if (fallback) {
        return fallback;
      }

      return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          <div>
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    // User is authenticated and meets all conditions, render the wrapped component
    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuthentication(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
};

export default withAuthentication;
