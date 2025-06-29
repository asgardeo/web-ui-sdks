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

import {FC, PropsWithChildren, ReactElement} from 'react';
import {AsgardeoRuntimeError, User, UserProfile} from '@asgardeo/node';
import AsgardeoClientProvider, {AsgardeoClientProviderProps} from '../client/contexts/Asgardeo/AsgardeoProvider';
import AsgardeoNextClient from '../AsgardeoNextClient';
import signInAction from './actions/signInAction';
import signOutAction from './actions/signOutAction';
import {AsgardeoNextConfig} from '../models/config';
import isSignedIn from './actions/isSignedIn';
import getUserAction from './actions/getUserAction';
import getSessionId from './actions/getSessionId';
import getUserProfileAction from './actions/getUserProfileAction';

/**
 * Props interface of {@link AsgardeoServerProvider}
 */
export type AsgardeoServerProviderProps = AsgardeoClientProviderProps & {
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
  console.log('Initializing Asgardeo client with config:', config);

  try {
    await asgardeoClient.initialize(_config);
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

  const _isSignedIn: boolean = await isSignedIn();
  let user: User = {};
  let userProfile: UserProfile = {
    schemas: [],
    profile: {},
    flattenedProfile: {},
  };

  if (_isSignedIn) {
    const userResponse = await getUserAction((await getSessionId()) as string);
    const userProfileResponse = await getUserProfileAction((await getSessionId()) as string);

    user = userResponse.data?.user || {};
    userProfile = userProfileResponse.data?.userProfile;
  }

  return (
    <AsgardeoClientProvider
      baseUrl={config.baseUrl}
      signIn={signInAction}
      signOut={signOutAction}
      signInUrl={config.signInUrl}
      preferences={config.preferences}
      clientId={config.clientId}
      user={user}
      userProfile={userProfile}
      isSignedIn={_isSignedIn}
    >
      {children}
    </AsgardeoClientProvider>
  );
};

export default AsgardeoServerProvider;
