'use client';

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

import {AsgardeoProviderProps as AsgardeoReactProviderProps} from '@asgardeo/react';
import {useRouter, NextRouter} from 'next/navigation';
import {FC, PropsWithChildren, ReactElement, useState} from 'react';
import AsgardeoNextClient from '../../AsgardeoNextClient';
import AsgardeoContext from '../../contexts/AsgardeoContext';

export type AsgardeoProviderProps = AsgardeoReactProviderProps;

const withNextAsgardeoProviderOptions = (options: AsgardeoProviderProps): AsgardeoProviderProps => {
  const {baseUrl, clientId, clientSecret, ...rest} = options;

  return {
    ...rest,
    baseUrl: baseUrl || process.env['NEXT_PUBLIC_ASGARDEO_BASE_URL'],
    clientID: clientId || process.env['NEXT_PUBLIC_ASGARDEO_CLIENT_ID'],
    clientSecret: clientSecret || process.env['ASGARDEO_CLIENT_SECRET'],
  };
};

/**
 * Provider component that makes the Asgardeo client instance available to any
 * nested components that need to access authentication functionality.
 */
const AsgardeoProvider: FC<PropsWithChildren<AsgardeoProviderProps>> = ({
  children,
  baseUrl,
  clientId,
  clientSecret,
}: PropsWithChildren<AsgardeoProviderProps>): ReactElement => {
  const router: NextRouter = useRouter();

  const [client] = useState(
    () =>
      new AsgardeoNextClient(
        withNextAsgardeoProviderOptions({
          baseUrl,
          clientId,
          clientSecret,
          signInRedirectURL: window.location.origin,
        }),
      ),
  );

  const signIn = async (): Promise<void> => {
    await client.signIn((authorizationUrl: string) => {
      router.push(authorizationUrl);
    }, 'sessionId');
  };

  const signUp = async (): Promise<void> => {
    throw new Error('Not implemented. Sign up is not supported in Asgardeo Next Client.');
  };

  const signOut = async (): Promise<void> => {
    await client.signOut();
  };

  const isSignedIn: boolean = true;

  return <AsgardeoContext.Provider value={{isSignedIn, signIn, signOut, signUp}}>{children}</AsgardeoContext.Provider>;
};

export default AsgardeoProvider;
