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
import {CookieConfig, generateSessionId, EmbeddedSignInFlowStatus} from '@asgardeo/node';
import AsgardeoNextClient from '../../AsgardeoNextClient';
import deleteSessionId from './deleteSessionId';

/**
 * Handles POST sign-in requests for embedded sign-in flow.
 *
 * @param req - The Next.js request object
 * @returns NextResponse with sign-in result or redirect
 */
export async function handlePostSignIn(req: NextRequest): Promise<NextResponse> {
  try {
    const client = AsgardeoNextClient.getInstance();

    // Get session ID from cookies directly since we're in middleware context
    let userId: string | undefined = req.cookies.get(CookieConfig.SESSION_COOKIE_NAME)?.value;

    // Generate session ID if not present
    if (!userId) {
      userId = generateSessionId();
    }

    const signInUrl: URL = new URL(await client.getSignInUrlWithConfig({response_mode: 'direct'}, userId));
    const {pathname: urlPathname, origin, searchParams: urlSearchParams} = signInUrl;

    console.log('[AsgardeoNextClient] Sign-in URL:', signInUrl.toString());
    console.log('[AsgardeoNextClient] Search Params:', Object.fromEntries(urlSearchParams.entries()));

    const body = await req.json();
    console.log('[AsgardeoNextClient] Sign-in request:', body);

    const {payload, request} = body;

    const response: any = await client.signIn(
      payload,
      {
        url: request?.url ?? `${origin}${urlPathname}`,
        payload: request?.payload ?? Object.fromEntries(urlSearchParams.entries()),
      },
      userId,
    );

    // Clean the response to remove any non-serializable properties
    const cleanResponse = response ? JSON.parse(JSON.stringify(response)) : {success: true};

    // Create response with session cookie
    const nextResponse = NextResponse.json(cleanResponse);

    // Set session cookie if it was generated
    if (!req.cookies.get(CookieConfig.SESSION_COOKIE_NAME)) {
      nextResponse.cookies.set(CookieConfig.SESSION_COOKIE_NAME, userId, {
        httpOnly: CookieConfig.DEFAULT_HTTP_ONLY,
        maxAge: CookieConfig.DEFAULT_MAX_AGE,
        sameSite: CookieConfig.DEFAULT_SAME_SITE,
        secure: CookieConfig.DEFAULT_SECURE,
      });
    }

    if (response.flowStatus === EmbeddedSignInFlowStatus.SuccessCompleted) {
      const res = await client.signIn(
        {
          code: response?.authData?.code,
          session_state: response?.authData?.session_state,
          state: response?.authData?.state,
        } as any,
        {},
        userId,
        (afterSignInUrl: string) => null,
      );

      const afterSignInUrl: string = await (await client.getStorageManager()).getConfigDataParameter('afterSignInUrl');

      return NextResponse.redirect(afterSignInUrl, 303);
    }

    return nextResponse;
  } catch (error) {
    console.error('[AsgardeoNextClient] Failed to initialize embedded sign-in flow:', error);
    return NextResponse.json({error: 'Failed to initialize sign-in flow'}, {status: 500});
  }
}

export default handlePostSignIn;
