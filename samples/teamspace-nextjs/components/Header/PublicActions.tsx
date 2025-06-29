import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {SignInButton, SignUpButton} from '@asgardeo/nextjs';

interface PublicActionsProps {
  className?: string;
  showMobileActions?: boolean;
}

export default function PublicActions({className = '', showMobileActions = false}: PublicActionsProps) {
  if (showMobileActions) {
    // Mobile menu actions
    return (
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <SignInButton />
        <SignUpButton />
      </div>
    );
  }

  return (
    <div className={`hidden md:flex items-center space-x-4 ${className}`}>
      <SignInButton />
      <SignUpButton />
    </div>
  );
}
