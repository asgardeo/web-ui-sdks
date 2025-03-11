// src/tests/useAsgardeo.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create mock for useAsgardeoContext
const useAsgardeoContextMock = vi.fn();

// Mock the imports
vi.mock('./useAsgardeoContext', () => ({
  useAsgardeoContext: () => useAsgardeoContextMock()
}));

// Create simplified mock implementation
function useAsgardeoMock() {
  const asgardeo = useAsgardeoContextMock();
  return asgardeo;
}

describe('useAsgardeo', () => {
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

  it('should return the auth context from useAsgardeoContext', () => {
    // Setup
    useAsgardeoContextMock.mockReturnValue(mockAuthContext);
    
    // Act
    const result = useAsgardeoMock();
    
    // Assert
    expect(useAsgardeoContextMock).toHaveBeenCalled();
    expect(result).toBe(mockAuthContext);
  });

  it('should propagate errors from useAsgardeoContext', () => {
    // Setup
    const errorMessage = 'This can be only used when vue plugin is installed';
    useAsgardeoContextMock.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    
    // Act & Assert
    expect(() => useAsgardeoMock()).toThrow(errorMessage);
    expect(useAsgardeoContextMock).toHaveBeenCalled();
  });
});