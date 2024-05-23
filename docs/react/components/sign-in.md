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

# SignIn

The `SignIn` component provides sign-in forms as configured in the login flow of Asgardeo. When the `SignIn` component renders,
it initiates the sign-in process.

## Usage

First, import the `SignIn` component from the Asgardeo React SDK:

```ts
import { SignIn } from "@asgardeo/auth-react";

<SignIn />
```

## Props

The `SignIn` component accepts the following props:

- `branding`: A string that specifies the branding preference for the sign-in form.

- `showLogo`: A boolean that determines whether the logo should be displayed on the sign-in form. If set to `false`, the logo will not be displayed. Defaults to `true`.

- `showFooter`: A boolean that determines whether the footer should be displayed on the sign-in form. If set to `false`, the footer will not be displayed. Defaults to `true`.

- `showSignUp`: A boolean that determines whether the signup link should be displayed on the sign-in form. If set to `true`, the signup link will be displayed. Defaults to `false`.

Here's an example of how to use these props:

```ts
<SignIn
    branding={{preference: { .. }}}
    showLogo={false}
    showFooter={false}
    showSignUp={true}
/>
```
