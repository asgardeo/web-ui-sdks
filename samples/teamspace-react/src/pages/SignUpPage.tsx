'use client';

import {Users} from 'lucide-react';
import {SignUp} from '@asgardeo/react';
import {useNavigate} from 'react-router-dom';

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-2xl font-bold text-gray-900">Teamspace</span>
          </a>
        </div>

        <SignUp shouldRedirectAfterSignUp={false} onComplete={() => navigate('/signin')} />

        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
