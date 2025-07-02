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
import {AsgardeoRuntimeError, Organization, User, UserProfile} from '@asgardeo/node';
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

  if (_isSignedIn) {
    const userResponse = await getUserAction(sessionId);
    const userProfileResponse = await getUserProfileAction(sessionId);
    const currentOrganizationResponse = await getCurrentOrganizationAction(sessionId);

    user = userResponse.data?.user || {};
    userProfile = userProfileResponse.data?.userProfile;
    currentOrganization = currentOrganizationResponse?.data?.organization as Organization;
  }

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
    >
      {children}
    </AsgardeoClientProvider>
  );
};

export default AsgardeoServerProvider;
