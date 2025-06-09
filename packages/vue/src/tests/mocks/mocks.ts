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

import {AsgardeoSPAClient, BasicUserInfo} from '@asgardeo/auth-spa';
import {Mock, vi} from 'vitest';
import {AuthContextInterface, AuthStateInterface, AuthVueConfig} from '../../types';

export const mockAuthContext: Partial<AuthContextInterface> = {
  signIn: vi.fn(),
  signOut: vi.fn(),
  state: {
    allowedScopes: 'openid profile email',
    displayName: 'John Doe',
    isAuthenticated: true,
    isLoading: false,
  },
};

export const mockState: AuthStateInterface = {
  allowedScopes: '',
  displayName: '',
  email: '',
  isAuthenticated: false,
  isLoading: true,
  sub: '',
  username: '',
};

export type MockAuthAPI = {
  disableHttpHandler: Mock;
  enableHttpHandler: Mock;
  getAccessToken: Mock;
  getBasicUserInfo: Mock;
  getDecodedIDToken: Mock;
  getHttpClient: Mock;
  getIDToken: Mock;
  getOIDCServiceEndpoints: Mock;
  getState: Mock;
  httpRequest: Mock;
  httpRequestAll: Mock;
  init: Mock;
  isAuthenticated: Mock;
  isSessionActive: Mock;
  on: Mock;
  refreshAccessToken: Mock;
  requestCustomGrant: Mock;
  revokeAccessToken: Mock;
  signIn: Mock;
  signOut: Mock;
  trySignInSilently: Mock;
  updateConfig: Mock;
  updateState: Mock;
};

export const mockAuthAPI: MockAuthAPI = {
  disableHttpHandler: vi.fn().mockResolvedValue(true),
  enableHttpHandler: vi.fn().mockResolvedValue(true),
  getAccessToken: vi.fn().mockResolvedValue('mock-access-token'),
  getBasicUserInfo: vi.fn().mockResolvedValue({
    allowedScopes: 'openid profile',
    displayName: 'Test User',
    email: 'test@example.com',
    sub: 'user-id-123',
    username: 'testUser',
  }),
  getDecodedIDToken: vi.fn().mockResolvedValue({aud: 'client-id', iss: 'https://test.com', sub: 'user-id-123'}),
  getHttpClient: vi.fn().mockResolvedValue({}),
  getIDToken: vi.fn().mockResolvedValue('mock-id-token'),
  getOIDCServiceEndpoints: vi.fn().mockResolvedValue({}),
  getState: vi.fn().mockReturnValue(mockState),
  httpRequest: vi.fn().mockResolvedValue({data: {}, status: 200}),
  httpRequestAll: vi.fn().mockResolvedValue([{data: {}, status: 200}]),
  init: vi.fn().mockResolvedValue(true),
  isAuthenticated: vi.fn().mockResolvedValue(true),
  isSessionActive: vi.fn().mockResolvedValue(true),
  on: vi.fn(),
  refreshAccessToken: vi.fn().mockResolvedValue({
    displayName: 'Test User',
    email: 'test@example.com',
    username: 'testUser',
  }),
  requestCustomGrant: vi.fn().mockResolvedValue({
    displayName: 'Test User',
    email: 'test@example.com',
    username: 'testUser',
  } as BasicUserInfo),
  revokeAccessToken: vi.fn().mockResolvedValue(true),
  signIn: vi.fn().mockResolvedValue({
    allowedScopes: 'openid profile',
    displayName: 'Test User',
    email: 'test@example.com',
    sub: 'user-id-123',
    username: 'testUser',
  }),
  signOut: vi.fn().mockResolvedValue(true),
  trySignInSilently: vi.fn().mockResolvedValue(false),
  updateConfig: vi.fn().mockResolvedValue(undefined),
  updateState: vi.fn().mockImplementation((newState: AuthStateInterface) => {
    Object.assign(mockState, newState);
  }),
};

export const mockAsgardeoSPAClient: Partial<AsgardeoSPAClient> = {
  disableHttpHandler: vi.fn().mockResolvedValue(true),
  enableHttpHandler: vi.fn().mockResolvedValue(true),
  getAccessToken: vi.fn().mockResolvedValue('mock-access-token'),
  getBasicUserInfo: vi.fn().mockResolvedValue({
    allowedScopes: 'openid profile',
    displayName: 'Test User',
    email: 'test@example.com',
    sub: 'user-id-123',
    username: 'testUser',
  }),
  getDecodedIDToken: vi.fn().mockResolvedValue({sub: 'user-id-123'}),
  getHttpClient: vi.fn().mockResolvedValue({}),
  getIDPAccessToken: vi.fn().mockResolvedValue('mock-idp-access-token'),
  getIDToken: vi.fn().mockResolvedValue('mock-id-token'),
  getOIDCServiceEndpoints: vi.fn().mockResolvedValue({}),
  httpRequest: vi.fn().mockResolvedValue({data: {}, status: 200}),
  httpRequestAll: vi.fn().mockResolvedValue([{data: {}, status: 200}]),
  initialize: vi.fn().mockResolvedValue(true),
  isAuthenticated: vi.fn().mockResolvedValue(true),
  isSessionActive: vi.fn().mockResolvedValue(true),
  on: vi.fn().mockResolvedValue(undefined),
  refreshAccessToken: vi.fn().mockResolvedValue({
    displayName: 'Test User',
    email: 'test@example.com',
    username: 'testUser',
  }),
  requestCustomGrant: vi.fn().mockResolvedValue({
    displayName: 'Test User',
    email: 'test@example.com',
    username: 'testUser',
  }),
  revokeAccessToken: vi.fn().mockResolvedValue(true),
  signIn: vi.fn().mockResolvedValue({
    allowedScopes: 'openid profile',
    displayName: 'Test User',
    email: 'test@example.com',
    sub: 'user-id-123',
    username: 'testUser',
  }),
  signOut: vi.fn().mockResolvedValue(true),
  trySignInSilently: vi.fn().mockResolvedValue({
    allowedScopes: 'openid profile',
    displayName: 'Test User',
    email: 'test@example.com',
    sub: 'user-id-123',
    username: 'testUser',
  }),
  updateConfig: vi.fn().mockResolvedValue(undefined),
};

export class MockAsgardeoAuthException extends Error {
  public code: string | undefined;

  public override name: string;

  public override message: string;

  constructor(code: string, name: string, message: string) {
    super(message);
    this.code = code;
    this.name = name;
    this.message = message;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const asgardeoAuthSPAMock: any = {
  AsgardeoAuthException: MockAsgardeoAuthException,
  AsgardeoSPAClient: {
    getInstance: vi.fn().mockReturnValue(mockAsgardeoSPAClient),
  },
  Hooks: {
    CustomGrant: 'custom-grant',
    HttpRequest: 'http-request',
    HttpRequestError: 'http-request-error',
    HttpRequestFinish: 'http-request-finish',
    Initialize: 'initialize',
    SignIn: 'sign-in',
    SignOut: 'sign-out',
  },
};

export const mockConfig: AuthVueConfig = {
  baseUrl: 'https://api.asgardeo.io/t/mock-tenant',
  clientId: 'mock-client-id',
  afterSignInUrl: 'http://localhost:5173/',
  afterSignOutUrl: 'http://localhost:5173/',
};
