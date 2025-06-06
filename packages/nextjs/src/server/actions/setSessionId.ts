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

import {CookieConfig, generateSessionId} from '@asgardeo/node';
import {RequestCookie} from 'next/dist/compiled/@edge-runtime/cookies';
import {ReadonlyRequestCookies} from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import {cookies} from 'next/headers';

const setSessionId = async (sessionId?: string): Promise<string> => {
  const cookieStore: ReadonlyRequestCookies = await cookies();

  const sessionCookie: RequestCookie | undefined = cookieStore.get(CookieConfig.SESSION_COOKIE_NAME);
  let sessionCookieValue: string | undefined = sessionId;

  if (!sessionCookieValue && sessionCookie) {
    sessionCookieValue = sessionCookie.value;
  } else if (sessionCookie) {
    sessionCookieValue = sessionCookie.value;
  } else {
    sessionCookieValue = generateSessionId();
  }

  cookieStore.set(CookieConfig.SESSION_COOKIE_NAME, sessionCookieValue as string, {
    httpOnly: CookieConfig?.DEFAULT_HTTP_ONLY,
    maxAge: CookieConfig?.DEFAULT_MAX_AGE,
    sameSite: CookieConfig?.DEFAULT_SAME_SITE,
    secure: CookieConfig?.DEFAULT_SECURE,
  });

  return Promise.resolve(sessionCookieValue);
};

export default setSessionId;
