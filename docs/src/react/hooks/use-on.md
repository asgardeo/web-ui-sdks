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

# useOn

`useOn` is a custom hook that allows you to set callbacks for specific events in the authentication lifecycle.

## Usage

First, import the `useOn` hook from the Asgardeo React SDK:

```ts
import { useOn, Hooks } from "@asgardeo/react";
```

Then, you can use it in your component:

```ts
useOn({
  event: Hooks.SignIn,
  callback: () => {
    console.log("User signed in");
  },
});
```

## Props

The `useOn` hook accepts an object with the following properties:

- `event`: The event for which the callback should be set. This should be one of the values from the `Hooks` enum, which includes `Hooks.SignIn` and `Hooks.SignOut`.

- `callback`: The function to be called when the specified event occurs. This function will be called with no arguments.

Here's an example of how to use these props:

```ts
useOn({
  event: Hooks.SignOut,
  callback: () => {
    console.log("User signed out");
  },
});
```

In this example, the message "User signed out" will be logged when the user signs out.
