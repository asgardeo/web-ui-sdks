'use client';

import {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {ChevronDown, Plus, Check, Building2} from 'lucide-react';
import {useApp} from '../../App';

export default function OrganizationSwitcher() {
  const {currentOrg, organizations, setCurrentOrg} = useApp();
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const orgDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
    <div className="relative" ref={orgDropdownRef}>
      <button
        onClick={() => setShowOrgDropdown(!showOrgDropdown)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-200"
      >
        <img src={currentOrg?.avatar || '/placeholder.svg'} alt={currentOrg?.name} className="w-5 h-5 rounded" />
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
  );
}
