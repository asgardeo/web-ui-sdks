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

import {FC, RefObject, PropsWithChildren, ReactElement, useEffect, useMemo, useRef, useState, use} from 'react';
import {SignInOptions, User} from '@asgardeo/browser';
import AsgardeoContext from '../contexts/AsgardeoContext';
import useBrowserUrl from '../hooks/useBrowserUrl';
import {AsgardeoReactConfig} from '../models/config';
import AsgardeoReactClient from '../AsgardeoReactClient';

/**
 * Props interface of {@link AsgardeoProvider}
 */
export type AsgardeoProviderProps = AsgardeoReactConfig;

const AsgardeoProvider: FC<PropsWithChildren<AsgardeoProviderProps>> = ({
  afterSignInUrl = window.location.origin,
  baseUrl,
  clientId,
  children,
}: PropsWithChildren<AsgardeoProviderProps>): ReactElement => {
  const reRenderCheckRef: RefObject<boolean> = useRef(false);
  const asgardeo: AsgardeoReactClient = useMemo(() => new AsgardeoReactClient(), []);
  const {hasAuthParams} = useBrowserUrl();

  const [isSignedInSync, setIsSignedInSync] = useState<boolean>(false);

  useEffect(() => {
    (async (): Promise<void> => {
      await asgardeo.initialize({
        baseUrl,
        clientId,
        afterSignInUrl,
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
      return await asgardeo.signIn(options);
    } catch (error) {
      throw new Error(`Error while signing in: ${error}`);
    }
  };

  const signUp = (): void => {
    throw new Error('Not implemented');
  };

  const signOut = async (afterSignOut?: () => void): Promise<boolean> => await asgardeo.signOut(afterSignOut);

  return (
    <AsgardeoContext.Provider
      value={{isSignedIn: isSignedInSync, signIn, signOut, signUp, isLoading: asgardeo.isLoading()}}
    >
      {children}
    </AsgardeoContext.Provider>
  );
};

export default AsgardeoProvider;
