'use client';

import {Link} from 'react-router-dom';
import {SignInButton} from '@asgardeo/react';
import {Button} from '../ui/button';

interface PublicActionsProps {
  className?: string;
  showMobileActions?: boolean;
}

export default function PublicActions({className = '', showMobileActions = false}: PublicActionsProps) {
  if (showMobileActions) {
    // Mobile menu actions
    return (
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <Link to="/signin" className="block text-center py-2 text-gray-700 hover:text-blue-600 transition-colors">
          Sign In
        </Link>
        <Link
          to="/signup"
          className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Desktop CTA */}
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/signin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
          Sign In
        </Link>
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile CTA - shown in mobile menu */}
      <div className="md:hidden">
        <SignInButton>
          {({signIn, isLoading}) => (
            <Button onClick={signIn} disabled={isLoading} size="sm">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          )}
        </SignInButton>
      </div>
    </div>
  );
}
