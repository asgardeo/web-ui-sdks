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

'use server';

import {FC, PropsWithChildren, ReactElement} from 'react';
import {
  BrandingPreference,
  AllOrganizationsApiResponse,
  AsgardeoRuntimeError,
  Organization,
  User,
  UserProfile,
  IdToken,
} from '@asgardeo/node';
import AsgardeoClientProvider from '../client/contexts/Asgardeo/AsgardeoProvider';
import AsgardeoNextClient from '../AsgardeoNextClient';
import signInAction from './actions/signInAction';
import signOutAction from './actions/signOutAction';
import {AsgardeoNextConfig} from '../models/config';
import isSignedIn from './actions/isSignedIn';
import getUserAction from './actions/getUserAction';
import getSessionId from './actions/getSessionId';
import getUserProfileAction from './actions/getUserProfileAction';
import signUpAction from './actions/signUpAction';
import handleOAuthCallbackAction from './actions/handleOAuthCallbackAction';
import {AsgardeoProviderProps} from '@asgardeo/react';
import getCurrentOrganizationAction from './actions/getCurrentOrganizationAction';
import updateUserProfileAction from './actions/updateUserProfileAction';
import getMyOrganizations from './actions/getMyOrganizations';
import getAllOrganizations from './actions/getAllOrganizations';
import getBrandingPreference from './actions/getBrandingPreference';
import switchOrganization from './actions/switchOrganization';

/**
 * Props interface of {@link AsgardeoServerProvider}
 */
export type AsgardeoServerProviderProps = Partial<AsgardeoProviderProps> & {
  clientSecret?: string;
};

/**
 * Server-side provider component for Asgardeo authentication.
 * Wraps the client-side provider and handles server-side authentication logic.
 * Uses the singleton AsgardeoNextClient instance for consistent authentication state.
 *
 * @param props - Props injected into the component.
 *
 * @example
 * ```tsx
 * <AsgardeoServerProvider config={asgardeoConfig}>
 *   <YourApp />
 * </AsgardeoServerProvider>
 * ```
 *
 * @returns AsgardeoServerProvider component.
 */
const AsgardeoServerProvider: FC<PropsWithChildren<AsgardeoServerProviderProps>> = async ({
  children,
  afterSignInUrl,
  afterSignOutUrl,
  ..._config
}: PropsWithChildren<AsgardeoServerProviderProps>): Promise<ReactElement> => {
  const asgardeoClient = AsgardeoNextClient.getInstance();
  let config: Partial<AsgardeoNextConfig> = {};

  try {
    await asgardeoClient.initialize(_config as AsgardeoNextConfig);
    config = await asgardeoClient.getConfiguration();
  } catch (error) {
    throw new AsgardeoRuntimeError(
      `Failed to initialize Asgardeo client: ${error?.toString()}`,
      'next-ConfigurationError-001',
      'next',
      'An error occurred while initializing the Asgardeo client. Please check your configuration.',
    );
  }

  if (!asgardeoClient.isInitialized) {
    return <></>;
  }

  const sessionId: string = (await getSessionId()) as string;
  const _isSignedIn: boolean = await isSignedIn(sessionId);

  let user: User = {};
  let userProfile: UserProfile = {
    schemas: [],
    profile: {},
    flattenedProfile: {},
  };
  let currentOrganization: Organization = {
    id: '',
    name: '',
    orgHandle: '',
  };
  let myOrganizations: Organization[] = [];
  let brandingPreference: BrandingPreference | null = null;

  if (_isSignedIn) {
    // Check if there's a `user_org` claim in the ID token to determine if this is an organization login
    const idToken = await asgardeoClient.getDecodedIdToken(sessionId);
    let updatedBaseUrl = config?.baseUrl;

    if (idToken?.['user_org']) {
      // Treat this login as an organization login and modify the base URL
      updatedBaseUrl = `${config?.baseUrl}/o`;
      config = { ...config, baseUrl: updatedBaseUrl };
    }

    const userResponse = await getUserAction(sessionId);
    const userProfileResponse = await getUserProfileAction(sessionId);
    const currentOrganizationResponse = await getCurrentOrganizationAction(sessionId);
    myOrganizations = await getMyOrganizations({}, sessionId);

    user = userResponse.data?.user || {};
    userProfile = userProfileResponse.data?.userProfile;
    currentOrganization = currentOrganizationResponse?.data?.organization as Organization;
  }

  // Fetch branding preference if branding is enabled in config
  if (config?.preferences?.theme?.inheritFromBranding !== false) {
    try {
      brandingPreference = await getBrandingPreference(
        {
          baseUrl: config?.baseUrl as string,
          locale: 'en-US',
          name: config.applicationId || config.organizationHandle,
          type: config.applicationId ? 'APP' : 'ORG',
        },
        sessionId,
      );
    } catch (error) {
      console.warn('[AsgardeoServerProvider] Failed to fetch branding preference:', error);
    }
  }

  const handleGetAllOrganizations = async (
    options?: any,
    _sessionId?: string,
  ): Promise<AllOrganizationsApiResponse> => {
    'use server';
    return await getAllOrganizations(options, sessionId);
  };

  const handleSwitchOrganization = async (organization: Organization, _sessionId?: string): Promise<void> => {
    'use server';
    await switchOrganization(organization, sessionId);

    // After switching organization, we need to refresh the page to get updated session data
    // This is because server components don't maintain state between function calls
    const {revalidatePath} = await import('next/cache');

    // Revalidate the current path to refresh the component with new data
    revalidatePath('/');
  };

  return (
    <AsgardeoClientProvider
      organizationHandle={config?.organizationHandle}
      applicationId={config?.applicationId}
      baseUrl={config?.baseUrl}
      signIn={signInAction}
      signOut={signOutAction}
      signUp={signUpAction}
      handleOAuthCallback={handleOAuthCallbackAction}
      signInUrl={config?.signInUrl}
      signUpUrl={config?.signUpUrl}
      preferences={config?.preferences}
      clientId={config?.clientId}
      user={user}
      currentOrganization={currentOrganization}
      userProfile={userProfile}
      updateProfile={updateUserProfileAction}
      isSignedIn={_isSignedIn}
      myOrganizations={myOrganizations}
      getAllOrganizations={handleGetAllOrganizations}
      switchOrganization={handleSwitchOrganization}
      brandingPreference={brandingPreference}
    >
      {children}
    </AsgardeoClientProvider>
  );
};

export default AsgardeoServerProvider;
