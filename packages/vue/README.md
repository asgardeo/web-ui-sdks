<p align="center" style="color: #343a40">
  <h1 align="center">@asgardeo/vue</h1>
</p>
<p align="center" style="font-size: 1.2rem;">Vue.js SDK for Asgardeo</p>
<div align="center">
  <img alt="npm (scoped)" src="https://img.shields.io/npm/v/@asgardeo/vue">
  <img alt="npm" src="https://img.shields.io/npm/dw/@asgardeo/vue">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License"></a>
</div>

## Installation

```bash
# Using npm
npm install @asgardeo/vue

# or using pnpm
pnpm add @asgardeo/vue

# or using yarn
yarn add @asgardeo/vue
```

## Basic Setup

1. Configure the authentication plugin:

```typescript
import { createApp } from 'vue'
import { AsgardeoAuth } from '@asgardeo/vue'

const app = createApp(App)

app.use(AsgardeoAuth, {
  afterSignInUrl: "http://localhost:3000",
  afterSignOutUrl: "http://localhost:3000",
  clientId: "<your-client-id>",
  baseUrl: "https://api.asgardeo.io/t/<org-name>",
  scope: ["openid", "profile"]
})

app.mount('#app')
```

2. Use in your components:

```vue
<template>
  <div>
    <div v-if="auth.isAuthenticated">
      <p>Welcome, {{ auth.user?.username }}</p>
      <button @click="auth.signOut">Sign Out</button>
    </div>
    <button v-else @click="auth.signIn">Sign In</button>
  </div>
</template>

<script setup>
import { useAsgardeo } from '@asgardeo/vue'

const auth = useAsgardeo()
</script>
```

## Composables

- `useAsgardeo()`: Main composable that provides:
  - `isAuthenticated`: Boolean indicating authentication status
  - `user`: Current user information
  - `signIn()`: Function to initiate sign in
  - `signOut()`: Function to sign out
  - `getAccessToken()`: Function to get the current access token
  - `getBasicUserInfo()`: Function to get basic user information
  
- `useAuthContext()`: Composable to access the raw authentication context
- `useIsAuthenticated()`: Composable to check authentication status

## Development

1. Install dependencies:
```bash
pnpm install
```

2. Build:
```bash
pnpm build
```

3. Run tests:
```bash
pnpm test
```

4. Run development server:
```bash
pnpm dev
```

## License

Apache License, Version 2.0 - see [LICENSE](./LICENSE) for details.
