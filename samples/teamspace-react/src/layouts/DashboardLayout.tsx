'use client';

import {type ReactNode} from 'react';
import Header from '../components/Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({children}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-4">{children}</main>
    </div>
  );
}
