'use client';

import {SignedIn, SignedOut} from '@asgardeo/react';
import Logo from './Logo';
import PublicNavigation from './PublicNavigation';
import AuthenticatedNavigation from './AuthenticatedNavigation';
import AuthenticatedMobileMenu from './AuthenticatedMobileMenu';
import PublicActions from './PublicActions';
import AuthenticatedActions from './AuthenticatedActions';

export default function Header() {
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

          {/* Right side - Actions based on auth state */}
          <div className="flex items-center space-x-2">
            <SignedOut>
              <PublicActions showMobileActions={false} />
            </SignedOut>
            <SignedIn>
              <AuthenticatedActions />
              <AuthenticatedMobileMenu />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
