# @asgardeo/browser

Browser-based authentication SDK for Asgardeo - Authentication and Identity Management.

## Installation

```bash
npm install @asgardeo/browser
```

## Quick Start

```javascript
import { AsgardeoAuthClient } from "@asgardeo/browser";

// Initialize the auth client
const authClient = new AsgardeoAuthClient({
    signInRedirectURL: "https://localhost:3000",
    clientID: "<your_client_id>",
    baseUrl: "https://api.asgardeo.io/t/<org_name>"
});

// Sign in
authClient.signIn();

// Get user info after authentication
const userInfo = await authClient.getBasicUserInfo();

// Sign out
authClient.signOut();
```

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

## License

Apache-2.0
