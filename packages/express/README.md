<p align="center" style="color: #343a40">
  <h1 align="center">@asgardeo/express</h1>
</p>
<p align="center" style="font-size: 1.2rem;">Express.js SDK for Asgardeo</p>
<div align="center">
  <img alt="npm (scoped)" src="https://img.shields.io/npm/v/@asgardeo/express">
  <img alt="npm" src="https://img.shields.io/npm/dw/@asgardeo/express">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License"></a>
</div>

## Installation

```bash
# Using npm
npm install @asgardeo/express

# or using pnpm
pnpm add @asgardeo/express

# or using yarn
yarn add @asgardeo/express
```

## Quick Start

```javascript
import { AsgardeoExpressClient } from "@asgardeo/express";

// Initialize the client
const authClient = new AsgardeoExpressClient({
    clientId: "<your_client_id>",
    clientSecret: "<your_client_secret>",
    baseUrl: "https://api.asgardeo.io/t/<org_name>",
    callbackURL: "http://localhost:3000/callback"
});

// Example Express.js integration
import express from "express";
const app = express();

// Login endpoint
app.get("/login", (req, res) => {
    const authUrl = authClient.getSignInUrl();
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

## License

Apache-2.0
