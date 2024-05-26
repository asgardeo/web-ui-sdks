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

# Asgardeo JS SDK

The Asgardeo JS SDK enables some core features required for api based authentication.

This SDK assists you in creating custom login flows directly within the applications themselves, without relying on browser redirects, thereby prioritizing user experience.

## Getting Started

### Prerequisites

- [Register to Asgardeo and create an organization if you don't already have one](https://wso2.com/asgardeo/docs/get-started/create-asgardeo-account/). The organization name you choose will be referred to as `<org_name>` throughout this document.
- [Register a standard based application in Asgardeo to integrate your application with Asgardeo](https://wso2.com/asgardeo/docs/guides/applications/register-mobile-app/). You will obtain a `client_id` from Asgardeo for your application which will need to be embedded later for the SDK integration. Also note the redirect URI that you used to create the application, this is also required for the SDK integration.
- In the created application, go to the **Advanced** tab and [enable the application native authentication for your application](https://is.docs.wso2.com/en/latest/guides/authentication/add-application-native-login/#enable-app-native-authentication).

### Installing the SDK

To install the Asgardeo JS SDK, navigate to your project directory in your terminal and run the following command:

with pnpm:

```bash
pnpm install @asgardeo/js
```

With npm:

```bash
npm install @asgardeo/js
```

With yarn:

```bash
yarn add @asgardeo/js
```
