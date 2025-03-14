// src/tests/useAsgardeo.test.ts
import { describe, it, expect, beforeEach, Mock} from 'vitest';
import { vi } from 'vitest';
import { useAsgardeo } from '../composables/useAsgardeo';
import { useAsgardeoContext } from '../composables/useAsgardeoContext';
import { AuthContextInterface } from '../types';
import { AsgardeoAuthException, BasicUserInfo, DecodedIDTokenPayload, HttpClientInstance, HttpResponse, OIDCEndpoints } from '@asgardeo/auth-spa';

// Mock `useAsgardeoContext`
vi.mock('../composables/useAsgardeoContext', () => ({
  useAsgardeoContext: vi.fn()
}));

describe('useAsgardeo', () => {
  const mockAuthContext: AuthContextInterface = {
    state: {
      isAuthenticated: true,
      isLoading: false,
      allowedScopes: ''
    },
    signIn: vi.fn().mockResolvedValue({} as BasicUserInfo),
    signOut: vi.fn().mockResolvedValue(true),
    disableHttpHandler: vi.fn().mockResolvedValue(true),
    enableHttpHandler: vi.fn().mockResolvedValue(true),
    error: new AsgardeoAuthException('Some error', 'Error message', 'error'), // instantiate AsgardeoAuthException
    getAccessToken: vi.fn().mockResolvedValue('token'),
    getBasicUserInfo: vi.fn().mockResolvedValue({} as BasicUserInfo),
    getDecodedIDToken: vi.fn().mockResolvedValue({} as DecodedIDTokenPayload),
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
    trySignInSilently: vi.fn().mockResolvedValue(true),
    updateConfig: vi.fn().mockResolvedValue(undefined)
  };


  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the auth context from useAsgardeoContext', () => {
    // Setup
    (useAsgardeoContext as Mock).mockReturnValue(mockAuthContext);
    
    // Act
    const result = useAsgardeo();
    
    // Assert
    expect(useAsgardeoContext).toHaveBeenCalled();
    expect(result).toBe(mockAuthContext);
  });

  it('should propagate errors from useAsgardeoContext', () => {
    // Setup
    const errorMessage = 'This can be only used when vue plugin is installed';
    (useAsgardeoContext as Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });
    
    // Act & Assert
    expect(() => useAsgardeo()).toThrow(errorMessage);
    expect(useAsgardeoContext).toHaveBeenCalled();
  });
});
