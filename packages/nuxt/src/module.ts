import {
  defineNuxtModule,
  addImports,
  createResolver,
  useLogger,
  addServerImports,
} from "@nuxt/kit";
import { defu } from "defu";
import type { ModuleOptions } from "./runtime/types";
import type { NuxtModule } from "nuxt/schema";

const PACKAGE_NAME = "@asgardeo/nuxt";

const defaultBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NUXT_PUBLIC_SITE_URL || "https://your-production-domain.com"
    : "http://localhost:3000";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: PACKAGE_NAME,
    configKey: "asgardeoAuth",
  },
  defaults: {
    clientID: process.env.ASGARDEO_CLIENT_ID || "",
    clientSecret: process.env.ASGARDEO_CLIENT_SECRET || "",
    baseUrl: process.env.ASGARDEO_BASE_URL || "",
    signInRedirectURL:
      process.env.ASGARDEO_SIGN_IN_REDIRECT_URL ||
      `${defaultBaseUrl}/api/auth/callback`,
    signOutRedirectURL:
      process.env.ASGARDEO_SIGN_OUT_REDIRECT_URL || defaultBaseUrl,
    scope: ["openid", "profile"],
  },
  setup(userOptions, nuxt) {
    const logger = useLogger(PACKAGE_NAME);
    logger.info(`Setting up ${PACKAGE_NAME}...`);

    // 1. Resolve options - Merge user options, nuxt.config, defaults
    const options = defu(
      userOptions,
      nuxt.options.runtimeConfig.asgardeoAuth, // User settings in nuxt.config (server)
      nuxt.options.runtimeConfig.public.asgardeoAuth, // User settings in nuxt.config (public)
      {
        clientID: process.env.ASGARDEO_CLIENT_ID,
        clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
        serverOrigin: process.env.ASGARDEO_BASE_URL,
        signInRedirectURL:
          process.env.ASGARDEO_SIGN_IN_REDIRECT_URL ||
          `${defaultBaseUrl}/api/auth/callback`,
        signOutRedirectURL:
          process.env.ASGARDEO_SIGN_OUT_REDIRECT_URL || defaultBaseUrl,
        scope: ["openid", "profile"],
        enablePKCE: true,
      }
    ) as ModuleOptions;

    // Basic validation
    if (!options.clientID || !options.baseUrl) {
      logger.warn(
        `${PACKAGE_NAME}: clientID and serverOrigin (ASGARDEO_BASE_URL) are required.`
      );
    }
    if (process.env.NODE_ENV !== "development" && !options.clientSecret) {
      logger.warn(
        `${PACKAGE_NAME}: clientSecret (ASGARDEO_CLIENT_SECRET) is recommended for production.`
      );
      // Depending on your SDK flow (e.g., PKCE only), secret might be optional. Adjust warning if needed.
    }
    if (!options.signInRedirectURL.startsWith("http")) {
      logger.warn(
        `${PACKAGE_NAME}: signInRedirectURL should be an absolute URL (e.g., http://localhost:3000/api/auth/callback). Current value: ${options.signInRedirectURL}`
      );
    }
    if (!options.signOutRedirectURL.startsWith("http")) {
      logger.warn(
        `${PACKAGE_NAME}: signOutRedirectURL should be an absolute URL (e.g., http://localhost:3000). Current value: ${options.signOutRedirectURL}`
      );
    }

    // 2. Add runtime config
    // Public - accessible client-side (only add non-sensitive values)
    nuxt.options.runtimeConfig.public.asgardeoAuth = defu(
      nuxt.options.runtimeConfig.public.asgardeoAuth,
      {
        clientID: options.clientID,
        // You generally DON'T need redirect URLs client-side, but if needed:
        // signInRedirectURL: options.signInRedirectURL,
        // signOutRedirectURL: options.signOutRedirectURL,
      }
    );
    // Private - server-side only
    nuxt.options.runtimeConfig.asgardeoAuth = defu(
      nuxt.options.runtimeConfig.asgardeoAuth,
      {
        // Pass all necessary options for the server-side SDK
        clientID: options.clientID, // SDK likely needs it server-side too
        clientSecret: options.clientSecret, // Keep secret server-side!
        serverOrigin: options.baseUrl,
        signInRedirectURL: options.signInRedirectURL,
        signOutRedirectURL: options.signOutRedirectURL,
        scope: options.scope,
      }
    );

    // 3. Locate runtime directory (no change needed)
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = resolve("./runtime");
    const runtimeServerDir = resolve("./runtime/server");

    // 4. Add composables (no change needed)
    addImports({
      name: "useAuth",
      from: resolve(runtimeDir, "composables/asgardeo/useAuth"),
    });

    addServerImports([
      {
        name: "AsgardeoAuthHandler",
        as: "AsgardeoAuthHandler",
        from: resolve(runtimeServerDir, "handler"),
      },
    ]);

    // 5. Create virtual imports for server-side SDK helpers (no change needed)
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};
      nitroConfig.alias["#auth/server"] = resolve(
        runtimeDir,
        "server/services/asgardeo"
      );
      nitroConfig.externals = defu(
        typeof nitroConfig.externals === "object" ? nitroConfig.externals : {},
        { inline: [resolve(runtimeDir)] }
      );
    });

    logger.success(`Successfully set up ${PACKAGE_NAME}`);
  },
}) satisfies NuxtModule<ModuleOptions>;

declare module "@nuxt/schema" {
  interface PublicRuntimeConfig {
    asgardeoAuth: Pick<
      ModuleOptions,
      | "clientID"
      | "baseUrl"
      | "signInRedirectURL"
      | "signOutRedirectURL"
      | "scope"
    >;
  }

  interface RuntimeConfig {
    asgardeoAuth: {
      clientSecret: string;
    };
  }
}
