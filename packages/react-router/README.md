# @asgardeo/react-router

React Router integration for Asgardeo React SDK with protected routes.

[![npm version](https://img.shields.io/npm/v/@asgardeo/react-router.svg)](https://www.npmjs.com/package/@asgardeo/react-router)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Overview

`@asgardeo/react-router` is a supplementary package that provides seamless integration between Asgardeo authentication and React Router. It offers components to easily protect routes and handle authentication flows in your React applications.

## Features

- 🛡️ **ProtectedRoute Component**: Drop-in replacement for React Router's Route with built-in authentication
- ⚡ **TypeScript Support**: Full TypeScript support with comprehensive type definitions
- 🎨 **Customizable**: Flexible configuration options for different use cases
- 🔒 **Authentication Guards**: Built-in authentication checking with loading states
- 🚀 **Lightweight**: Minimal bundle size with essential features only

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
npm install @asgardeo/react react react-router
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

### 2. Custom Fallback and Loading States

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
      loader={<div className="spinner">Loading...</div>}
    >
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### 3. Integration with Layouts

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

## API Reference

### Components

#### ProtectedRoute

A component that protects routes based on authentication status. Should be used as the element prop of a Route component.

```tsx
interface ProtectedRouteProps {
  children: React.ReactElement;
  fallback?: React.ReactElement;
  redirectTo?: string;
  loader?: React.ReactNode;
}
```

**Props:**

- `children` - The component to render when authenticated
- `fallback` - Custom component to render when not authenticated (takes precedence over redirectTo)
- `redirectTo` - URL to redirect to when not authenticated (required unless fallback is provided)
- `loader` - Custom loading component to render while authentication status is being determined

**Note:** Either `fallback` or `redirectTo` must be provided to handle unauthenticated users.

## Examples

Check out our sample applications in the repository:

- [React Sample](../../samples/asgardeo-react) - Complete React application with Asgardeo authentication
- [Next.js Sample](../../samples/asgardeo-nextjs) - Next.js application example
- [Teamspace React](../../samples/teamspace-react) - Team collaboration app with React
- [Teamspace Next.js](../../samples/teamspace-nextjs) - Team collaboration app with Next.js

## TypeScript Support

This package is written in TypeScript and provides comprehensive type definitions. All components are fully typed for the best development experience.

```tsx
import type { ProtectedRouteProps } from '@asgardeo/react-router';
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
