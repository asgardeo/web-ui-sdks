'use client';

import {useAuth} from '@/hooks/use-auth';
import Logo from './Logo';
import PublicNavigation from './PublicNavigation';
import AuthenticatedNavigation from './AuthenticatedNavigation';
import PublicActions from './PublicActions';
import AuthenticatedActions from './AuthenticatedActions';

export function Header() {
  const {isAuthenticated} = useAuth();

  if (!isAuthenticated) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Logo to="/" />
              <PublicNavigation />
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              <PublicActions showMobileActions={false} />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Logo to="/dashboard" />
            <AuthenticatedNavigation />
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            <AuthenticatedActions />
          </div>
        </div>
      </div>
    </header>
  );
}
