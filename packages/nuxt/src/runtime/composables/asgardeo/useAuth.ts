import { navigateTo } from '#imports';
import type { BasicUserInfo } from '@asgardeo/auth-node';
import { ref, readonly } from 'vue';

export const useAuth = () => {
  // State for user information
  const user = ref<BasicUserInfo | null>(null);
  // State for authentication status
  const isAuthenticated = ref<boolean>(false);
  // Loading state to track when auth operations are in progress
  const isLoading = ref<boolean>(false);

  /** 
   * Initiates the Asgardeo sign-in flow by redirecting the user
   * to the server-side sign-in handler.
   * @param { string } [callbackUrl] - Optional URL to redirect to after successful login. Defaults to current page.
   */
  const signIn = async (callbackUrl?: string) => {
    const targetUrl = '/api/auth/signin'; 
    const options = {} as any;
    const redirectParam = callbackUrl || (typeof window !== 'undefined' ? window.location.pathname : '/');
    options.query = { callbackUrl: redirectParam };
    options.external = true; // Required for navigating away to Asgardeo
    
    console.log(`Redirecting to ${targetUrl} with callback ${redirectParam} to initiate Asgardeo login...`);
    await navigateTo(targetUrl, options);
  };

  /**
   * Initiates the sign-out flow by navigating to the server-side
   * sign-out handler. The server handler is responsible for clearing
   * the local session and redirecting the user to the Asgardeo
   * logout endpoint.
   */
  const signOut = async () => {
    const targetUrl = '/api/auth/signout'; 
    const options = { external: true };
    
    // Update state
    user.value = null;
    isAuthenticated.value = false;
    
    console.log(`Navigating to ${targetUrl} to initiate sign-out process...`);
    await navigateTo(targetUrl, options);
  };

  /**
   * Fetches basic information about the currently logged-in user
   * from the server-side '/api/auth/user' endpoint.
   * Updates the internal state variables with the result.
   * 
   * @returns {Promise<BasicUserInfo | null>} A promise resolving to user info or null.
   */
  const getUserInfo = async (): Promise<BasicUserInfo | null> => {
    const targetUrl = '/api/auth/user';
    console.log(`Attempting to fetch user info from ${targetUrl}`);
    
    isLoading.value = true;
    
    try {
      const userInfo = await $fetch<BasicUserInfo>(targetUrl, {
        method: 'GET',
      });
      
      console.log("User info fetched successfully:", userInfo);
      
      // Update state
      user.value = userInfo;
      isAuthenticated.value = true;
      
      return userInfo;
    } catch (error: any) {
      console.error(`Failed to fetch user info from ${targetUrl}:`, error.data || error.message || error);
      
      // Update state to reflect unauthenticated status
      user.value = null;
      isAuthenticated.value = false;
      
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Function to check authentication status on page load
  const checkAuth = async () => {
    isLoading.value = true;
    const result = await getUserInfo();
    isLoading.value = false;
    return result !== null;
  };

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    
    signIn,
    signOut,
    getUserInfo,
    checkAuth,
  };
};