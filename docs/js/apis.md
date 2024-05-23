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

# API functions

## authorize

The `authorize` function is used to authorize the user. It makes a POST request to the authorization endpoint with the necessary parameters and returns the authorization response.

### Usage

First, import the `authorize` function:

```ts
import { authorize } from "@asgardeo/js";
```

Then, you can use it in your component:

```ts
const authorizeUser = async () => {
  try {
    const response = await authorize();
    console.log(response);
  } catch (error) {
    console.error("Authorization failed", error);
  }
};

authorizeUser();
```

### Return Value

The `authorize` function returns a promise that resolves with the authorization response. This response is an object of type `AuthApiResponse`.

If the authorization request fails for any reason, the function will throw an `AsgardeoUIException`.

Here's an example of how to handle the returned promise:

```ts
authorize()
  .then((response) => {
    console.log("Authorization successful", response);
  })
  .catch((error) => {
    console.error("Authorization failed", error);
  });
```

## authenticate

The `authenticate` function is used to send an authentication request to the authentication API. It accepts an object with the authentication request body and returns the authentication API response.

### Usage

First, import the `authenticate` function:

```ts
import { authenticate } from "@asgardeo/auth-react";
```

Then, you can use it in your component:

```ts
const authenticateUser = async () => {
  try {
    const response = await authenticate({
      /* authentication request body */
    });
    console.log(response);
  } catch (error) {
    console.error("Authentication failed", error);
  }
};

authenticateUser();
```

### Params

The `authenticate` function accepts an object with the authentication request body. This object should match the `AuthenticateProps` type.

### Return Value

The `authenticate` function returns a promise that resolves with the authentication API response. This response is an object of type `AuthApiResponse`.

If the authentication request fails for any reason, the function will throw an `AsgardeoUIException`.

Here's an example of how to handle the returned promise:

````ts
authenticate({
    /* authentication request body */
})
    .then(response => {
        console.log("Authentication successful", response);
    })
    .catch(error => {
        console.error("Authentication failed", error);
    });
    ```
````
