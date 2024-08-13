/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import React, {ReactNode, useEffect, useState} from 'react';
import {AsgardeoProvider as AsgardeoAuthProvider, UIAuthConfig} from '@asgardeo/react';

interface AsgardeoNextProviderProps {
  children: ReactNode;
  clientSecret: string;
}

const AsgardeoNextProvider: React.FC<AsgardeoNextProviderProps> = ({children, clientSecret}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const AuthConfig: UIAuthConfig = {
    signInRedirectURL: process.env.NEXT_PUBLIC_SIGN_IN_REDIRECT_URL || '',
    signOutRedirectURL: process.env.NEXT_PUBLIC_SIGN_OUT_REDIRECT_URL || '',
    clientID: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID || '',
    clientSecret: '*****',
    baseUrl: process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL || '',
    scope: ['openid', 'internal_login', 'profile'],
  };

  return <AsgardeoAuthProvider config={AuthConfig}>{children}</AsgardeoAuthProvider>;
};

export default AsgardeoNextProvider;
