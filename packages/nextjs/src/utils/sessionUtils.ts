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

import {NextRequest} from 'next/server';
import SessionManager, {SessionTokenPayload} from './SessionManager';
import {CookieConfig} from '@asgardeo/node';

/**
 * Checks if a request has a valid session cookie (JWT).
 * This verifies the JWT signature and expiration.
 *
 * @param request - The Next.js request object
 * @returns True if a valid session exists, false otherwise
 */
export const hasValidSession = async (request: NextRequest): Promise<boolean> => {
  try {
    const sessionToken = request.cookies.get(SessionManager.getSessionCookieName())?.value;
    if (!sessionToken) {
      return false;
    }

    await SessionManager.verifySessionToken(sessionToken);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets the session payload from the request cookies.
 * This includes user ID, session ID, and scopes.
 *
 * @param request - The Next.js request object
 * @returns The session payload if valid, undefined otherwise
 */
export const getSessionFromRequest = async (request: NextRequest): Promise<SessionTokenPayload | undefined> => {
  try {
    const sessionToken = request.cookies.get(SessionManager.getSessionCookieName())?.value;
    if (!sessionToken) {
      return undefined;
    }

    return await SessionManager.verifySessionToken(sessionToken);
  } catch {
    return undefined;
  }
};

/**
 * Gets the session ID from the request cookies (legacy support).
 * First tries to get from JWT session, then falls back to legacy session ID cookie.
 *
 * @param request - The Next.js request object
 * @returns The session ID if it exists, undefined otherwise
 */
export const getSessionIdFromRequest = async (request: NextRequest): Promise<string | undefined> => {
  try {
    // Try JWT session first
    const sessionPayload = await getSessionFromRequest(request);
    if (sessionPayload) {
      return sessionPayload.sessionId;
    }

    // Fall back to legacy session ID cookie for backward compatibility
    return request.cookies.get(CookieConfig.SESSION_COOKIE_NAME)?.value;
  } catch {
    // Fall back to legacy session ID cookie
    return request.cookies.get(CookieConfig.SESSION_COOKIE_NAME)?.value;
  }
};

/**
 * Gets the temporary session ID from request cookies.
 *
 * @param request - The Next.js request object
 * @returns The temporary session ID if valid, undefined otherwise
 */
export const getTempSessionFromRequest = async (request: NextRequest): Promise<string | undefined> => {
  try {
    const tempToken = request.cookies.get(SessionManager.getTempSessionCookieName())?.value;
    if (!tempToken) {
      return undefined;
    }

    const tempSession = await SessionManager.verifyTempSession(tempToken);
    return tempSession.sessionId;
  } catch {
    return undefined;
  }
};

/**
 * Legacy function for backward compatibility.
 * Checks if a request has a valid session ID in cookies.
 *
 * @deprecated Use hasValidSession instead for JWT-based sessions
 * @param request - The Next.js request object
 * @returns True if a session ID exists, false otherwise
 */
export const hasValidSessionLegacy = (request: NextRequest): boolean => {
  const sessionId = request.cookies.get(CookieConfig.SESSION_COOKIE_NAME)?.value;
  return Boolean(sessionId && sessionId.trim().length > 0);
};
