// src/tests/useAsgardeoContext.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create mock functions
const injectMock = vi.fn();
const INJECTION_KEY = 'asgardeo-key';

function useAsgardeoContextMock() {
  const ctx = injectMock(INJECTION_KEY);
  
  if (!ctx) {
    throw new Error('This can be only used when vue plugin is installed');
  }
  
  return ctx;
}

describe('useAsgardeoContext', () => {
  const mockAuthContext = {
    state: {
      isAuthenticated: true,
      isLoading: false
    },
    signIn: vi.fn(),
    signOut: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the injected auth context when it exists', () => {
    // Setup
    injectMock.mockReturnValue(mockAuthContext);
    
    // Act
    const result = useAsgardeoContextMock();
    
    // Assert
    expect(injectMock).toHaveBeenCalledWith(INJECTION_KEY);
    expect(result).toBe(mockAuthContext);
  });

  it('should throw an error when the auth context is not injected', () => {
    // Setup
    injectMock.mockReturnValue(null);
    
    // Act & Assert
    expect(() => useAsgardeoContextMock()).toThrow(
      'This can be only used when vue plugin is installed'
    );
    expect(injectMock).toHaveBeenCalledWith(INJECTION_KEY);
  });
});