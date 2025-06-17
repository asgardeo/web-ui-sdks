'use client';

import {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {ChevronDown, Settings, User as UserIcon, LogOut} from 'lucide-react';
import {SignOutButton, User, UserProfile} from '@asgardeo/react';
import {useApp} from '../../App';

export default function UserDropdown() {
  const {user} = useApp();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative" ref={userDropdownRef}>
        <button
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50"
        >
          <User>{user => <img src={user?.profileUrl} alt={user?.userName} className="w-8 h-8 rounded-full" />}</User>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>

        {showUserDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900">{user?.name}</div>
              <div className="text-sm text-gray-500">@{user?.username}</div>
            </div>

            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setShowUserProfile(true);
                setShowUserDropdown(false);
              }}
            >
              <UserIcon className="h-4 w-4 mr-3" />
              Your profile
            </button>

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

      {showUserProfile && <UserProfile mode="popup" />}
    </>
  );
}
