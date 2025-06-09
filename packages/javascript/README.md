<p align="center" style="color: #343a40">
  <h1 align="center">@asgardeo/javascript</h1>
</p>
<p align="center" style="font-size: 1.2rem;">Framework Agnostic JavaScript SDK for Asgardeo</p>
<div align="center">
  <img alt="npm (scoped)" src="https://img.shields.io/npm/v/@asgardeo/javascript">
  <img alt="npm" src="https://img.shields.io/npm/dw/@asgardeo/javascript">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License"></a>
</div>

## Installation

```bash
# Using npm
npm install @asgardeo/javascript

# or using pnpm
pnpm add @asgardeo/javascript

# or using yarn
yarn add @asgardeo/javascript
```

## Quick Start

```javascript
import { AsgardeoAuth } from "@asgardeo/javascript";

// Initialize the auth instance
const auth = new AsgardeoAuth({
    afterSignInUrl: "https://localhost:3000",
    clientId: "<your_client_id>",
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

## License

Apache-2.0
