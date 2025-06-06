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

import {
  AsgardeoAuthException,
  BasicUserInfo,
  IdTokenPayload,
  HttpClientInstance,
  HttpResponse,
  OIDCEndpoints,
} from '@asgardeo/auth-spa';
import {describe, it, expect, beforeEach, Mock, vi} from 'vitest';
import {useAsgardeo} from '../composables/useAsgardeo';
import {useAsgardeoContext} from '../composables/useAsgardeoContext';
import {AuthContextInterface} from '../types';

vi.mock('../composables/useAsgardeoContext', () => ({
  useAsgardeoContext: vi.fn(),
}));

describe('useAsgardeo', () => {
  const mockAuthContext: AuthContextInterface = {
    disableHttpHandler: vi.fn().mockResolvedValue(true),
    enableHttpHandler: vi.fn().mockResolvedValue(true),
    error: new AsgardeoAuthException('Some error', 'Error message', 'error'),
    getAccessToken: vi.fn().mockResolvedValue('token'),
    getBasicUserInfo: vi.fn().mockResolvedValue({} as BasicUserInfo),
    getDecodedIDToken: vi.fn().mockResolvedValue({} as IdTokenPayload),
    getHttpClient: vi.fn().mockResolvedValue({} as HttpClientInstance),
    getIDToken: vi.fn().mockResolvedValue('id_token'),
    getOIDCServiceEndpoints: vi.fn().mockResolvedValue({} as OIDCEndpoints),
    httpRequest: vi.fn().mockResolvedValue({} as HttpResponse<any>),
    httpRequestAll: vi.fn().mockResolvedValue([{} as HttpResponse<any>]),
    isAuthenticated: vi.fn().mockResolvedValue(true),
    on: vi.fn(),
    refreshAccessToken: vi.fn().mockResolvedValue({} as BasicUserInfo),
    requestCustomGrant: vi.fn(),
    revokeAccessToken: vi.fn().mockResolvedValue(true),
    signIn: vi.fn().mockResolvedValue({} as BasicUserInfo),
    signOut: vi.fn().mockResolvedValue(true),
    state: {
      allowedScopes: '',
      isAuthenticated: true,
      isLoading: false,
    },
    trySignInSilently: vi.fn().mockResolvedValue(true),
    updateConfig: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the auth context from useAsgardeoContext', () => {
    (useAsgardeoContext as Mock).mockReturnValue(mockAuthContext);

    const result: AuthContextInterface = useAsgardeo();

    expect(useAsgardeoContext).toHaveBeenCalled();
    expect(result).toBe(mockAuthContext);
  });

  it('should propagate errors from useAsgardeoContext', () => {
    const errorMessage: string = 'This can be only used when vue plugin is installed';
    (useAsgardeoContext as Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    expect(() => useAsgardeo()).toThrow(errorMessage);
    expect(useAsgardeoContext).toHaveBeenCalled();
  });
});
