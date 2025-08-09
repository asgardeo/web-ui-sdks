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

import {SignJWT, jwtVerify, JWTPayload} from 'jose';
import {AsgardeoRuntimeError, CookieConfig} from '@asgardeo/node';

/**
 * Session token payload interface
 */
export interface SessionTokenPayload extends JWTPayload {
  /** User ID */
  sub: string;
  /** Session ID */
  sessionId: string;
  /** OAuth scopes */
  scopes: string;
  /** Organization ID if applicable */
  organizationId?: string;
  /** Issued at timestamp */
  iat: number;
  /** Expiration timestamp */
  exp: number;
  /** Access token */
  accessToken: string;
}

/**
 * Session management utility class for JWT-based session cookies
 */
class SessionManager {
  private static readonly DEFAULT_EXPIRY_SECONDS = 3600;

  /**
   * Get the signing secret from environment variable
   * Throws error in production if not set
   */
  private static getSecret(): Uint8Array {
    const secret = process.env['ASGARDEO_SECRET'];

    if (!secret) {
      if (process.env['NODE_ENV'] === 'production') {
        throw new AsgardeoRuntimeError(
          'ASGARDEO_SECRET environment variable is required in production',
          'session-secret-required',
          'nextjs',
          'Set the ASGARDEO_SECRET environment variable with a secure random string',
        );
      }
      // Use a default secret for development (not secure)
      console.warn('⚠️  Using default secret for development. Set ASGARDEO_SECRET for production!');
      return new TextEncoder().encode('development-secret-not-for-production');
    }

    return new TextEncoder().encode(secret);
  }

  /**
   * Create a temporary session cookie for login initiation
   */
  static async createTempSession(sessionId: string): Promise<string> {
    const secret = this.getSecret();

    const jwt = await new SignJWT({
      sessionId,
      type: 'temp',
    })
      .setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(secret);

    return jwt;
  }

  /**
   * Create a session cookie with user information
   */
  static async createSessionToken(
    accessToken: string,
    userId: string,
    sessionId: string,
    scopes: string,
    organizationId?: string,
    expirySeconds: number = this.DEFAULT_EXPIRY_SECONDS,
  ): Promise<string> {
    const secret = this.getSecret();

    const jwt = await new SignJWT({
      accessToken,
      sessionId,
      scopes,
      organizationId,
      type: 'session',
    } as Omit<SessionTokenPayload, 'sub' | 'iat' | 'exp'>)
      .setProtectedHeader({alg: 'HS256'})
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(Date.now() / 1000 + expirySeconds)
      .sign(secret);

    return jwt;
  }

  /**
   * Verify and decode a session token
   */
  static async verifySessionToken(token: string): Promise<SessionTokenPayload> {
    try {
      const secret = this.getSecret();
      const {payload} = await jwtVerify(token, secret);

      return payload as SessionTokenPayload;
    } catch (error) {
      throw new AsgardeoRuntimeError(
        `Invalid session token: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'invalid-session-token',
        'nextjs',
        'Session token verification failed',
      );
    }
  }

  /**
   * Verify and decode a temporary session token
   */
  static async verifyTempSession(token: string): Promise<{sessionId: string}> {
    try {
      const secret = this.getSecret();
      const {payload} = await jwtVerify(token, secret);

      if (payload['type'] !== 'temp') {
        throw new Error('Invalid token type');
      }

      return {sessionId: payload['sessionId'] as string};
    } catch (error) {
      throw new AsgardeoRuntimeError(
        `Invalid temporary session token: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'invalid-temp-session-token',
        'nextjs',
        'Temporary session token verification failed',
      );
    }
  }

  /**
   * Get session cookie options
   */
  static getSessionCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: this.DEFAULT_EXPIRY_SECONDS,
    };
  }

  /**
   * Get temporary session cookie options
   */
  static getTempSessionCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 15 * 60,
    };
  }

  /**
   * Get session cookie name
   */
  static getSessionCookieName(): string {
    return CookieConfig.SESSION_COOKIE_NAME;
  }

  /**
   * Get temporary session cookie name
   */
  static getTempSessionCookieName(): string {
    return CookieConfig.TEMP_SESSION_COOKIE_NAME;
  }
}

export default SessionManager;
