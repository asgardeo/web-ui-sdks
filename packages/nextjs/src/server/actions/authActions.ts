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

import {redirect} from 'next/navigation';
import {cookies} from 'next/headers';
import {
  CookieConfig,
  generateSessionId,
  EmbeddedSignInFlowStatus,
  EmbeddedSignInFlowHandleRequestPayload,
  EmbeddedFlowExecuteRequestConfig,
  EmbeddedSignInFlowInitiateResponse,
} from '@asgardeo/node';
import AsgardeoNextClient from '../../AsgardeoNextClient';
import deleteSessionId from './deleteSessionId';

/**
 * Server action to get the current user.
 * Returns the user profile if signed in.
 */
export async function getUserAction() {
  try {
    const client = AsgardeoNextClient.getInstance();
    const user = await client.getUser();
    return {data: {user}, error: null};
  } catch (error) {
    return {data: {user: null}, error: 'Failed to get user'};
  }
}
