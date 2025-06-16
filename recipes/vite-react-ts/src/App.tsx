'use client';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {useState, createContext, useContext} from 'react';
import DashboardPage from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import OrganizationsPage from './pages/Organizations';
import CreateOrganizationPage from './pages/CreateOrganization';
import SignInPage from './pages/SignIn';
import LandingPage from './pages/LandingPage';
import LandingLayout from './layouts/LandingLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  username: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
  memberCount: number;
}

// Context
interface AppContextType {
  user: User | null;
  currentOrg: Organization | null;
  organizations: Organization[];
  setCurrentOrg: (org: Organization) => void;
  addOrganization: (org: Organization) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// Mock data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/placeholder.svg?height=32&width=32',
  username: 'johndoe',
};

const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Acme Corp',
    slug: 'acme-corp',
    avatar: '/placeholder.svg?height=32&width=32',
    role: 'owner',
    memberCount: 12,
  },
  {
    id: '2',
    name: 'Tech Startup',
    slug: 'tech-startup',
    avatar: '/placeholder.svg?height=32&width=32',
    role: 'admin',
    memberCount: 8,
  },
];

function App() {
  const [user] = useState<User>(mockUser);
  const [currentOrg, setCurrentOrg] = useState<Organization>(mockOrganizations[0]);
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);

  const addOrganization = (org: Organization) => {
    setOrganizations(prev => [...prev, org]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentOrg,
        organizations,
        setCurrentOrg,
        addOrganization,
      }}
    >
      <Router>
        <Routes>
          {/* Landing/Public Routes */}
          <Route path="/" element={
            <LandingLayout>
              <LandingPage />
            </LandingLayout>
          } />
          
          {/* Auth Routes */}
          <Route path="/signin" element={
            <AuthenticatedLayout>
              <SignInPage />
            </AuthenticatedLayout>
          } />
          
          {/* Dashboard/Protected Routes */}
          <Route path="/dashboard" element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          } />
          <Route path="/profile" element={
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          } />
          <Route path="/organizations" element={
            <DashboardLayout>
              <OrganizationsPage />
            </DashboardLayout>
          } />
          <Route path="/organizations/new" element={
            <DashboardLayout>
              <CreateOrganizationPage />
            </DashboardLayout>
          } />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
