<p align="center" style="color: #343a40">
  <h1 align="center">@asgardeo/js</h1>
</p>
<p align="center" style="font-size: 1.2rem;">Handles framework agnostic content</p>
<div align="center">
  <img alt="npm (scoped)" src="https://img.shields.io/npm/v/@asgardeo/js">
  <img alt="npm" src="https://img.shields.io/npm/dw/@asgardeo/js">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License"></a>
</div>

## Installation

```bash
# With npm
npm install @asgardeo/js

# With pnpm
pnpm add @asgardeo/js

# With yarn
yarn add @asgardeo/js
```

## Usage

To use functions from `@asgardeo/js`, simply import the function and use it in your code:

```jsx
import { authenticate } from '@asgardeo/js';

function implementAuthn() {
  const response = await authenticate();
}
```

## License

Licenses this source under the Apache License, Version 2.0 [LICENSE](./LICENSE), You may not use this file except in
compliance with the License.
