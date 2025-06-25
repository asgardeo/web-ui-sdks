'use client';

import {SignedIn, SignedOut} from '@asgardeo/nextjs';
import Logo from './Logo';
import PublicNavigation from './PublicNavigation';
import AuthenticatedNavigation from './AuthenticatedNavigation';
import PublicActions from './PublicActions';
import AuthenticatedActions from './AuthenticatedActions';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <SignedIn>
              <Logo to="/dashboard" />
              <AuthenticatedNavigation />
            </SignedIn>
            <SignedOut>
              <Logo to="/" />
              <PublicNavigation />
            </SignedOut>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            <SignedIn>
              <AuthenticatedActions />
            </SignedIn>
            <SignedOut>
              <PublicActions showMobileActions={false} />
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}
