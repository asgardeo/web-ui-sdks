<p align="center" style="color: #343a40">
  <h1 align="center">@asgardeo/react</h1>
</p>
<p align="center" style="font-size: 1.2rem;">React SDK for Asgardeo</p>
<div align="center">
  <img alt="npm (scoped)" src="https://img.shields.io/npm/v/@asgardeo/react">
  <img alt="npm" src="https://img.shields.io/npm/dw/@asgardeo/react">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License"></a>
</div>

## Installation

```bash
# Using npm
npm install @asgardeo/react

# or using pnpm
pnpm add @asgardeo/react

# or using yarn
yarn add @asgardeo/react
```

## Quick Start

1. Add `<AsgardeoProvider />` to your app

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AsgardeoProvider } from '@asgardeo/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AsgardeoProvider
      baseUrl: '<your-organization-name>'
      clientId: '<your-app-client-id>'
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>
)
```

2. Add signed-in and signed-out to your app

```tsx
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@asgardeo/react'
import './App.css'

function App() {
  return (
    <>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  )
}

export default App
```

3. Start using other drop-in components like `User`, `UserProfile`, etc.

```tsx
import { User, UserProfile } from '@asgardeo/react'
import './App.css'

function App() {
  return (
    <>
      <User>
        {({ user }) => (
          <div>
            <h1>Welcome, {user.username}</h1>
            <UserProfile />
          </div>
        )}
      </User>
      
      <UserProfile />
    </>
  )
}
export default App
```

## Using the `useAsgardeo` Hook (For Programmatic Control)

For more granular control, you can use the useAsgardeo hook. This hook provides direct access to SDK's functions and state:

```tsx
import { useAsgardeo } from '@asgardeo/react'
import './App.css'

function App() {
  const { user, signIn, signOut, isSignedIn, isLoading } = useAsgardeo()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {isSignedIn ? (
        <div>
          <div>
            <img src={user.photourl} alt={user.username} />
            <p>Welcome back, {user.givenname}</p>
          </div>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  )
}
```

## Documentation

For complete API documentation including all components, hooks, and customization options, see [API.md](./API.md).

## License

Licenses this source under the Apache License, Version 2.0 [LICENSE](../../LICENSE), You may not use this file except in compliance with the License.
