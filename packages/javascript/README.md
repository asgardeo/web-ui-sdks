# @asgardeo/javascript

Core JavaScript SDK for Asgardeo - Authentication and Identity Management.

## Installation

```bash
npm install @asgardeo/javascript
```

## Quick Start

```javascript
import { AsgardeoAuth } from "@asgardeo/javascript";

// Initialize the auth instance
const auth = new AsgardeoAuth({
    signInRedirectURL: "https://localhost:3000",
    clientID: "<your_client_id>",
    baseUrl: "https://api.asgardeo.io/t/<org_name>"
});

// Handle authentication
auth.signIn()
    .then(() => {
        // Handle successful sign in
    })
    .catch((error) => {
        // Handle sign in error
    });

// Get authenticated user
auth.getBasicUserInfo()
    .then((userInfo) => {
        console.log(userInfo);
    });

// Sign out
auth.signOut();
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
