'use client';

import {Link} from 'react-router-dom';
import {useApp} from '../App';
import {Building2, Users, Settings, Crown, Shield, User, Plus, ExternalLink} from 'lucide-react';

export default function Organizations() {
  const {organizations, currentOrg, setCurrentOrg} = useApp();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (role) {
      case 'owner':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'admin':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600 mt-2">Manage your organizations and switch between them</p>
        </div>
        <Link
          to="/organizations/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Organization
        </Link>
      </div>

      {/* Current Organization */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Organization</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={currentOrg?.avatar || '/placeholder.svg'}
                alt={currentOrg?.name}
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900">{currentOrg?.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={getRoleBadge(currentOrg?.role || 'member')}>
                    {getRoleIcon(currentOrg?.role || 'member')}
                    <span className="ml-1 capitalize">{currentOrg?.role}</span>
                  </span>
                  <span className="text-sm text-gray-500">{currentOrg?.memberCount} members</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <ExternalLink className="h-4 w-4 mr-2" />
                View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* All Organizations */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Organizations</h2>
        <div className="space-y-4">
          {organizations.map(org => (
            <div
              key={org.id}
              className={`bg-white rounded-lg shadow-sm border p-6 ${
                currentOrg?.id === org.id ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={org.avatar || '/placeholder.svg'} alt={org.name} className="w-12 h-12 rounded-lg" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{org.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={getRoleBadge(org.role)}>
                        {getRoleIcon(org.role)}
                        <span className="ml-1 capitalize">{org.role}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        <Users className="h-3 w-3 inline mr-1" />
                        {org.memberCount} members
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {currentOrg?.id !== org.id && (
                    <button
                      onClick={() => setCurrentOrg(org)}
                      className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                    >
                      Switch to
                    </button>
                  )}
                  {currentOrg?.id === org.id && (
                    <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700">
                      Current
                    </span>
                  )}
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organization Invitations (if any) */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Invitations</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No pending invitations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
