import Link from 'next/link';

interface AuthenticatedNavigationProps {
  className?: string;
}

export default function AuthenticatedNavigation({className = ''}: AuthenticatedNavigationProps) {
  const navigationItems = [
    {label: 'Dashboard', href: '/dashboard'},
    {label: 'Projects', href: '/projects'},
    {label: 'Teams', href: '/teams'},
  ];

  const isMobileMenu = className.includes('flex-col');

  return (
    <nav className={`${isMobileMenu ? 'flex flex-col space-y-4' : 'hidden md:flex space-x-6'} ${className}`}>
      {navigationItems.map(item => (
        <Link
          key={item.label}
          href={item.href}
          className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors ${
            isMobileMenu ? 'block' : ''
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
