'use client';

import {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useApp} from '../App';
import {Users, ChevronDown, Settings, User, LogOut, Plus, Check, Building2} from 'lucide-react';
import {SignedOut, SignInButton, SignOutButton, UserProfile} from '@asgardeo/react';
import {Button} from './ui/button';

export default function Header() {
  const {user, currentOrg, organizations, setCurrentOrg} = useApp();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const orgDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        setShowOrgDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOrgSwitch = (org: typeof currentOrg) => {
    if (org) {
      setCurrentOrg(org);
      setShowOrgDropdown(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Teamspace</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link to="/projects" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Projects
              </Link>
              <Link to="/teams" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Teams
              </Link>
            </nav>
          </div>

          {/* Right side - Organization switcher and User dropdown */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                {({signIn, isLoading}) => (
                  <Button onClick={signIn} disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                )}
              </SignInButton>
            </SignedOut>

            {/* Organization Switcher */}
            <div className="relative" ref={orgDropdownRef}>
              <button
                onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-200"
              >
                <img
                  src={currentOrg?.avatar || '/placeholder.svg'}
                  alt={currentOrg?.name}
                  className="w-5 h-5 rounded"
                />
                <span className="max-w-32 truncate">{currentOrg?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showOrgDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    Switch organization
                  </div>

                  {organizations.map(org => (
                    <button
                      key={org.id}
                      onClick={() => handleOrgSwitch(org)}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={org.avatar || '/placeholder.svg'} alt={org.name} className="w-6 h-6 rounded" />
                        <div className="text-left">
                          <div className="font-medium">{org.name}</div>
                          <div className="text-xs text-gray-500">{org.memberCount} members</div>
                        </div>
                      </div>
                      {currentOrg?.id === org.id && <Check className="h-4 w-4 text-green-600" />}
                    </button>
                  ))}

                  <div className="border-t border-gray-100 mt-1">
                    <Link
                      to="/organizations"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowOrgDropdown(false)}
                    >
                      <Building2 className="h-4 w-4 mr-3" />
                      Manage organizations
                    </Link>
                    <Link
                      to="/organizations/new"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowOrgDropdown(false)}
                    >
                      <Plus className="h-4 w-4 mr-3" />
                      New organization
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50"
              >
                <img src={user?.avatar || '/placeholder.svg'} alt={user?.name} className="w-8 h-8 rounded-full" />
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-sm text-gray-500">@{user?.username}</div>
                  </div>

                  <div
                    // to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowUserProfile(true);
                      setShowUserDropdown(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Your profile
                  </div>

                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Link>

                  <div className="border-t border-gray-100 mt-1">
                    <SignOutButton>
                      {({signOut}) => (
                        <button
                          onClick={() => {
                            signOut();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign out
                        </button>
                      )}
                    </SignOutButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showUserProfile && <UserProfile mode="popup" />}
    </header>
  );
}
