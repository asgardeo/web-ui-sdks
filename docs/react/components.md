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

# Components Overview

## UI Components

- [SignIn](/SignIn.md): A component that provides sign-in forms as configured in the login flow of asgardeo.

- [SignOutButton](./SignOutButton.md): A component that provides a sign-out button. When clicked, it initiates the sign-out process.

## Control Components

- [SignedIn](./SignedIn.md): A component that renders its children only when the user is signed in.

- [SignedOut](./SignedOut.md): A component that renders its children only when the user is not signed in.

## Provider Component

- [AsgardeoProvider](./components/asgardeo-provider): A context provider component that provides an Asgardeo context to all its children. It takes a `UIAuthConfig` object as a prop, which includes the configuration for the Asgardeo context.
