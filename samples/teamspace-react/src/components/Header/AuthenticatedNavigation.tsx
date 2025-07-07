'use client';

import {Link} from 'react-router';

interface AuthenticatedNavigationProps {
  className?: string;
}

export default function AuthenticatedNavigation({className = ''}: AuthenticatedNavigationProps) {
  const navigationItems = [
    {label: 'Dashboard', href: '/dashboard'},
    {label: 'Projects', href: '/projects'},
    {label: 'Teams', href: '/teams'},
  ];

  return (
    <nav className={`hidden md:flex space-x-6 ${className}`}>
      {navigationItems.map(item => (
        <Link
          key={item.label}
          to={item.href}
          className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
