'use client';

import type React from 'react';

import Link from 'next/link';
import {Users} from 'lucide-react';
import {SignIn} from '@asgardeo/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-purple-50 p-4">
      <div className="w-full max-w-md">
        <SignIn />
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
