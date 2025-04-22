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

import type {BasicUserInfo, DataLayer, DecodedIDTokenPayload, FetchResponse, OIDCEndpoints} from '@asgardeo/auth-node';
import {ref, readonly} from 'vue';
import {navigateTo, type Ref} from '#imports';

export const useAuth = () => {
  // Loading state to track when auth operations are in progress
  const isLoading: Ref<boolean, boolean> = ref<boolean>(false);

  /**
   * Initiates the Asgardeo sign-in flow by redirecting the user
   * to the server-side sign-in handler.
   * @param { string } [callbackUrl] - Optional URL to redirect to after successful login. Defaults to current page.
   */
  const signIn = async (callbackUrl?: string): Promise<void> => {
    const targetUrl: string = '/api/auth/signin';
    const options = {
      query: {},
      external: true,
    };
    const redirectParam: string = callbackUrl || (typeof window !== 'undefined' ? window.location.pathname : '/');
    options.query = {callbackUrl: redirectParam};
    options.external = true; // Required for navigating away to Asgardeo

    await navigateTo(targetUrl, options);
  };

  /**
   * Retrieves the ID token for the currently authenticated session.
   *
   * This function sends a request to the `/api/auth/get-id-token` endpoint,
   * which expects a valid session cookie to be present. If the session is
   * valid, the function returns the associated ID token.
   *
   * @returns {Promise<string | null>} - A promise that resolves to the ID token if available, or `null` if not.
   */
  const getIdToken = async (): Promise<string | null> => {
    try {
      const response: Response = await fetch('/api/auth/get-id-token', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data.idToken;
    } catch (error) {
      return null;
    }
  };

  /**
   * Retrieves the access token for the currently authenticated session.
   *
   * This function sends a request to the /api/auth/get-access-token endpoint,
   * which expects a valid session cookie to be present. If the session is
   * valid, the function returns the associated access token.
   *
   * @returns {Promise<string | null>} - A promise that resolves to the access token if available, or null if not.
   */
  const getAccessToken = async (): Promise<string | null> => {
    try {
      // The specific endpoint for getting the access token
      const apiUrl = '/api/auth/get-access-token';

      const response: Response = await fetch(apiUrl, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      return null;
    }
  };

  /**
   * Retrieves the decoded ID token payload for the currently authenticated session.
   *
   * This function sends a request to the /api/auth/get-decoded-id-token endpoint,
   * which expects a valid session cookie. If the session is valid, the function
   * returns the decoded ID token payload.
   *
   * @returns {Promise<DecodedIDTokenPayload | null>} - A promise that resolves to the decoded ID token payload if available, or null if not.
   */
  const getDecodedIDToken = async (): Promise<DecodedIDTokenPayload | null> => {
    try {
      const url = `/api/auth/get-decoded-id-token`;

      const response: Response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.decodedIDToken;
    } catch (error) {
      return null;
    }
  };

  /**
   * Revokes the tokens associated with the current session.
   * Sends a POST request to the server-side `/api/auth?action=revoke-token`.
   *
   * @returns {Promise<void>}
   */
  const revokeAccessToken = async (): Promise<void> => {
    try {
      const response: FetchResponse = await fetch('/api/auth/revoke-token', {
        method: 'POST',
      });

      if (response?.ok) {
        console.log(response.body);
      } else {
        console.warn('Token revocation response:', response);
      }
    } catch (error) {
      console.error('Error revoking token:', error);
    }
  };

  /**
   * Checks if the user is currently authenticated.
   *
   * This function sends a request to the `/api/auth/is-authenticated` endpoint,
   * which expects a valid session cookie to be present. It returns a boolean
   * indicating the authentication status of the current session.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if authenticated, otherwise `false`.
   */
  const isAuthenticated = async (): Promise<boolean> => {
    try {
      const response: Response = await fetch('/api/auth/isAuthenticated', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data === true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Initiates the sign-out flow by navigating to the server-side
   * sign-out handler. The server handler is responsible for clearing
   * the local session and redirecting the user to the Asgardeo
   * logout endpoint.
   */
  const signOut = async (): Promise<void> => {
    const targetUrl: string = '/api/auth/signout';
    const options = {external: true};

    await navigateTo(targetUrl, options);
  };

  /**
   * Fetches basic information about the currently logged-in user
   * from the server-side '/api/auth/user' endpoint.
   * Updates the internal state variables with the result.
   *
   * @returns {Promise<BasicUserInfo | null>} A promise resolving to user info or null.
   */
  const getBasicUserInfo = async (): Promise<BasicUserInfo | null> => {
    const targetUrl: string = '/api/auth/user';

    isLoading.value = true;

    try {
      const userInfo: BasicUserInfo = await $fetch<BasicUserInfo>(targetUrl, {
        method: 'GET',
      });

      return userInfo;
    } catch (error: any) {
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Retrieves OIDC service endpoint information from the backend.
   *
   * This function sends a GET request to the /api/auth/get-oidc-endpoints
   * endpoint. It may or may not require an active session depending on
   * the backend implementation.
   *
   * @returns {Promise<OIDCEndpoints | null>} - A promise that resolves to the
   * OIDC endpoints object if available, or null if an error occurs or
   * the data is not found.
   */
  const getOIDCServiceEndpoints = async (): Promise<OIDCEndpoints | null> => {
    try {
      const apiUrl = '/api/auth/get-oidc-endpoints';

      const response: Response = await fetch(apiUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        return null;
      }

      // Assume the server returns the OIDCEndpoints object directly as JSON body
      const data: OIDCEndpoints = await response.json();

      if (typeof data === 'object' && data !== null) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  
  const getDataLayer = async (): Promise<DataLayer<any> | null> => {
    try {
      const apiUrl = '/api/auth/get-data-layer';

      const response: Response = await fetch(apiUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        return null;
      }
      const data: DataLayer<any> = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  };

  return {
    getAccessToken,
    getBasicUserInfo,
    getDataLayer,
    getDecodedIDToken,
    getIdToken,
    getOIDCServiceEndpoints,
    isAuthenticated,
    isLoading: readonly(isLoading),
    signIn,
    signOut,
    revokeAccessToken,
  };
};
