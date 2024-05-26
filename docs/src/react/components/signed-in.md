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

# SignedIn

The `SignedIn` is a control component that renders its children only when the user is signed in.

## Usage

First, import the `SignedIn` component from the Asgardeo React SDK:

```javascript
import { SignedIn } from "@asgardeo/react";
```

Then you can use it in your component:

```javascript
<SignedIn>
  <p>You are signed in!</p>
</SignedIn>
```

## Props

The `SignedIn` component accepts the following prop:

- `fallback`: A React element that will be rendered if the user is not signed in. If not provided, nothing will be rendered when the user is not signed in.

Here's an example of how to use the `fallback` prop:

```javascript
<SignedIn fallback={<p>Please sign in.</p>}>
  <p>You are signed in!</p>
</SignedIn>
```
