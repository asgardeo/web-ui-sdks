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

1. Create a `.env.local` file with your Asgardeo configuration:

```bash
NEXT_PUBLIC_ASGARDEO_BASE_URL=https://api.asgardeo.io/t/<your-org-name>
NEXT_PUBLIC_ASGARDEO_CLIENT_ID=<your-client-id>
NEXT_PUBLIC_ASGARDEO_CLIENT_SECRET=<your-client-secret>
```

2. Then create a `middleware.ts` file in your project root to handle authentication:

```typescript
import { AsgardeoNext } from '@asgardeo/nextjs';
import { NextRequest } from 'next/server';

const asgardeo = new AsgardeoNext();

asgardeo.initialize({
  baseUrl: process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL,
  clientId: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_SECRET,
  afterSignInUrl: 'http://localhost:3000',
});

export async function middleware(request: NextRequest) {
  return await asgardeo.middleware(request);
}

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

## License

Apache-2.0
