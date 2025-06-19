# @asgardeo/react-router

React Router integration for Asgardeo React SDK with protected routes and authentication guards.

[![npm version](https://img.shields.io/npm/v/@asgardeo/react-router.svg)](https://www.npmjs.com/package/@asgardeo/react-router)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Overview

`@asgardeo/react-router` is a supplementary package that provides seamless integration between Asgardeo authentication and React Router. It offers components and hooks to easily protect routes and handle authentication flows in your React applications.

## Features

- 🛡️ **ProtectedRoute Component**: Drop-in replacement for React Router's Route with built-in authentication
- 🔒 **withAuthentication HOC**: Higher-order component for protecting any React component
- 🪝 **Authentication Hooks**: Powerful hooks for custom authentication logic
- 🔄 **Return URL Handling**: Automatic redirect back to intended destination after sign-in
- ⚡ **TypeScript Support**: Full TypeScript support with comprehensive type definitions
- 🎨 **Customizable**: Flexible configuration options for different use cases

## Installation

```bash
npm install @asgardeo/react-router
# or
yarn add @asgardeo/react-router
# or
pnpm add @asgardeo/react-router
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install @asgardeo/react react react-router-dom
```

## Quick Start

### 1. Basic Setup with ProtectedRoute

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AsgardeoProvider } from '@asgardeo/react';
import { ProtectedRoute } from '@asgardeo/react-router';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import SignIn from './components/SignIn';

function App() {
  return (
    <AsgardeoProvider
      baseUrl="https://api.asgardeo.io/t/your-org"
      clientId="your-client-id"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Public Home Page</div>} />
          <Route path="/signin" element={<SignIn />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute redirectTo="/signin">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute redirectTo="/signin">
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AsgardeoProvider>
  );
}

export default App;
```

### 2. Custom Fallback and Redirects

```tsx
import { ProtectedRoute } from '@asgardeo/react-router';

// Redirect to custom login page
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute redirectTo="/login">
      <Dashboard />
    </ProtectedRoute>
  }
/>

// Custom fallback component
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute fallback={
      <div className="auth-required">
        <h2>Please sign in</h2>
        <p>You need to be signed in to access this page.</p>
      </div>
    }>
      <Dashboard />
    </ProtectedRoute>
  }
/>

// Custom loading state
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute 
      redirectTo="/signin"
      loadingElement={<div className="spinner">Loading...</div>}
    >
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## API Reference

### Components

#### ProtectedRoute

A component that protects routes based on authentication status. Should be used as the element prop of a Route component.

```tsx
interface ProtectedRouteProps {
  children: React.ReactElement;
  fallback?: React.ReactElement;
  redirectTo?: string;
  showLoading?: boolean;
  loadingElement?: React.ReactElement;
}
```

**Props:**

- `children` - The component to render when authenticated
- `fallback` - Custom component to render when not authenticated (takes precedence over redirectTo)
- `redirectTo` - URL to redirect to when not authenticated (required unless fallback is provided)
- `showLoading` - Whether to show loading state (default: `true`)
- `loadingElement` - Custom loading component

**Note:** Either `fallback` or `redirectTo` must be provided to handle unauthenticated users.

#### withAuthentication

Higher-order component that wraps any component with authentication protection.

```tsx
import { withAuthentication } from '@asgardeo/react-router';

const Dashboard = () => <div>Protected Dashboard</div>;

const ProtectedDashboard = withAuthentication(Dashboard, {
  redirectTo: '/login'
});

// With role-based access
const AdminPanel = withAuthentication(AdminPanelComponent, {
  additionalCheck: (authContext) => {
    return authContext.user?.groups?.includes('admin');
  },
  fallback: <div>Access denied</div>
});
```

### Hooks

#### useAuthGuard

Hook that provides authentication guard functionality for routes.

```tsx
import { useAuthGuard } from '@asgardeo/react-router';

function Dashboard() {
  const { isAllowed, isLoading } = useAuthGuard({
    redirectTo: '/login'
  });

  if (isLoading) return <div>Loading...</div>;
  if (!isAllowed) return null; // Will redirect

  return <div>Protected Dashboard Content</div>;
}
```

**Options:**

- `redirectTo` - Path to redirect when not authenticated (default: `'/login'`)
- `preserveReturnUrl` - Whether to preserve current location as return URL (default: `true`)
- `additionalCheck` - Additional authorization check function
- `immediate` - Whether to check immediately on mount (default: `true`)

**Returns:**

- `isAllowed` - Whether user can access the route
- `isLoading` - Whether authentication is being checked
- `isAuthenticated` - Whether user is signed in
- `meetsAdditionalChecks` - Whether additional checks pass
- `authContext` - Full Asgardeo authentication context
- `checkAuth()` - Function to manually trigger auth check

#### useReturnUrl

Hook for handling return URLs after authentication.

```tsx
import { useReturnUrl } from '@asgardeo/react-router';
import { useAsgardeo } from '@asgardeo/react';

function LoginPage() {
  const { returnTo, navigateToReturnUrl } = useReturnUrl();
  const { signIn } = useAsgardeo();

  const handleSignIn = async () => {
    await signIn();
    navigateToReturnUrl(); // Redirects to original destination
  };

  return (
    <div>
      <button onClick={handleSignIn}>Sign In</button>
      {returnTo && <p>You'll be redirected to: {returnTo}</p>}
    </div>
  );
}
```

**Returns:**

- `returnTo` - The URL to return to after authentication
- `navigateToReturnUrl(fallback?)` - Function to navigate to return URL
- `hasReturnUrl` - Whether a return URL is available

## Advanced Usage

### Role-Based Access Control

```tsx
import { withAuthentication } from '@asgardeo/react-router';

const AdminPanel = withAuthentication(AdminPanelComponent, {
  additionalCheck: (authContext) => {
    const userRoles = authContext.user?.groups || [];
    return userRoles.includes('admin') || userRoles.includes('moderator');
  },
  fallback: (
    <div>
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
    </div>
  )
});
```

### Custom Authentication Flow

```tsx
import { useAuthGuard } from '@asgardeo/react-router';

function CustomProtectedPage() {
  const { isAllowed, authContext, checkAuth } = useAuthGuard({
    immediate: false, // Don't redirect immediately
    additionalCheck: (auth) => auth.user?.email_verified === true
  });

  if (!authContext.isSignedIn) {
    return (
      <div>
        <h2>Sign In Required</h2>
        <button onClick={() => authContext.signIn()}>
          Sign In
        </button>
      </div>
    );
  }

  if (!authContext.user?.email_verified) {
    return (
      <div>
        <h2>Email Verification Required</h2>
        <p>Please verify your email before accessing this page.</p>
      </div>
    );
  }

  return <div>Protected Content</div>;
}
```

### Integration with Layouts

```tsx
import { ProtectedRoute } from '@asgardeo/react-router';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Protected routes with layout */}
        <Route path="/app" element={<AppLayout />}>
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute redirectTo="/signin">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute redirectTo="/signin">
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute redirectTo="/signin">
                <Settings />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## Examples

Check out our [examples directory](./examples) for complete working examples:

- [Basic Protected Routes](./examples/basic)
- [Role-Based Access Control](./examples/rbac)
- [Custom Authentication Flow](./examples/custom-flow)
- [Integration with Next.js](./examples/nextjs)

## TypeScript Support

This package is written in TypeScript and provides comprehensive type definitions. All components and hooks are fully typed for the best development experience.

```tsx
import type { ProtectedRouteProps, WithAuthenticationOptions } from '@asgardeo/react-router';
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://wso2.com/asgardeo/docs/sdks/react/)
- 💬 [Community Forum](https://stackoverflow.com/questions/tagged/asgardeo)
- 🐛 [Issues](https://github.com/asgardeo/web-ui-sdks/issues)

---

Built with ❤️ by the [Asgardeo](https://wso2.com/asgardeo/) team.
