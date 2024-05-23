<!--
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
-->

# AsgardeoProvider

The `AsgardeoProvider` is a context provider component provided by the Asgardeo React SDK. It allows you to access the authentication context throughout your application. This context includes user information, authentication state, and methods to handle authentication actions such as sign-in, sign-out, and refresh tokens.

## Usage

First, import the `AsgardeoProvider` from the Asgardeo React SDK:

```ts
import { AsgardeoProvider } from "@asgardeo/auth-react";

<AsgardeoProvider config={config}>
    <App />
</AsgardeoProvider>
```

- To use `AsgardeoProvider`, you need to pass a `config` prop. This prop should be an object of type `UIAuthConfig`, which contains the following properties:

  #### Required Parameters

  - `baseURL`: The base URL of asgardeo.

  - `signInRedirectURL`: The URL where users should be redirected after they sign in. This should be a page in your application.

  - `clientID`: The ID of your application. You get this when you register your application with Asgardeo.

  - `scope`: The scope of the access request. This is a list of scopes separated by spaces. Scopes allow your application to request access only to the resources it needs, and also allow users to control how much access they grant to your application.

  #### Optional Parameters

  - `name`: The name of your application. This is used for application specific branding.

  - `type`: The branding preference for your application. This should be one of the values from the `BrandingPreferenceTypes` enum: "APP", "CUSTOM", or "ORG".

  - `enablePKCE`: A boolean indicating whether to enable Proof Key for Code Exchange (PKCE). This is a security feature that helps prevent interception attacks during the authorization process.
