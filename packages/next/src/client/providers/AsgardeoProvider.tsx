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

import {AsgardeoProviderProps as AsgardeoReactProviderProps, SignOutOptions, User} from '@asgardeo/react';
import {useRouter} from 'next/navigation';
import {FC, PropsWithChildren, ReactElement, useEffect, useMemo, useState} from 'react';
import AsgardeoNextClient from '../../AsgardeoNextClient';
import AsgardeoContext from '../contexts/AsgardeoContext';

export type AsgardeoProviderProps = Partial<AsgardeoReactProviderProps>;

/**
 * Provider component that makes the Asgardeo client instance available to any
 * nested components that need to access authentication functionality.
 */
const AsgardeoProvider: FC<PropsWithChildren<AsgardeoProviderProps>> = ({
  afterSignInUrl,
  children,
  baseUrl,
  clientId,
  clientSecret,
}: PropsWithChildren<AsgardeoProviderProps>): ReactElement => {
  const asgardeo: AsgardeoNextClient = useMemo(() => new AsgardeoNextClient(), []);

  const router = useRouter();

  const [isSignedInSync, setIsSignedInSync] = useState<boolean>(false);

  useEffect(() => {
    (async (): Promise<void> => {
      await asgardeo.initialize({
        afterSignInUrl,
        baseUrl,
        clientId,
        clientSecret,
      });
    })();
  }, []);

  /**
   * Check if the user is signed in and update the state accordingly.
   * This will also set an interval to check for the sign-in status every second
   * until the user is signed in.
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;

    (async (): Promise<void> => {
      try {
        const status: boolean = await asgardeo.isSignedIn();

        setIsSignedInSync(status);

        if (!status) {
          interval = setInterval(async () => {
            const newStatus: boolean = await asgardeo.isSignedIn();

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

    return (): void => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [asgardeo]);

  const signIn = async (): Promise<User> =>
    asgardeo.signIn({}, 'undefined', (redirectUrl: string) => {
      router.push(redirectUrl);
    });

  const signUp = async (): Promise<void> => {
    throw new Error('Not implemented. Sign up is not supported in Asgardeo Next Client.');
  };

  const signOut = async (options?: SignOutOptions, afterSignOut?: () => void): Promise<boolean> =>
    asgardeo.signOut(options, afterSignOut);

  return (
    <AsgardeoContext.Provider
      value={{isSignedIn: isSignedInSync, signIn, signOut, signUp, isLoading: asgardeo.isLoading()}}
    >
      {children}
    </AsgardeoContext.Provider>
  );
};

export default AsgardeoProvider;
