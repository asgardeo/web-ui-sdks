# @asgardeo/react

React SDK for Asgardeo - Authentication and Identity Management.

## Installation

```bash
npm install @asgardeo/react
```

## Quick Start

1. Wrap your app with the `AsgardeoProvider`:

```jsx
// App.jsx
import { AsgardeoProvider } from "@asgardeo/react";

function App() {
    return (
        <AsgardeoProvider
            config={{
                signInRedirectURL: "http://localhost:3000",
                clientID: "<your_client_id>",
                baseUrl: "https://api.asgardeo.io/t/<org_name>"
            }}
        >
            <YourApp />
        </AsgardeoProvider>
    );
}
```

2. Use the authentication hooks in your components:

```jsx
import { useAsgardeo } from "@asgardeo/react";

function LoginPage() {
    const { signIn, signOut, isAuthenticated, user } = useAsgardeo();

    return (
        <div>
            {isAuthenticated ? (
                <>
                    <p>Welcome, {user.username}</p>
                    <button onClick={() => signOut()}>Sign Out</button>
                </>
            ) : (
                <button onClick={() => signIn()}>Sign In</button>
            )}
        </div>
    );
}
```

## Hooks

- `useAsgardeo()`: Main hook for authentication functionality
- `useAuthContext()`: Hook to access the raw auth context
- `useIsAuthenticated()`: Hook to check authentication status

## Development

1. Install dependencies:
```bash
pnpm install
```

2. Build:
```bash
pnpm build
```

3. Run tests:
```bash
pnpm test
```

## License

Apache-2.0
