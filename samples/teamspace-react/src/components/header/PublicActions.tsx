'use client';

import {Link, useNavigate} from 'react-router-dom';
import {SignInButton, SignUpButton} from '@asgardeo/react';
import {Button} from '../ui/button';

interface PublicActionsProps {
  className?: string;
  showMobileActions?: boolean;
}

export default function PublicActions({className = '', showMobileActions = false}: PublicActionsProps) {
  const navigate = useNavigate();

  if (showMobileActions) {
    // Mobile menu actions
    return (
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <SignInButton>
          {({isLoading}) => (
            <Button
              onClick={() => {
                navigate('/signin');
              }}
              disabled={isLoading}
              size="lg"
              color="primary"
              variant="secondary"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          )}
        </SignInButton>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Desktop CTA */}
      <div className="hidden md:flex items-center space-x-4">
        <SignInButton>
          {({isLoading}) => (
            <Button
              onClick={() => {
                navigate('/signin');
              }}
              disabled={isLoading}
              size="lg"
              color="primary"
              variant="secondary"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          )}
        </SignInButton>
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
