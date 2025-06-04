# @asgardeo/nextjs

Next.js SDK for Asgardeo - Authentication and Identity Management.

## Installation

```bash
npm install @asgardeo/nextjs
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
