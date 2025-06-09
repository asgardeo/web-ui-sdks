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

import {describe, it, expect, vi, beforeEach} from 'vitest';
import authorize, {AuthorizationRequest, AuthorizationResponse} from '../authorize';
import AsgardeoAPIError from '../../errors/AsgardeoAPIError';

describe('authorize', (): void => {
  beforeEach((): void => {
    vi.resetAllMocks();
  });

  it('should make POST request with form data by default', async (): void => {
    const mockAuthResponse: AuthorizationResponse = {
      code: 'auth-code-123',
      state: 'random-state-value',
      session_state: 'session-123',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAuthResponse),
    });

    const url: string = 'https://localhost:9443/oauth2/authorize/';
    const payload: AuthorizationRequest = {
      client_id: 'test-client-id',
      response_type: 'code',
      redirect_uri: 'https://your-app.com/callback',
      state: 'random-state-value',
      scope: 'openid profile email',
      response_mode: 'direct',
    };

    const result: AuthorizationResponse = await authorize({url, payload});

    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: 'client_id=test-client-id&response_type=code&redirect_uri=https%3A%2F%2Fyour-app.com%2Fcallback&state=random-state-value&scope=openid+profile+email&response_mode=direct',
    });

    expect(result).toEqual(mockAuthResponse);
  });

  it('should make GET request with URL parameters when method is GET', async (): void => {
    const mockAuthResponse: AuthorizationResponse = {
      code: 'auth-code-123',
      state: 'random-state-value',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAuthResponse),
    });

    const url: string = 'https://localhost:9443/oauth2/authorize/';
    const payload: AuthorizationRequest = {
      client_id: 'test-client-id',
      response_type: 'code',
      redirect_uri: 'https://your-app.com/callback',
      state: 'random-state-value',
      scope: 'openid profile email',
    };

    const result: AuthorizationResponse = await authorize({
      url,
      payload,
      method: 'GET',
    });

    const expectedUrl = 'https://localhost:9443/oauth2/authorize/?client_id=test-client-id&response_type=code&redirect_uri=https%3A%2F%2Fyour-app.com%2Fcallback&state=random-state-value&scope=openid+profile+email';

    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    expect(result).toEqual(mockAuthResponse);
  });

  it('should handle PKCE parameters correctly', async (): void => {
    const mockAuthResponse: AuthorizationResponse = {
      code: 'auth-code-123',
      state: 'random-state-value',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAuthResponse),
    });

    const url: string = 'https://localhost:9443/oauth2/authorize/';
    const payload: AuthorizationRequest = {
      client_id: 'test-client-id',
      response_type: 'code',
      redirect_uri: 'https://your-app.com/callback',
      state: 'random-state-value',
      scope: 'openid profile email',
      code_challenge: 'your-pkce-challenge',
      code_challenge_method: 'S256',
      nonce: 'test-nonce',
    };

    await authorize({url, payload});

    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: 'client_id=test-client-id&response_type=code&redirect_uri=https%3A%2F%2Fyour-app.com%2Fcallback&state=random-state-value&scope=openid+profile+email&code_challenge=your-pkce-challenge&code_challenge_method=S256&nonce=test-nonce',
    });
  });

  it('should filter out undefined and null values from payload', async (): void => {
    const mockAuthResponse: AuthorizationResponse = {
      code: 'auth-code-123',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAuthResponse),
    });

    const url: string = 'https://localhost:9443/oauth2/authorize/';
    const payload: AuthorizationRequest = {
      client_id: 'test-client-id',
      response_type: 'code',
      redirect_uri: undefined,
      state: null,
      scope: 'openid profile email',
      nonce: '', // Empty string should be included
    };

    await authorize({url, payload});

    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: 'client_id=test-client-id&response_type=code&scope=openid+profile+email&nonce=',
    });
  });

  it('should merge custom headers with default headers', async (): void => {
    const mockAuthResponse: AuthorizationResponse = {
      code: 'auth-code-123',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAuthResponse),
    });

    const url: string = 'https://localhost:9443/oauth2/authorize/';
    const payload: AuthorizationRequest = {
      client_id: 'test-client-id',
      response_type: 'code',
    };

    await authorize({
      url,
      payload,
      headers: {
        'Authorization': 'Bearer token',
        'Custom-Header': 'custom-value',
      },
    });

    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'Authorization': 'Bearer token',
        'Custom-Header': 'custom-value',
      },
      body: 'client_id=test-client-id&response_type=code',
    });
  });

  it('should handle authorization error response', async (): void => {
    const mockErrorResponse: AuthorizationResponse = {
      error: 'invalid_request',
      error_description: 'The request is missing a required parameter',
      state: 'random-state-value',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockErrorResponse),
    });

    const url: string = 'https://localhost:9443/oauth2/authorize/';
    const payload: AuthorizationRequest = {
      client_id: 'test-client-id',
      response_type: 'code',
    };

    const result: AuthorizationResponse = await authorize({url, payload});

    expect(result).toEqual(mockErrorResponse);
  });

  it('should throw AsgardeoAPIError on HTTP error response', async (): void => {
    const errorText: string = 'Unauthorized';

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve(errorText),
      status: 401,
      statusText: 'Unauthorized',
    });

    const url: string = 'https://localhost:9443/oauth2/authorize/';
    const payload: AuthorizationRequest = {
      client_id: 'test-client-id',
      response_type: 'code',
    };

    await expect(authorize({url, payload})).rejects.toThrow(AsgardeoAPIError);

    const error: AsgardeoAPIError = await authorize({url, payload}).catch(e => e);

    expect(error.message).toContain('Authorization request failed: Unauthorized');
    expect(error.code).toBe('authorize-ResponseError-001');
    expect(error.statusCode).toBe(401);
    expect(error.statusText).toBe('Unauthorized');
  });

  it('should throw AsgardeoAPIError for invalid URL', async (): void => {
    const invalidUrl: string = 'not-a-valid-url';
    const payload: AuthorizationRequest = {
      client_id: 'test-client-id',
      response_type: 'code',
    };

    await expect(authorize({url: invalidUrl, payload})).rejects.toThrow(AsgardeoAPIError);

    const error: AsgardeoAPIError = await authorize({url: invalidUrl, payload}).catch(e => e);

    expect(error.message).toBe(
      '🛡️ Asgardeo - @asgardeo/javascript: Invalid endpoint URL provided\n\n(code="authorize-ValidationError-001")\n',
    );
    expect(error.code).toBe('authorize-ValidationError-001');
    expect(error.statusCode).toBe(400);
    expect(error.statusText).toBe('Invalid Request');
  });

  it('should throw AsgardeoAPIError for empty string URL', async (): void => {
    const payload: AuthorizationRequest = {
      client_id: 'test-client-id',
      response_type: 'code',
    };

    await expect(authorize({url: '', payload})).rejects.toThrow(AsgardeoAPIError);

    const error: AsgardeoAPIError = await authorize({url: '', payload}).catch(e => e);

    expect(error.message).toBe(
      '🛡️ Asgardeo - @asgardeo/javascript: Invalid endpoint URL provided\n\n(code="authorize-ValidationError-001")\n',
    );
    expect(error.code).toBe('authorize-ValidationError-001');
  });

  it('should throw AsgardeoAPIError for missing payload', async (): void => {
    const url: string = 'https://localhost:9443/oauth2/authorize/';

    await expect(authorize({url, payload: undefined as any})).rejects.toThrow(AsgardeoAPIError);

    const error: AsgardeoAPIError = await authorize({url, payload: undefined as any}).catch(e => e);

    expect(error.message).toBe(
      '🛡️ Asgardeo - @asgardeo/javascript: Authorization payload is required\n\n(code="authorize-ValidationError-002")\n',
    );
    expect(error.code).toBe('authorize-ValidationError-002');
    expect(error.statusCode).toBe(400);
    expect(error.statusText).toBe('Invalid Request');
  });

  it('should throw AsgardeoAPIError for null payload', async (): void => {
    const url: string = 'https://localhost:9443/oauth2/authorize/';

    await expect(authorize({url, payload: null as any})).rejects.toThrow(AsgardeoAPIError);

    const error: AsgardeoAPIError = await authorize({url, payload: null as any}).catch(e => e);

    expect(error.message).toBe(
      '🛡️ Asgardeo - @asgardeo/javascript: Authorization payload is required\n\n(code="authorize-ValidationError-002")\n',
    );
    expect(error.code).toBe('authorize-ValidationError-002');
  });

  it('should handle numeric values in payload correctly', async (): void => {
    const mockAuthResponse: AuthorizationResponse = {
      code: 'auth-code-123',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAuthResponse),
    });

    const url: string = 'https://localhost:9443/oauth2/authorize/';
    const payload: AuthorizationRequest = {
      client_id: 'test-client-id',
      response_type: 'code',
      max_age: 3600, // Numeric value
    };

    await authorize({url, payload});

    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: 'client_id=test-client-id&response_type=code&max_age=3600',
    });
  });

  it('should handle additional custom parameters in payload', async (): void => {
    const mockAuthResponse: AuthorizationResponse = {
      code: 'auth-code-123',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAuthResponse),
    });

    const url: string = 'https://localhost:9443/oauth2/authorize/';
    const payload: AuthorizationRequest = {
      client_id: 'test-client-id',
      response_type: 'code',
      custom_param: 'custom-value',
      another_param: 'another-value',
    };

    await authorize({url, payload});

    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: 'client_id=test-client-id&response_type=code&custom_param=custom-value&another_param=another-value',
    });
  });
});
