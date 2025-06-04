# @asgardeo/react

React SDK for Asgardeo - Authentication and Identity Management.

## Installation

```bash
npm install @asgardeo/react
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

## License

Apache-2.0
