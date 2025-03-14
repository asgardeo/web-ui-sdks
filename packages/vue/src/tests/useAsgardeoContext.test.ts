import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { inject } from 'vue';
import { useAsgardeoContext } from '../composables/useAsgardeoContext';
import { ASGARDEO_INJECTION_KEY } from '../plugins/AsgardeoPlugin';

vi.mock('vue', () => ({
  inject: vi.fn()
}));

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
    (inject as Mock).mockReturnValue(mockAuthContext);
    
    const result = useAsgardeoContext();
    
    expect(inject).toHaveBeenCalledWith(ASGARDEO_INJECTION_KEY);
    expect(result).toBe(mockAuthContext);
  });

  it('should throw an error when the auth context is not injected', () => {
    (inject as Mock).mockReturnValue(null);
    
    expect(() => useAsgardeoContext()).toThrow(
      'This can be only used when vue plugin is installed'
    );
    expect(inject).toHaveBeenCalledWith(ASGARDEO_INJECTION_KEY);
  });
});
