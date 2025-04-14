import {
  defineEventHandler,
  sendRedirect,
  setCookie,
  deleteCookie,
  getQuery,
  getCookie,
  createError,
  H3Event,
} from "h3";
import { getAsgardeoSdkInstance } from "./services/asgardeo/index";
import { randomUUID } from "node:crypto";
import type { CookieSerializeOptions } from "cookie-es";
import type { BasicUserInfo } from "@asgardeo/auth-node";

export interface AsgardeoAuthHandlerOptions {
  basePath?: string;
  cookies?: {
    state?: string;
    sessionId?: string;
    defaultOptions?: CookieSerializeOptions;
    stateOptions?: CookieSerializeOptions;
    sessionIdOptions?: CookieSerializeOptions;
  };
  defaultCallbackUrl?: string;
}

function mergeCookieOptions(
  base: CookieSerializeOptions | undefined,
  specific: CookieSerializeOptions | undefined
): CookieSerializeOptions {
  const defaultBase = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax" as const,
  };
  return { ...defaultBase, ...base, ...specific };
}

export const AsgardeoAuthHandler = (
  options?: AsgardeoAuthHandlerOptions
) => {
  const basePath = options?.basePath ?? "/api/auth";
  const defaultCookieOptsFromUser = options?.cookies?.defaultOptions ?? {};

  const sessionIdCookieName =
    options?.cookies?.sessionId ?? "ASGARDEO_SESSION_ID";
  const sessionIdCookieOptions = mergeCookieOptions(
    {
      // Base defaults (already includes secure, httpOnly, path, sameSite)
      maxAge: 900000 / 1000, // Default session length (15 minutes)
    },
    { ...defaultCookieOptsFromUser, ...options?.cookies?.sessionIdOptions }
  );

  // --- Event Handler Definition ---
  return defineEventHandler(async (event: H3Event) => {
    const action = event.context.params?._;
    const method = event.node.req.method;

    // --- Get SDK Instance ---
    const authClient = getAsgardeoSdkInstance();
    if (!authClient) {
      console.error("Asgardeo SDK instance is not available.");
      throw createError({
        statusCode: 500,
        statusMessage: "Authentication SDK not configured.",
      });
    }

    // --- Sign-in Handler ---
    if (action === "signin" && method === "GET") {
      console.log(`Handling GET ${basePath}/signin`);

      try {
        const sessionId = randomUUID();
        console.log(`Generated Session ID: ${sessionId}`);

        setCookie(
          event,
          sessionIdCookieName,
          sessionId,
          sessionIdCookieOptions
        );
        console.log(
          `Set ${sessionIdCookieName} cookie with ID: ${sessionId}, Options:`,
          sessionIdCookieOptions
        );

        // The SDK's signIn method expects a callback to perform the redirect
        await authClient.signIn(
          (authorizationUrl) => {
            console.log(
              "Redirecting user to Asgardeo for sign-in:",
              authorizationUrl
            );
            // Don't return here, let sendRedirect finish
            sendRedirect(event, authorizationUrl, 302);
          },
          sessionId,
          // Pass optional query params if needed by SDK for specific flows
          getQuery(event).code?.toString(),
          getQuery(event).session_state?.toString(),
          getQuery(event).state?.toString()
        );

        // If sendRedirect was called in the callback, execution might not reach here,
        // but return just in case the callback logic changes.
        return;
      } catch (error: any) {
        console.error("Error initiating Asgardeo sign in:", error);
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to initiate sign in",
          data: error.message,
        });
      }

      // --- Callback Handler ---
    } else if (action === "callback" && method === "GET") {
      console.log(`Handling GET ${basePath}/callback`);

      const sessionId = getCookie(event, sessionIdCookieName);
      if (!sessionId) {
        console.error(`${sessionIdCookieName} cookie missing during callback.`);
        throw createError({
          statusCode: 400,
          statusMessage: "Authentication callback error: Session ID missing.",
        });
      }
      console.log(`Retrieved Session ID from cookie: ${sessionId}`);

      const query = getQuery(event);
      const authorizationCode = query.code?.toString();
      const sessionState = query.session_state?.toString() ?? "";
      const stateReceived = query.state?.toString() ?? ""; // State param handling might be needed if used during signIn

      if (!authorizationCode) {
        console.error("Authorization code missing in callback.");
        if (query.error) {
          console.error(
            `Asgardeo callback returned error: ${query.error} - ${query.error_description}`
          );
          throw createError({
            statusCode: 400,
            statusMessage: `Authentication failed: ${
              query.error_description || query.error
            }`,
          });
        }
        throw createError({
          statusCode: 400,
          statusMessage: "Authorization code missing in callback.",
        });
      }

      try {
        console.log(
          "Exchanging authorization code for tokens using Session ID:",
          sessionId
        );

        // Dummy callback, as signIn here should return tokens, not redirect.
        const dummyRedirectCallback = () => {
          console.warn(
            "signIn redirect callback executed during token exchange phase - this should not happen."
          );
        };

        const tokenResponse = await authClient.signIn(
          dummyRedirectCallback,
          sessionId,
          authorizationCode,
          sessionState,
          stateReceived
        );

        // Validate token response (adjust based on actual SDK response structure)
        if (
          !tokenResponse ||
          (!tokenResponse.accessToken && !tokenResponse.idToken)
        ) {
          console.error(
            "Token exchange failed or returned invalid response:",
            tokenResponse
          );
          throw createError({
            statusCode: 500,
            statusMessage:
              "Token exchange failed: Invalid response from Identity Provider.",
          });
        }

        console.log("Token exchange successful.");

        // TODO: Use the actual intended callback URL instead of hardcoding '/'
        // This could be stored in the state parameter during signIn or retrieved
        // from the session associated with sessionId if stored there earlier.
        const redirectUrl = options?.defaultCallbackUrl ?? "/";
        console.log(`Redirecting user to final destination: ${redirectUrl}`);
        await sendRedirect(event, redirectUrl, 302);
        return; // Important to return after sendRedirect
      } catch (error: any) {
        console.error("Token exchange error:", error);
        // Clear the potentially invalid session cookie on token exchange failure? Optional.
        // deleteCookie(event, sessionIdCookieName, sessionIdCookieOptions);
        throw createError({
          statusCode: 500,
          statusMessage: "Token exchange failed",
          data:
            error.message ||
            "An unexpected error occurred during token exchange",
        });
      }

      // --- Sign-out Handler ---
    } else if (action === "user" && method === "GET") {
      // Assumes 'action' is set to 'user' for requests to e.g., /api/auth/user
      console.log(`Handling GET ${basePath}/user`);

      // 1. Retrieve the Session ID from the cookie
      const sessionId = getCookie(event, sessionIdCookieName);
      console.log(
        `User endpoint: Attempting to read cookie '${sessionIdCookieName}'. Found: ${
          sessionId ? "Yes" : "No"
        }`
      );

      // 2. Validate if the Session ID exists
      if (!sessionId) {
        console.log(
          "User endpoint: No session cookie found. User is likely not logged in."
        );
        // If no session ID, the user is not authenticated
        throw createError({
          statusCode: 401, // Unauthorized
          statusMessage: "Unauthorized: No active session found.",
        });
      }

      try {
        // 3. Fetch basic user information using the Session ID
        console.log(
          `User endpoint: Fetching basic user info for session ID: ${sessionId}`
        );

        // Use the instance of your auth class - ensure authClient is available here
        // This call uses the session ID to retrieve the corresponding user data from Asgardeo/SDK cache
        const basicUserInfo: BasicUserInfo = await authClient.getBasicUserInfo(
          sessionId
        );

        console.log(
          "User endpoint: Successfully fetched user info for session:",
          sessionId
        );

        // 4. Return the fetched information
        return basicUserInfo;
      } catch (error: any) {
        console.error(
          `User endpoint: Error fetching user info for session ${sessionId}:`,
          error
        );

        // Refine error handling based on specific errors thrown by getBasicUserInfo
        // Example: Check if the error indicates the session is no longer valid
        if (
          error.message?.includes("invalid_session") ||
          error.statusCode === 401
        ) {
          throw createError({
            statusCode: 401, 
            statusMessage: "Invalid or expired session. Please sign in again.",
          });
        } else {
          // Generic server error for issues
          throw createError({
            statusCode: 500,
            statusMessage: "Failed to retrieve user information.",
          });
        }
      }
    } else if (action === "signout" && method === "GET") {
      console.log(`Handling GET ${basePath}/signout`);

      const sessionId = getCookie(event, sessionIdCookieName);

      if (!sessionId) {
        console.log(
          `SignOut: No ${sessionIdCookieName} cookie found. User likely already logged out.`
        );
        return sendRedirect(event, "/", 302);
      }

      console.log(
        `SignOut: Found Session ID: ${sessionId}. Initiating logout.`
      );

      try {
        // 1. Delete the session cookie first
        deleteCookie(event, sessionIdCookieName, sessionIdCookieOptions);
        console.log(`SignOut: Deleted ${sessionIdCookieName} cookie.`);

        // 2. Call the SDK signOut method, which returns a URL
        const signOutURL = await authClient.signOut(sessionId);

        if (!signOutURL) {
          console.error("SignOut Error: SDK did not return a sign-out URL.");
          return sendRedirect(event, "/?error=logout_url_missing", 302);
        }

        console.log(
          `SignOut: Redirecting user to Asgardeo logout URL: ${signOutURL}`
        );
        return sendRedirect(event, signOutURL, 302);
      } catch (error: any) {
        console.error("SignOut Error:", error);
        deleteCookie(event, sessionIdCookieName, sessionIdCookieOptions);
        throw createError({
          statusCode: 500,
          statusMessage: "Sign out failed.",
          data: error.message || "An unexpected error occurred during sign out",
        });
      }

      // --- Default Handler for Unknown Actions ---
    } else {
      console.warn(
        `Auth action "${action}" with method "${method}" not found or not supported.`
      );
      throw createError({
        statusCode: 404,
        statusMessage: `Authentication endpoint not found or method not allowed for action: ${action}`,
      });
    }
  });
};
