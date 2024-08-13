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

import {useAuthentication} from '@asgardeo/react';
import axios from 'axios';

export const useAuth = () => {
  const {isAuthenticated, user, signOut} = useAuthentication();

  // const login = async () => {
  //   try {
  //     await signIn();
  //   } catch (error) {
  //     console.error('Sign-in failed', error);
  //   }
  // };

  const exchangeCodeForToken = async (code: any) => {
    try {
      const response = await axios.post('/api/auth', {
        client_id: 'YOUR_CLIENT_ID',
        client_secret: process.env.ASGARDEO_CLIENT_SECRET, // Load this from environment variables
        redirect_uri: 'http://localhost:3000',
        code,
      });

      return response.data;
    } catch (error) {
      console.error('Token exchange failed', error);
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign-out failed', error);
    }
  };

  return {
    isAuthenticated: isAuthenticated,
    // login,
    exchangeCodeForToken,
    logout,
    user: user,
  };
};
