'use client';

import {type ReactNode} from 'react';
import Header from '../components/Header';

interface LandingLayoutProps {
  children: ReactNode;
}

export default function LandingLayout({children}: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{children}</main>
    </div>
  );
}
