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

import {Inter} from 'next/font/google';
import SignIn from '../components/SignIn';
import {GetServerSideProps} from 'next';
import {Store, AsgardeoAuthClient, CryptoUtils, DataLayer} from '@asgardeo/auth-js';
import {SPACryptoUtils} from '@asgardeo/react';
import {
  AsgardeoUIException,
  AuthApiResponse,
  AuthClient,
  authorize,
  Branding,
  BrandingProps,
  getBranding,
  UIAuthClient,
  UIAuthConfig,
} from '@asgardeo/js';
import {MemoryCacheStore} from '@/stores/memory-cache';

const inter = Inter({subsets: ['latin']});

interface Repo {
  authRes: string;
  authResponse?: AuthApiResponse | undefined;
  brandingProps?: BrandingProps;
}

const config: UIAuthConfig = {
  signInRedirectURL: process.env.NEXT_PUBLIC_SIGN_IN_REDIRECT_URL || '',
  signOutRedirectURL: process.env.NEXT_PUBLIC_SIGN_OUT_REDIRECT_URL || '',
  clientID: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID || '',
  clientSecret: '*****',
  baseUrl: process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL || '',
  scope: ['openid', 'internal_login', 'profile'],
};

export const getServerSideProps: GetServerSideProps<{repo: Repo}> = async () => {
  const clientSecret = process.env.ASGARDEO_CLIENT_SECRET || '';

  const storeInstance: Store = new MemoryCacheStore();

  const spaUtils: CryptoUtils = new SPACryptoUtils();
  await AuthClient.getInstance(config, storeInstance, spaUtils);

  console.log('Server-side clientSecret:', clientSecret);

  let repo: Repo = {
    authRes: '',
  };

  // try {
  //   const brandingResponse = await getBranding({ branding: repo.brandingProps });
  //   repo.brandingProps = brandingResponse;
  // } catch (error) {
  //   console.error('Error fetching branding:', error);
  // }

  try {
    const authResponse = await authorize();
    repo.authResponse = authResponse;

    console.log('response');
    console.log(authResponse);
  } catch (error) {
    throw new AsgardeoUIException('REACT_UI-SIGN_IN-SI-SE01', 'Authorization failed');
  }

  return {
    props: {
      repo,
    },
  };
};

const Home: React.FC<{repo: Repo}> = ({repo}) => {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
      <SignIn authResponse={repo.authResponse} />
    </main>
  );
};

export default Home;
