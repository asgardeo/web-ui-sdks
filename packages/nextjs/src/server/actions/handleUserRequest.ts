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

import {NextRequest, NextResponse} from 'next/server';
import {User} from '@asgardeo/node';
import AsgardeoNextClient from '../../AsgardeoNextClient';

/**
 * Handles user profile requests.
 *
 * @param req - The Next.js request object
 * @returns NextResponse with user profile data
 */
export async function handleUserRequest(req: NextRequest): Promise<NextResponse> {
  try {
    const client = AsgardeoNextClient.getInstance();
    const user: User = await client.getUser();

    console.log('[AsgardeoNextClient] User fetched successfully:', user);

    return NextResponse.json({user});
  } catch (error) {
    console.error('[AsgardeoNextClient] Failed to get user:', error);
    return NextResponse.json({error: 'Failed to get user'}, {status: 500});
  }
}

export default handleUserRequest;
