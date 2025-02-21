# @asgardeo/vue

<p align="center" style="font-size: 1.2rem;">Vue Wrapper to build customizable login UIs for Asgardeo or Identity Server</p>

<div align="center">
  <img alt="npm (scoped)" src="https://img.shields.io/npm/v/@asgardeo/vue">
  <img alt="npm" src="https://img.shields.io/npm/dw/@asgardeo/vue">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License"></a>
</div>

## Prerequisites
- Vue.js 3.4.0 or higher

## Installation

```bash
# With npm
npm install @asgardeo/vue

# With pnpm
pnpm add @asgardeo/vue

# With yarn
yarn add @asgardeo/vue
```

## Basic Setup

```typescript
import { createApp } from 'vue'
import { AsgardeoAuth } from '@asgardeo/vue'

const app = createApp(App)

app.use(AsgardeoAuth, {
  signInRedirectURL: "http://localhost:3000",
  signOutRedirectURL: "http://localhost:3000",
  clientID: "<your-client-id>",
  baseUrl: "https://api.asgardeo.io/t/<org-name>",
  scope: ["openid", "profile"]
})

app.mount('#app')
```

## License

Licenses this source under the Apache License, Version 2.0 [LICENSE](./LICENSE), You may not use this file except in compliance with the License.