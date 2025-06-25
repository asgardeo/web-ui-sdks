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

import {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAsgardeo} from '@asgardeo/react';

/**
 * Options for the useAuthGuard hook.
 */
export interface UseAuthGuardOptions {
  /**
   * Path to redirect to when the user is not authenticated.
   * @default '/login'
   */
  redirectTo?: string;
  /**
   * Whether to preserve the current location as a return URL.
   * When true, adds a 'returnTo' query parameter with the current path.
   * @default true
   */
  preserveReturnUrl?: boolean;
  /**
   * Additional condition that must be met for the user to access the route.
   * This function receives the authentication context and should return true if access is allowed.
   */
  additionalCheck?: (authContext: ReturnType<typeof useAsgardeo>) => boolean;
  /**
   * Whether to check authentication status immediately on mount.
   * @default true
   */
  immediate?: boolean;
}

/**
 * Hook that provides authentication guard functionality for routes.
 *
 * This hook can be used within any component to enforce authentication
 * and optionally redirect unauthenticated users.
 *
 * @param options - Configuration options for the authentication guard
 *
 * @returns Object containing authentication status and helper functions
 *
 * @example
 * ```tsx
 * import { useAuthGuard } from '@asgardeo/react-router';
 *
 * function Dashboard() {
 *   const { isAllowed, isLoading } = useAuthGuard({
 *     redirectTo: '/login'
 *   });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!isAllowed) return null; // Will redirect
 *
 *   return <div>Protected Dashboard Content</div>;
 * }
 * ```
 *
 * @example With additional checks
 * ```tsx
 * function AdminPanel() {
 *   const { isAllowed, authContext } = useAuthGuard({
 *     additionalCheck: (auth) => auth.user?.groups?.includes('admin'),
 *     redirectTo: '/unauthorized'
 *   });
 *
 *   if (!isAllowed) return null;
 *
 *   return <div>Admin Panel</div>;
 * }
 * ```
 */
export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const {redirectTo = '/login', preserveReturnUrl = true, additionalCheck, immediate = true} = options;

  const authContext = useAsgardeo();
  const {isSignedIn, isLoading} = authContext;
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = isSignedIn;
  const meetsAdditionalChecks = additionalCheck ? additionalCheck(authContext) : true;
  const isAllowed = isAuthenticated && meetsAdditionalChecks;

  useEffect(() => {
    if (!immediate || isLoading) {
      return;
    }

    if (!isAuthenticated) {
      const redirectUrl = preserveReturnUrl
        ? `${redirectTo}?returnTo=${encodeURIComponent(location.pathname + location.search)}`
        : redirectTo;

      navigate(redirectUrl, {replace: true});
      return;
    }

    if (!meetsAdditionalChecks) {
      navigate(redirectTo, {replace: true});
    }
  }, [isAuthenticated, meetsAdditionalChecks, immediate, isLoading, navigate, redirectTo, preserveReturnUrl, location]);

  return {
    /**
     * Whether the user is allowed to access the current route.
     */
    isAllowed,
    /**
     * Whether authentication status is still being determined.
     */
    isLoading,
    /**
     * Whether the user is authenticated.
     */
    isAuthenticated,
    /**
     * Whether the user meets additional authorization checks.
     */
    meetsAdditionalChecks,
    /**
     * The full authentication context from useAsgardeo.
     */
    authContext,
    /**
     * Function to manually trigger the authentication check and redirect.
     */
    checkAuth: () => {
      if (!isAuthenticated) {
        const redirectUrl = preserveReturnUrl
          ? `${redirectTo}?returnTo=${encodeURIComponent(location.pathname + location.search)}`
          : redirectTo;

        navigate(redirectUrl, {replace: true});
        return;
      }

      if (!meetsAdditionalChecks) {
        navigate(redirectTo, {replace: true});
      }
    },
  };
};

/**
 * Hook that provides functionality for handling return URLs after authentication.
 *
 * This hook is typically used on login/authentication pages to redirect users
 * back to where they were trying to go before being redirected to sign in.
 *
 * @example
 * ```tsx
 * import { useReturnUrl } from '@asgardeo/react-router';
 *
 * function LoginPage() {
 *   const { returnTo, navigateToReturnUrl } = useReturnUrl();
 *   const { signIn } = useAsgardeo();
 *
 *   const handleSignIn = async () => {
 *     await signIn();
 *     navigateToReturnUrl(); // Redirects to original destination
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleSignIn}>Sign In</button>
 *       {returnTo && <p>You'll be redirected to: {returnTo}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useReturnUrl = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo');

  const navigateToReturnUrl = (fallbackPath = '/') => {
    const destination = returnTo || fallbackPath;
    navigate(destination, {replace: true});
  };

  return {
    /**
     * The URL to return to after authentication, if available.
     */
    returnTo,
    /**
     * Function to navigate to the return URL or a fallback path.
     */
    navigateToReturnUrl,
    /**
     * Whether a return URL is available.
     */
    hasReturnUrl: Boolean(returnTo),
  };
};

export default useAuthGuard;
