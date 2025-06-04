# @asgardeo/node

Node.js SDK for Asgardeo - Authentication and Identity Management.

## Installation

```bash
npm install @asgardeo/node
```

## Quick Start

```javascript
import { AsgardeoNodeClient } from "@asgardeo/node";

// Initialize the client
const authClient = new AsgardeoNodeClient({
    clientID: "<your_client_id>",
    clientSecret: "<your_client_secret>",
    baseUrl: "https://api.asgardeo.io/t/<org_name>",
    callbackURL: "http://localhost:3000/callback"
});

// Example Express.js integration
import express from "express";
const app = express();

// Login endpoint
app.get("/login", (req, res) => {
    const authUrl = authClient.getAuthorizationURL();
    res.redirect(authUrl);
});

// Callback handler
app.get("/callback", async (req, res) => {
    try {
        const { code } = req.query;
        const tokens = await authClient.exchangeAuthorizationCode(code);
        // Store tokens and redirect to home page
        res.redirect("/");
    } catch (error) {
        res.status(500).send("Authentication failed");
    }
});

// Get user info
app.get("/userinfo", async (req, res) => {
    try {
        const userInfo = await authClient.getUserInfo();
        res.json(userInfo);
    } catch (error) {
        res.status(401).send("Unauthorized");
    }
});
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
