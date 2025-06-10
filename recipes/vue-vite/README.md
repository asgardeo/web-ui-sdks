# Asgardeo Auth Vue.js SDK Usage Example (Single Page Application)

This sample is developed to demonstrate the basic usage of the Asgardeo Auth Vue.js SDK.

## Getting Started

### Prerequisites
- `Node.js` (version 20 or above).

### Register an Application
//TODO

Make sure to add `http://localhost:5173` as a Redirect URL and also add it under allowed origins.

### Download the Sample
//TODO

### Configure the Sample

Update the authentication configuration in your `main.ts` file with your registered app details.

**Note:** You will need to paste in the `client ID` generated for the application you registered.

```typescript
import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { asgardeoPlugin } from "./auth/authprovider";

const app = createApp(App);

app.use(router);
app.use(asgardeoPlugin, {
  afterSignInUrl: "http://localhost:5173/",
  afterSignOutUrl: "http://localhost:5173/",
  clientId: "<ADD_CLIENT_ID_HERE>",
  baseUrl: "https://api.asgardeo.io/t/<org_name>",
});

app.mount("#app");
```

### Run the Application

```bash
npm install && npm run dev
```

The app should open at [`http://localhost:5173`](http://localhost:5173)

### Change the Application's Development Server Port

By default, the Vite development server runs on port `5173`. In case you wish to change this to something else, follow the steps below.

1. Update the port in your Vite configuration file (`vite.config.js` or `vite.config.ts`):
   ```javascript
   export default defineConfig({
     // Other config options...
     server: {
       port: YOUR_PREFERRED_PORT
     }
   })
   ```

2. Update the `afterSignInUrl` & `afterSignOutUrl` in `main.ts` to match your new port.

3. Go to the Asgardeo Console and navigate to the protocol tab of your application:
   - Update the Authorized Redirect URL.
   - Update the Allowed Origins.

## Using the Auth Plugin

The Asgardeo Auth plugin is available throughout your Vue application. Here's how to use it in your components:

```vue
<script setup>
import { useAsgardeo } from '@asgardeo/vue';

const { isSignedIn, signIn, signOut, getBasicUserInfo } = useAsgardeo();
</script>

<template>
  <div>
    <button v-if="!isSignedIn" @click="signIn">Login</button>
    <button v-else @click="signOut">Logout</button>
  </div>
</template>
```

//TODO

## Contribute

Please read [Contributing to the Code Base](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### Reporting Issues

We encourage you to report issues, improvements, and feature requests by creating [Github Issues](https://github.com/asgardeo/web-ui-sdks/issues).

Important: Please be advised that security issues must be reported to security@wso2.com, not as GitHub issues, in order to reach the proper audience. We strongly advise following the WSO2 Security Vulnerability Reporting Guidelines when reporting security issues.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](../../LICENSE) file for details.
