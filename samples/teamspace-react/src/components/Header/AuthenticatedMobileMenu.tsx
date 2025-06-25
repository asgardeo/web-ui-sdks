'use client';

import {useState} from 'react';
import {Link} from 'react-router-dom';
import {Menu, X, Home, Briefcase, Users as UsersIcon} from 'lucide-react';

interface AuthenticatedMobileMenuProps {
  className?: string;
}

export default function AuthenticatedMobileMenu({className = ''}: AuthenticatedMobileMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {label: 'Dashboard', href: '/dashboard', icon: Home},
    {label: 'Projects', href: '/projects', icon: Briefcase},
    {label: 'Teams', href: '/teams', icon: UsersIcon},
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button className={`md:hidden p-2 ${className}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
