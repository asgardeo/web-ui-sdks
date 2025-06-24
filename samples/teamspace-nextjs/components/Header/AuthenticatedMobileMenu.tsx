'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Menu, X} from 'lucide-react';
import AuthenticatedNavigation from './AuthenticatedNavigation';

interface AuthenticatedMobileMenuProps {
  className?: string;
}

export default function AuthenticatedMobileMenu({className = ''}: AuthenticatedMobileMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className={`md:hidden ${className}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b z-50">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <AuthenticatedNavigation className="flex flex-col space-y-4 space-x-0" />
          </div>
        </div>
      )}
    </>
  );
}
