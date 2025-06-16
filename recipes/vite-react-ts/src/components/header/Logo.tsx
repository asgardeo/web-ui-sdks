'use client';

import {Link} from 'react-router-dom';
import {Users} from 'lucide-react';

interface LogoProps {
  to?: string;
  className?: string;
}

export default function Logo({to = '/', className = ''}: LogoProps) {
  return (
    <Link to={to} className={`flex items-center space-x-2 ${className}`}>
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <Users className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-bold text-gray-900">Teamspace</span>
    </Link>
  );
}
