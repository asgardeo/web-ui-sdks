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

import {
  AsgardeoRuntimeError,
  EmbeddedFlowExecuteRequestPayload,
  EmbeddedFlowExecuteResponse,
  SignInOptions,
  SignOutOptions,
  User,
  UserProfile,
} from '@asgardeo/browser';
import {FC, RefObject, PropsWithChildren, ReactElement, useEffect, useMemo, useRef, useState, use} from 'react';
import AsgardeoContext from './AsgardeoContext';
import AsgardeoReactClient from '../../AsgardeoReactClient';
import useBrowserUrl from '../../hooks/useBrowserUrl';
import {AsgardeoReactConfig} from '../../models/config';
import FlowProvider from '../Flow/FlowProvider';
import I18nProvider from '../I18n/I18nProvider';
import ThemeProvider from '../Theme/ThemeProvider';
import UserProvider from '../User/UserProvider';

/**
 * Props interface of {@link AsgardeoProvider}
 */
export type AsgardeoProviderProps = AsgardeoReactConfig;

const AsgardeoProvider: FC<PropsWithChildren<AsgardeoProviderProps>> = ({
  afterSignInUrl = window.location.origin,
  afterSignOutUrl = window.location.origin,
  baseUrl,
  clientId,
  children,
  scopes,
  preferences,
  ...rest
}: PropsWithChildren<AsgardeoProviderProps>): ReactElement => {
  const reRenderCheckRef: RefObject<boolean> = useRef(false);
  const asgardeo: AsgardeoReactClient = useMemo(() => new AsgardeoReactClient(), []);
  const {hasAuthParams} = useBrowserUrl();
  const [user, setUser] = useState<any | null>(null);

  const [isSignedInSync, setIsSignedInSync] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      await asgardeo.initialize({
        afterSignInUrl,
        afterSignOutUrl,
        baseUrl,
        clientId,
        scopes,
        ...rest,
      });
    })();
  }, []);

  /**
   * Try signing in when the component is mounted.
   */
  useEffect(() => {
    // React 18.x Strict.Mode has a new check for `Ensuring reusable state` to facilitate an upcoming react feature.
    // https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state
    // This will remount all the useEffects to ensure that there are no unexpected side effects.
    // When react remounts the signIn hook of the AuthProvider, it will cause a race condition. Hence, we have to
    // prevent the re-render of this hook as suggested in the following discussion.
    // https://github.com/reactwg/react-18/discussions/18#discussioncomment-795623
    if (reRenderCheckRef.current) {
      return;
    }

    reRenderCheckRef.current = true;

    (async (): Promise<void> => {
      // User is already authenticated. Skip...
      if (await asgardeo.isSignedIn()) {
        setUser(await asgardeo.getUser());
        setUserProfile(await asgardeo.getUserProfile());

        return;
      }

      if (hasAuthParams(new URL(window.location.href), afterSignInUrl)) {
        try {
          await signIn(
            {callOnlyOnRedirect: true},
            // authParams?.authorizationCode,
            // authParams?.sessionState,
            // authParams?.state,
          );

          // setError(null);
        } catch (error) {
          debugger;
          if (error && Object.prototype.hasOwnProperty.call(error, 'code')) {
            // setError(error);
          }
        }
      }
    })();
  }, []);

  /**
   * Check if the user is signed in and update the state accordingly.
   * This will also set an interval to check for the sign-in status every second
   * until the user is signed in.
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;

    (async () => {
      try {
        const status = await asgardeo.isSignedIn();
        setIsSignedInSync(status);

        if (!status) {
          interval = setInterval(async () => {
            const newStatus = await asgardeo.isSignedIn();
            if (newStatus) {
              setIsSignedInSync(true);
              clearInterval(interval);
            }
          }, 1000);
        }
      } catch (error) {
        setIsSignedInSync(false);
      }
    })();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [asgardeo]);

  const signIn = async (options?: SignInOptions): Promise<User> => {
    try {
      const response = await asgardeo.signIn(options);

      if (await asgardeo.isSignedIn()) {
        setUser(await asgardeo.getUser());
        setUserProfile(await asgardeo.getUserProfile());
      }

      return response;
    } catch (error) {
      throw new Error(`Error while signing in: ${error}`);
    }
  };

  const signUp = async (payload?: EmbeddedFlowExecuteRequestPayload): Promise<void | EmbeddedFlowExecuteResponse> => {
    try {
      return await asgardeo.signUp(payload);
    } catch (error) {
      throw new AsgardeoRuntimeError(
        `Error while signing up: ${error.message || error}`,
        'asgardeo-signUp-Error',
        'react',
        'An error occurred while trying to sign up.',
      );
    }
  };

  const signOut = async (options?: SignOutOptions, afterSignOut?: () => void): Promise<string> =>
    asgardeo.signOut(options, afterSignOut);

  const isDarkMode = useMemo(() => {
    if (!preferences?.theme?.mode || preferences.theme.mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return preferences.theme.mode === 'dark';
  }, [preferences?.theme?.mode]);

  return (
    <AsgardeoContext.Provider
      value={{
        isLoading: asgardeo.isLoading(),
        isSignedIn: isSignedInSync,
        signIn,
        signOut,
        signUp,
        user,
        baseUrl,
        afterSignInUrl,
      }}
    >
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

export default AsgardeoProvider;
