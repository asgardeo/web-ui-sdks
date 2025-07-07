'use client';

import {UserProfile} from '@asgardeo/react';
import {ArrowLeft} from 'lucide-react';
import {useNavigate} from 'react-router';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your profile information, including your display name, email, and other details.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <UserProfile />
      </div>
    </div>
  );
}
