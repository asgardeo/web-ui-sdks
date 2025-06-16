'use client';

import {useState} from 'react';
import {Menu, X} from 'lucide-react';
import PublicActions from './PublicActions';

interface PublicNavigationProps {
  className?: string;
}

export default function PublicNavigation({className = ''}: PublicNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {label: 'Features', href: '#features'},
    {label: 'Testimonials', href: '#testimonials'},
    {label: 'Pricing', href: '#pricing'},
    {label: 'Contact', href: '#contact'},
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`hidden md:flex space-x-8 ${className}`}>
        {navigationItems.map(item => (
          <a key={item.label} href={item.href} className="text-gray-700 hover:text-blue-600 transition-colors">
            {item.label}
          </a>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="px-4 py-4 space-y-4">
            {navigationItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                className="block text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <PublicActions showMobileActions={true} />
          </div>
        </div>
      )}
    </>
  );
}
