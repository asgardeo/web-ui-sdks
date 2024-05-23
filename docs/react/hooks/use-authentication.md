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

# useAuthentication

`useAuthentication` is a custom hook provided by the Asgardeo React SDK. It provides access to the authentication context and returns an object containing the current user, the authentication status, the access token, and a sign out function.

## Usage

First, import the `useAuthentication` hook from the Asgardeo React SDK:

```ts
import { useAuthentication } from "@asgardeo/auth-react";
```

Then, you can use it in your component:

```ts
const { user, isAuthenticated, accessToken, signOut } = useAuthentication();
```

## Return Value

The `useAuthentication` hook returns an object with the following properties:

- `user`: The current user. This is an object that contains information about the user.

- `isAuthenticated`: A boolean that indicates whether the user is authenticated.

- `accessToken`: The access token for the authenticated user.

- `signOut`: A function that initiates the sign-out process. When called, it will sign out the user.

Here's an example of how to use these values:

```ts
const { user, isAuthenticated, signOut } = useAuthentication();

if (isAuthenticated) {
  console.log(`User ${user.username} is authenticated.`);
} else {
  console.log("User is not authenticated.");
}

// To sign out the user
signOut();
```
