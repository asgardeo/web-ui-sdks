import { AuthSPAClientConfig } from "@asgardeo/auth-spa";

export interface VueConfig {
    /**
     * The SDK's `AuthProvider` by default listens to route changes
     * to detect `code` & `session_state` parameters and perform a token exchange.
     * This option allows disabling that behavior.
     */
    skipRedirectCallback?: boolean;
    
    /**
     * The SDK attempts to check for an active session on the server and update
     * session state automatically. This option allows disabling that behavior.
     */
    disableTrySignInSilently?: boolean;
  
    /**
     * Prevents the SDK from automatically signing in the user if an active session exists.
     */
    disableAutoSignIn?: boolean;
  
    /**
     * Determines if the SDK should inject the authentication state into Vue's reactive state.
     * This can be useful for integrating with Vuex or Pinia state management.
     */
    enableReactiveAuthState?: boolean;
  
    /**
     * If enabled, the SDK will register global authentication-related components (if any) for Vue.
     */
    registerGlobalComponents?: boolean;
  }
  
  export type AuthVueConfig = AuthSPAClientConfig & VueConfig;
  