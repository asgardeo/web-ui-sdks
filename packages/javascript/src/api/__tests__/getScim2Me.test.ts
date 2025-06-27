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

import {describe, it, expect, vi} from 'vitest';
import getScim2Me from '../getScim2Me';
import AsgardeoAPIError from '../../../errors/AsgardeoAPIError';

// Mock user data
const mockUser = {
  id: '123',
  username: 'testuser',
  email: 'test@example.com',
  givenName: 'Test',
  familyName: 'User',
};

describe('getScim2Me', () => {
  it('should fetch user profile successfully with default fetch', async () => {
    // Mock fetch
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(mockUser),
      text: () => Promise.resolve(JSON.stringify(mockUser)),
    });

    // Replace global fetch
    global.fetch = mockFetch;

    const result = await getScim2Me({
      url: 'https://api.asgardeo.io/t/test/scim2/Me',
    });

    expect(result).toEqual(mockUser);
    expect(mockFetch).toHaveBeenCalledWith('https://api.asgardeo.io/t/test/scim2/Me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/scim+json',
        Accept: 'application/json',
      },
    });
  });

  it('should use custom fetcher when provided', async () => {
    const customFetcher = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(mockUser),
      text: () => Promise.resolve(JSON.stringify(mockUser)),
    });

    const result = await getScim2Me({
      url: 'https://api.asgardeo.io/t/test/scim2/Me',
      fetcher: customFetcher,
    });

    expect(result).toEqual(mockUser);
    expect(customFetcher).toHaveBeenCalledWith('https://api.asgardeo.io/t/test/scim2/Me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/scim+json',
        Accept: 'application/json',
      },
    });
  });

  it('should throw AsgardeoAPIError for invalid URL', async () => {
    await expect(
      getScim2Me({
        url: 'invalid-url',
      }),
    ).rejects.toThrow(AsgardeoAPIError);
  });

  it('should throw AsgardeoAPIError for failed response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: () => Promise.resolve('User not found'),
    });

    global.fetch = mockFetch;

    await expect(
      getScim2Me({
        url: 'https://api.asgardeo.io/t/test/scim2/Me',
      }),
    ).rejects.toThrow(AsgardeoAPIError);
  });

  it('should handle network errors', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));

    global.fetch = mockFetch;

    await expect(
      getScim2Me({
        url: 'https://api.asgardeo.io/t/test/scim2/Me',
      }),
    ).rejects.toThrow(AsgardeoAPIError);
  });
});
