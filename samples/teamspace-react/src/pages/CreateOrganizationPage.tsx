'use client';

import {useNavigate} from 'react-router-dom';
import {CreateOrganization} from '@asgardeo/react';
import {ArrowLeft} from 'lucide-react';

export default function CreateOrganizationPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/organizations')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to organizations
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create a new organization</h1>
        <p className="text-gray-600 mt-2">
          Organizations are shared accounts where teams can collaborate across many projects at once.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CreateOrganization />
      </div>
    </div>
  );
}
