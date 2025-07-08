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

import {Context, createContext} from 'react';
import {HttpRequestConfig, HttpResponse, Organization} from '@asgardeo/browser';
import AsgardeoReactClient from '../../AsgardeoReactClient';

/**
 * Props interface of {@link AsgardeoContext}
 */
export type AsgardeoContextProps = {
  organizationHandle: string | undefined;
  applicationId: string | undefined;
  signInUrl: string | undefined;
  signUpUrl: string | undefined;
  afterSignInUrl: string | undefined;
  baseUrl: string | undefined;
  isInitialized: boolean;
  /**
   * Flag indicating whether the SDK is working in the background.
   */
  isLoading: boolean;
  /**
   * Flag indicating whether the user is signed in or not.
   */
  isSignedIn: boolean;
  /**
   * Sign-in function to initiate the authentication process.
   * @remark This is the programmatic version of the `SignInButton` component.
   * TODO: Fix the types.
   */
  signIn: any;
  signInSilently: AsgardeoReactClient['signInSilently'];
  /**
   * Sign-out function to terminate the authentication session.
   * @remark This is the programmatic version of the `SignOutButton` component.
   * FIXME: Fix the types.
   */
  signOut: any;
  /**
   * Sign-up function to initiate the registration process.
   * @remark This is the programmatic version of the `SignUpButton` component.
   * FIXME: Fix the types.
   */
  signUp: any;
  user: any;
  organization: Organization;
  /**
   * Custom fetch function to make HTTP requests.
   * @param url - The URL to fetch.
   * @param options - Optional configuration for the HTTP request.
   * @returns A promise that resolves to the HTTP response.
   */
  fetch: (url: string, options?: HttpRequestConfig) => Promise<HttpResponse<any>>;
};

/**
 * Context object for managing the Authentication flow builder core context.
 */
const AsgardeoContext: Context<AsgardeoContextProps | null> = createContext<null | AsgardeoContextProps>({
  organizationHandle: undefined,
  applicationId: undefined,
  signInUrl: undefined,
  signUpUrl: undefined,
  afterSignInUrl: undefined,
  baseUrl: undefined,
  isInitialized: false,
  isLoading: true,
  isSignedIn: false,
  organization: null,
  signIn: null,
  signInSilently: null,
  signOut: null,
  signUp: null,
  user: null,
  fetch: () => null,
});

AsgardeoContext.displayName = 'AsgardeoContext';

export default AsgardeoContext;
