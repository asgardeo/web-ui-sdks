<p align="center" style="color: #343a40">
  <h1 align="center">@asgardeo/nextjs</h1>
</p>
<p align="center" style="font-size: 1.2rem;">Next.js SDK for Asgardeo</p>
<div align="center">
  <img alt="npm (scoped)" src="https://img.shields.io/npm/v/@asgardeo/nextjs">
  <img alt="npm" src="https://img.shields.io/npm/dw/@asgardeo/nextjs">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License"></a>
</div>

## Installation

```bash
# Using npm
npm install @asgardeo/nextjs

# or using pnpm
pnpm add @asgardeo/nextjs

# or using yarn
yarn add @asgardeo/nextjs
```

## Quick Start

### Option 1: Provider-based Configuration (Recommended)

1. Create a `.env.local` file with your Asgardeo configuration:

```bash
NEXT_PUBLIC_ASGARDEO_BASE_URL=https://api.asgardeo.io/t/<your-org-name>
NEXT_PUBLIC_ASGARDEO_CLIENT_ID=<your-client-id>
NEXT_PUBLIC_ASGARDEO_CLIENT_SECRET=<your-client-secret>
```

2. Add the `AsgardeoProvider` to your root layout with configuration:

```tsx
// app/layout.tsx
import { AsgardeoProvider } from '@asgardeo/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const asgardeoConfig = {
    baseUrl: process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL,
    clientId: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_SECRET,
    afterSignInUrl: process.env.NEXT_PUBLIC_ASGARDEO_AFTER_SIGN_IN_URL || 'http://localhost:3000',
  };

  return (
    <html lang="en">
      <body>
        <AsgardeoProvider config={asgardeoConfig}>
          {children}
        </AsgardeoProvider>
      </body>
    </html>
  );
}
```

3. Create a simple `middleware.ts` file in your project root:

```typescript
import { asgardeoMiddleware } from '@asgardeo/nextjs/middleware';

export default asgardeoMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

### Option 2: Middleware-based Configuration

2. Then create a `middleware.ts` file in your project root to handle authentication:

```typescript
import { createAsgardeoMiddleware } from '@asgardeo/nextjs/middleware';

const middleware = createAsgardeoMiddleware({
  baseUrl: process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL,
  clientId: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_SECRET,
  afterSignInUrl: 'http://localhost:3000',
});

export { middleware };

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

3. Add `SignInButton` and `SignOutButton` buttons to your app

```tsx
import styles from './page.module.css';
import {SignInButton, SignedIn, SignOutButton, SignedOut} from '@asgardeo/nextjs';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <SignedOut>
            <SignInButton className={styles.primary}>Sign In</SignInButton>
          </SignedOut>
          <SignedIn>
            <SignOutButton className={styles.secondary}>Sign Out</SignOutButton>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}
```

## Server-side Usage

You can access the Asgardeo client instance in server actions and other server-side code:

```typescript
import { getAsgardeoClient } from '@asgardeo/nextjs/server';

export async function getUserProfile() {
  const client = getAsgardeoClient();
  const user = await client.getUser();
  return user;
}
```

## Architecture

The SDK uses a singleton pattern for the `AsgardeoNextClient` to ensure consistent authentication state across your application. The client is automatically initialized when you provide configuration through the `AsgardeoProvider` or through the middleware configuration.

## License

Apache-2.0
