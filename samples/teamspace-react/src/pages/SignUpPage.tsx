'use client';

import {Users} from 'lucide-react';
import {SignUp} from '@asgardeo/react';
import {useNavigate} from 'react-router-dom';

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
