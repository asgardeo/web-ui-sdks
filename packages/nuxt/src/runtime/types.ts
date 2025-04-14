export interface ModuleOptions {
  /**
   * Asgardeo Application Client ID.
   * @default process.env.ASGARDEO_CLIENT_ID
   */
  clientID: string;

  /**
   * Asgardeo Application Client Secret. (Server-side only)
   * @default process.env.ASGARDEO_CLIENT_SECRET
   */
  clientSecret?: string;

  /**
   * The base URL of your Asgardeo organization tenant.
   * e.g., https://api.asgardeo.io/t/your_org_name
   * @default process.env.ASGARDEO_BASE_URL
   */
  baseUrl: string;

  /**
   * The absolute redirect URI where Asgardeo should redirect after sign-in.
   * Must match the URI configured in your Asgardeo app.
   * @default process.env.ASGARDEO_SIGN_IN_REDIRECT_URL
   */
  signInRedirectURL: string;

  /**
   * The absolute URI to redirect to after sign-out completes.
   * @default process.env.ASGARDEO_SIGN_OUT_REDIRECT_URL
   */
  signOutRedirectURL: string;

  /**
   * Authentication scopes to request from Asgardeo.
   * @default ['openid', 'profile']
   */
  scope?: string[];
}

export type SessionLastRefreshedAt = Date | undefined;
export type SessionStatus = "authenticated" | "unauthenticated" | "loading";
