# @asgardeo/next

Next.js SDK for Asgardeo - Authentication and Identity Management.

## Installation

```bash
npm install @asgardeo/next
```

## Quick Start

```typescript
// pages/_app.tsx
import { AsgardeoProvider } from "@asgardeo/next";

function MyApp({ Component, pageProps }) {
    return (
        <AsgardeoProvider
            config={{
                signInRedirectURL: "http://localhost:3000",
                clientID: "<your_client_id>",
                baseUrl: "https://api.asgardeo.io/t/<org_name>"
            }}
        >
            <Component {...pageProps} />
        </AsgardeoProvider>
    );
}

export default MyApp;

// pages/index.tsx
import { useAsgardeo } from "@asgardeo/next";

export default function Home() {
    const { signIn, signOut, user } = useAsgardeo();

    return (
        <div>
            {user ? (
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

## License

Apache-2.0
