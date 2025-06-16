'use client';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {useState, createContext, useContext} from 'react';
import Header from './components/Header';
import DashboardPage from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import OrganizationsPage from './pages/Organizations';
import CreateOrganizationPage from './pages/CreateOrganization';
import SignInPage from './pages/SignIn';
import LandingPage from './pages/LandingPage';
import {SignedIn} from '@asgardeo/react';

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
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/organizations" element={<OrganizationsPage />} />
              <Route path="/organizations/new" element={<CreateOrganizationPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
