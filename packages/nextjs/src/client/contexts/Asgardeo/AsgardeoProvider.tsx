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

'use client';

import {
  EmbeddedFlowExecuteRequestConfig,
  EmbeddedFlowExecuteRequestPayload,
  EmbeddedSignInFlowHandleRequestPayload,
  User,
  UserProfile,
} from '@asgardeo/node';
import {I18nProvider, FlowProvider, UserProvider, ThemeProvider, AsgardeoProviderProps} from '@asgardeo/react';
import {FC, PropsWithChildren, useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import AsgardeoContext, {AsgardeoContextProps} from './AsgardeoContext';

/**
 * Props interface of {@link AsgardeoClientProvider}
 */
export type AsgardeoClientProviderProps = Partial<Omit<AsgardeoProviderProps, 'baseUrl' | 'clientId'>> &
  Pick<AsgardeoProviderProps, 'baseUrl' | 'clientId'> & {
    signOut: AsgardeoContextProps['signOut'];
    signIn: AsgardeoContextProps['signIn'];
    signUp: AsgardeoContextProps['signUp'];
    isSignedIn: boolean;
    userProfile: UserProfile;
    user: User | null;
  };

const AsgardeoClientProvider: FC<PropsWithChildren<AsgardeoClientProviderProps>> = ({
  baseUrl,
  children,
  signIn,
  signOut,
  signUp,
  preferences,
  isSignedIn,
  signInUrl,
  signUpUrl,
  user,
  userProfile,
}: PropsWithChildren<AsgardeoClientProviderProps>) => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [_userProfile, setUserProfile] = useState<UserProfile | null>(userProfile);

  useEffect(() => {
    if (!preferences?.theme?.mode || preferences.theme.mode === 'system') {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      setIsDarkMode(preferences.theme.mode === 'dark');
    }
  }, [preferences?.theme?.mode]);

  useEffect(() => {
    // Set loading to false when server has resolved authentication state
    setIsLoading(false);
  }, [isSignedIn, user]);

  const handleSignIn = async (
    payload: EmbeddedSignInFlowHandleRequestPayload,
    request: EmbeddedFlowExecuteRequestConfig,
  ) => {
    try {
      const result = await signIn(payload, request);

      // Redirect based flow URL is sent as `signInUrl` in the response.
      if (result?.data?.signInUrl) {
        router.push(result.data.signInUrl);

        return;
      }

      // After the Embedded flow is successful, the URL to navigate next is sent as `afterSignInUrl` in the response.
      if (result?.data?.afterSignInUrl) {
        router.push(result.data.afterSignInUrl);

        return;
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      return result?.data ?? result;
    } catch (error) {
      throw error;
    }
  };

  const handleSignUp = async (
    payload: EmbeddedFlowExecuteRequestPayload,
    request: EmbeddedFlowExecuteRequestConfig,
  ) => {
    console.log('[AsgardeoClientProvider] Executing sign-up action with payload', payload);
    try {
      const result = await signUp(payload, request);

      // Redirect based flow URL is sent as `signUpUrl` in the response.
      if (result?.data?.signUpUrl) {
        router.push(result.data.signUpUrl);

        return;
      }

      // After the Embedded flow is successful, the URL to navigate next is sent as `afterSignUpUrl` in the response.
      if (result?.data?.afterSignUpUrl) {
        router.push(result.data.afterSignUpUrl);

        return;
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      return result?.data ?? result;
    } catch (error) {
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      const result = await signOut();

      if (result?.data?.afterSignOutUrl) {
        router.push(result.data.afterSignOutUrl);
        return {redirected: true, location: result.data.afterSignOutUrl};
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      return result?.data ?? result;
    } catch (error) {
      throw error;
    }
  };

  const contextValue = useMemo(
    () => ({
      baseUrl,
      user,
      isSignedIn,
      isLoading,
      signIn: handleSignIn,
      signOut: handleSignOut,
      signUp: handleSignUp,
      signInUrl,
      signUpUrl,
    }),
    [baseUrl, user, isSignedIn, isLoading, signInUrl, signUpUrl],
  );

  return (
    <AsgardeoContext.Provider value={contextValue}>
      <I18nProvider preferences={preferences?.i18n}>
        <ThemeProvider theme={preferences?.theme?.overrides} defaultColorScheme={isDarkMode ? 'dark' : 'light'}>
          <FlowProvider>
            <UserProvider profile={userProfile}>{children}</UserProvider>
          </FlowProvider>
        </ThemeProvider>
      </I18nProvider>
    </AsgardeoContext.Provider>
  );
};

export default AsgardeoClientProvider;
