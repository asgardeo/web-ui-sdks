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

import {SPAUtils} from '@asgardeo/browser';

/**
 * Interface for the useBrowserUrl hook return value.
 */
export interface UseBrowserUrl {
  /**
   * Checks if the current URL contains authentication parameters.
   *
   * @param url - The URL object to check for authentication parameters
   * @param afterSignInUrl - The URL where the authorization server should redirect after authentication
   * @returns True if the URL contains authentication parameters and matches the afterSignInUrl, or if it contains an error parameter
   */
  hasAuthParams: (url: URL, afterSignInUrl: string) => boolean;
}

/**
 * Hook that provides utilities for handling browser URLs in authentication flows.
 *
 * @returns An object containing URL utility functions
 *
 * @example
 * ```tsx
 * const { hasAuthParams } = useBrowserUrl();
 * const url = new URL(window.location.href);
 *
 * if (hasAuthParams(url, "/after-signin")) {
 *   // Handle authentication callback
 * }
 * ```
 */
const useBrowserUrl = (): UseBrowserUrl => {
  const hasAuthParams = (url: URL, afterSignInUrl: string): boolean => {
    return (
      (SPAUtils.hasAuthSearchParamsInURL() &&
        new URL(url.origin + url.pathname).toString() === new URL(afterSignInUrl).toString()) ||
      // authParams?.authorizationCode || // FIXME: These are sent externally. Need to see what we can do about this.
      url.searchParams.get('error') !== null
    );
  };

  return {hasAuthParams};
};

export default useBrowserUrl;
