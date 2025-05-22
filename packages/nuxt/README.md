# Asgardeo Auth for Nuxt

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt module for Asgardeo - Authentication and Identity Management. Seamlessly integrate Asgardeo authentication into your Nuxt applications.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [📄 &nbsp;License](LICENSE)
- [🏀 &nbsp;Online Demo](https://github.com/asgardeo/web-ui-sdks/tree/main/recipes/nuxt-vite)

## Features

- 🔐 &nbsp;OAuth2/OIDC Authentication with Asgardeo
- 🛡️ &nbsp;Server-side session management
- 🎣 &nbsp;Vue composables for authentication
- 🚀 &nbsp;Simple and easy to use API
- 🔄 &nbsp;Auto-refresh token support

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npm install @asgardeo/nuxt
```

Then, configure your Nuxt application by updating the `nuxt.config.ts` file:

```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@asgardeo/nuxt']
});
```

Next, create a `server/api/auth/[...].ts` file and add the following code:

```typescript
import { AsgardeoAuthHandler } from '@asgardeo/nuxt/server';

const config = {
    baseUrl: process.env.ASGARDEO_BASE_URL as string,
    clientID: process.env.ASGARDEO_CLIENT_ID as string,
    clientSecret: process.env.ASGARDEO_CLIENT_SECRET as string,
    signInRedirectURL: process.env.ASGARDEO_SIGN_IN_REDIRECT_URL as string,
    signOutRedirectURL: process.env.ASGARDEO_SIGN_OUT_REDIRECT_URL as string,
    scope: process.env.ASGARDEO_SCOPE?.split(",").map(scope => scope.trim()) as string[]
};

export default AsgardeoAuthHandler(config);
```

Also, create an `.env` file to store your environment variables:

```
ASGARDEO_BASE_URL=https://api.asgardeo.io/t/<your-org-name>
ASGARDEO_CLIENT_ID=<your-client-id>
ASGARDEO_CLIENT_SECRET=<your-client-secret>
ASGARDEO_SIGN_IN_REDIRECT_URL=http://localhost:3000/api/auth/callback
ASGARDEO_SIGN_OUT_REDIRECT_URL=http://localhost:3000
ASGARDEO_SCOPE=openid,profile,email
```

Finally, you can use the SDK in your Vue components like this:

```typescript
<script setup>
import { useAuth } from '@asgardeo/nuxt';

// For authentication
const { signIn, signOut, isAuthenticated, getBasicUserInfo } = useAuth();
</script>

<template>
  <div>
    <button v-if="!isAuthenticated" @click="signIn">Sign In</button>
    <button v-else @click="signOut">Sign Out</button>
    <div v-if="isAuthenticated">
      <pre>{{ getBasicUserInfo() }}</pre>
    </div>
  </div>
</template>
```

That's it! You can now use Asgardeo Auth in your Nuxt app ✨

## API Reference

### `useAuth()`

The `useAuth` composable provides access to authentication functionality:

```typescript
const { 
  signIn,
  signOut,
  isAuthenticated,
  getBasicUserInfo,
  getIDToken,
  getAccessToken,
  getRefreshToken,
  getDecodedIDToken
} = useAuth();
```

| Method | Description |
| ------ | ----------- |
| `signIn(callbackUrl?)` | Initiates the login process. Optionally accepts a callback URL to redirect to after successful login. |
| `signOut(callbackUrl?)` | Logs the user out. Optionally accepts a callback URL to redirect to after logout. |
| `isAuthenticated` | Boolean ref that indicates if the user is authenticated. |
| `getBasicUserInfo()` | Returns basic user information. |
| `getIDToken()` | Returns the ID token. |
| `getAccessToken()` | Returns the access token. |
| `getRefreshToken()` | Returns the refresh token. |
| `getDecodedIDToken()` | Returns the decoded ID token payload. |

## Configuration

You can also configure the module in your `nuxt.config.ts` file:

```typescript
export default defineNuxtConfig({
  // ... other config
  modules: ['@asgardeo/nuxt'],
  asgardeoAuth: {
    // Override env variables
    baseUrl: 'https://api.asgardeo.io/t/your-org-name',
    clientID: 'your-client-id',
    clientSecret: 'your-client-secret',
    signInRedirectURL: 'http://localhost:3000/api/auth/callback',
    signOutRedirectURL: 'http://localhost:3000',
    scope: ['openid', 'profile', 'email']
  }
});
```

## Troubleshooting

### CORS Issues

If you encounter CORS (Cross-Origin Resource Sharing) issues when interacting with Asgardeo, make sure your Asgardeo application has the correct origins configured:

1. Go to the Asgardeo Console
2. Navigate to your application
3. Under "Protocol" tab, add your application URL to the "Allowed Origins" list (e.g., `http://localhost:3000`)

### Authentication Flows

This module uses the Authorization Code flow with PKCE by default. If you need to customize this, you can set `enablePKCE: false` in your configuration.

### Common Errors

- **Invalid Redirect URI**: Ensure your `signInRedirectURL` matches exactly what's configured in Asgardeo
- **Token Validation Failed**: Check that your clock is synchronized and that your application's time is accurate
- **Scope Not Granted**: Verify that your application has the necessary scopes configured in Asgardeo

For more troubleshooting help, refer to the [Asgardeo documentation](https://wso2.com/asgardeo/docs/).

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@asgardeo/nuxt/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@asgardeo/nuxt

[npm-downloads-src]: https://img.shields.io/npm/dm/@asgardeo/nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@asgardeo/nuxt

[license-src]: https://img.shields.io/npm/l/@asgardeo/nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@asgardeo/nuxt

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
