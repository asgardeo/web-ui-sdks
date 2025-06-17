import {AsgardeoNext} from '@asgardeo/nextjs';
import {NextRequest} from 'next/server';

const asgardeo = new AsgardeoNext();

asgardeo.initialize({
  baseUrl: process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL,
  clientId: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_SECRET,
  afterSignInUrl: 'http://localhost:3000',
  scopes: 'openid profile email',
});

export async function middleware(request: NextRequest) {
  return await asgardeo.middleware(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
