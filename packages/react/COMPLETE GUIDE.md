# @asgardeo/react - Complete Guide

A comprehensive guide to building React applications with Asgardeo authentication using the official Asgardeo React SDK.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Core Concepts](#core-concepts)
- [Components](#components)
- [Hooks](#hooks)
- [Advanced Usage](#advanced-usage)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)

## Overview

The `@asgardeo/react` SDK enables seamless authentication integration in React applications using Asgardeo Identity Server. It provides:

- **Drop-in Components**: Pre-built UI components for authentication flows
- **React Hooks**: Programmatic access to authentication state and methods
- **Context Providers**: Global state management for authentication
- **Customizable UI**: Theming and styling options
- **TypeScript Support**: Full type safety and IntelliSense
- **Modern React**: Support for React 16.8+ with hooks

## Installation

```bash
# Using npm
npm install @asgardeo/react

# Using pnpm
pnpm add @asgardeo/react

# Using yarn
yarn add @asgardeo/react
```

### Peer Dependencies

The SDK requires the following peer dependencies:

```json
{
  "@types/react": ">=16.8.0",
  "react": ">=16.8.0"
}
```

## Quick Start

### 1. Set Up the Provider

Wrap your application with `AsgardeoProvider` in your main entry file:

#### Basic Setup

```tsx
// main.tsx or index.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AsgardeoProvider } from '@asgardeo/react'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AsgardeoProvider
      baseUrl="https://api.asgardeo.io/t/your-org"
      clientId="your-client-id"
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>
)
```

#### Advanced Setup

```tsx
// main.tsx or index.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AsgardeoProvider } from '@asgardeo/react'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AsgardeoProvider
      baseUrl="https://api.asgardeo.io/t/your-org"
      clientId="your-client-id"
      afterSignInUrl="http://localhost:3000/dashboard"
      afterSignOutUrl="http://localhost:3000"
      scopes={['openid', 'profile', 'email']}
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>
)
```

### 2. Build Your App

Use the authentication components and hooks in your application:

```tsx
// App.tsx
import { SignedIn, SignedOut, SignInButton, SignOutButton, User } from '@asgardeo/react'

function App() {
  return (
    <div className="app">
      <SignedIn>
        <div className="authenticated-content">
          <User>
            {({ user }) => (
              <div className="welcome-message">
                <h1>Welcome, {user.givenname}!</h1>
                <p>{user.email}</p>
              </div>
            )}
          </User>
          <SignOutButton />
        </div>
      </SignedIn>
      
      <SignedOut>
        <div className="public-content">
          <h1>Welcome to Our App</h1>
          <p>Please sign in to continue</p>
          <SignInButton />
        </div>
      </SignedOut>
    </div>
  )
}

export default App
```

## Configuration

### AsgardeoProvider Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `baseUrl` | `string` | ✅ | Your Asgardeo organization URL |
| `clientId` | `string` | ✅ | Your application's client ID |
| `afterSignInUrl` | `string` | ❌ | Redirect URL after successful sign-in |
| `afterSignOutUrl` | `string` | ❌ | Redirect URL after sign-out |
| `scopes` | `string[]` | ❌ | OAuth 2.0 scopes (default: `['openid', 'profile']`) |
| `preferences` | `object` | ❌ | Theme and UI customization options |

### Environment Variables

For better security and flexibility, use environment variables:

```tsx
// .env
VITE_ASGARDEO_BASE_URL=https://api.asgardeo.io/t/your-org
VITE_ASGARDEO_CLIENT_ID=your-client-id
VITE_ASGARDEO_AFTER_SIGN_IN_URL=http://localhost:3000/dashboard
VITE_ASGARDEO_AFTER_SIGN_OUT_URL=http://localhost:3000

// main.tsx
<AsgardeoProvider
  baseUrl={import.meta.env.VITE_ASGARDEO_BASE_URL}
  clientId={import.meta.env.VITE_ASGARDEO_CLIENT_ID}
  afterSignInUrl={import.meta.env.VITE_ASGARDEO_AFTER_SIGN_IN_URL}
  afterSignOutUrl={import.meta.env.VITE_ASGARDEO_AFTER_SIGN_OUT_URL}
  scopes={['openid', 'profile', 'email']}
>
  <App />
</AsgardeoProvider>
```

## Core Concepts

### Authentication State

The SDK manages authentication state globally through React Context:

- **Loading State**: While determining authentication status
- **Signed In**: User is authenticated with valid tokens
- **Signed Out**: User is not authenticated
- **Error State**: Authentication errors or failures

### Token Management

Automatic handling of:
- Access tokens for API calls
- ID tokens for user information
- Refresh tokens for session management
- Token renewal and expiration

### User Context

Access to user information including:
- Profile data (name, email, etc.)
- Claims and attributes
- Authentication metadata

## Components

### Control Components

#### SignedIn

Renders children only when the user is authenticated:

```tsx
import { SignedIn } from '@asgardeo/react'

<SignedIn>
  <div>This content is only visible to authenticated users</div>
</SignedIn>
```

#### SignedOut

Renders children only when the user is not authenticated:

```tsx
import { SignedOut } from '@asgardeo/react'

<SignedOut>
  <div>Please sign in to access this application</div>
</SignedOut>
```

#### Loading

Shows content while authentication state is being determined:

```tsx
import { Loading } from '@asgardeo/react'

<Loading>
  <div>Checking authentication status...</div>
</Loading>
```

#### Loaded

Shows content after authentication state has been determined:

```tsx
import { Loaded } from '@asgardeo/react'

<Loaded>
  <div>Authentication check complete</div>
</Loaded>
```

### Action Components

#### SignInButton

Pre-built sign-in button:

```tsx
import { SignInButton } from '@asgardeo/react'

// Basic usage
<SignInButton />

// With custom styling
<SignInButton className="custom-signin-btn" />

// With custom text
<SignInButton>
  Log In to Your Account
</SignInButton>
```

#### SignOutButton

Pre-built sign-out button:

```tsx
import { SignOutButton } from '@asgardeo/react'

// Basic usage
<SignOutButton />

// With custom styling
<SignOutButton className="custom-signout-btn" />

// With custom text
<SignOutButton>
  Log Out
</SignOutButton>
```

#### SignUpButton

Pre-built sign-up button:

```tsx
import { SignUpButton } from '@asgardeo/react'

<SignUpButton />
```

### Presentation Components

#### User

Access user information with render props:

```tsx
import { User } from '@asgardeo/react'

<User>
  {({ user, isLoading, error }) => {
    if (isLoading) return <div>Loading user...</div>
    if (error) return <div>Error: {error.message}</div>
    
    return (
      <div>
        <img src={user.photourl} alt={user.username} />
        <h2>{user.givenname} {user.familyname}</h2>
        <p>{user.email}</p>
      </div>
    )
  }}
</User>
```

#### UserProfile

Complete user profile component:

```tsx
import { UserProfile } from '@asgardeo/react'

// Basic usage
<UserProfile />

// With custom styling
<UserProfile className="custom-profile" />
```

#### UserDropdown

User menu dropdown component:

```tsx
import { UserDropdown } from '@asgardeo/react'

<UserDropdown />
```

#### SignIn

Complete sign-in form component:

```tsx
import { SignIn } from '@asgardeo/react'

<SignIn 
  onSuccess={(authData) => {
    console.log('Sign-in successful:', authData)
    // Handle successful sign-in
  }}
  onError={(error) => {
    console.error('Sign-in failed:', error)
    // Handle sign-in error
  }}
/>
```

#### SignUp

Complete sign-up form component:

```tsx
import { SignUp } from '@asgardeo/react'

<SignUp 
  onSuccess={(authData) => {
    console.log('Sign-up successful:', authData)
  }}
  onError={(error) => {
    console.error('Sign-up failed:', error)
  }}
/>
```

### Primitive Components

The SDK includes low-level UI primitives for building custom interfaces:

- `Button` - Customizable button component
- `TextField` - Text input field
- `PasswordField` - Password input with visibility toggle
- `Card` - Container component
- `Alert` - Message display component
- `Spinner` - Loading indicator
- `Typography` - Text styling component

```tsx
import { Button, TextField, Card } from '@asgardeo/react'

<Card>
  <TextField placeholder="Enter your email" />
  <Button>Submit</Button>
</Card>
```

## Hooks

### useAsgardeo

Main hook for accessing authentication state and methods:

```tsx
import { useAsgardeo } from '@asgardeo/react'

function MyComponent() {
  const {
    user,
    isSignedIn,
    isLoading,
    error,
    signIn,
    signOut,
    getAccessToken,
    getIdToken,
    refreshTokens
  } = useAsgardeo()

  const handleProtectedApiCall = async () => {
    try {
      const token = await getAccessToken()
      const response = await fetch('/api/protected', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('API call failed:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {isSignedIn ? (
        <div>
          <h1>Welcome, {user?.givenname}!</h1>
          <button onClick={handleProtectedApiCall}>
            Call Protected API
          </button>
          <button onClick={() => signOut()}>
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={() => signIn()}>
          Sign In
        </button>
      )}
    </div>
  )
}
```

### useUser

Access user-specific data and operations:

```tsx
import { useUser } from '@asgardeo/react'

function UserComponent() {
  const { user, isLoading, error, refreshUser } = useUser()

  if (isLoading) return <div>Loading user data...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>{user.givenname} {user.familyname}</h2>
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
      <button onClick={refreshUser}>
        Refresh User Data
      </button>
    </div>
  )
}
```

### useTheme

Access and customize theme settings:

```tsx
import { useTheme } from '@asgardeo/react'

function ThemedComponent() {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <p>Current theme mode: {theme.mode}</p>
      <button onClick={() => setTheme({ mode: 'dark' })}>
        Switch to Dark Mode
      </button>
    </div>
  )
}
```

### useI18n

Internationalization support:

```tsx
import { useI18n } from '@asgardeo/react'

function LocalizedComponent() {
  const { t, language, setLanguage } = useI18n()

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.description')}</p>
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  )
}
```

## Advanced Usage

### Custom Authentication Flow

For advanced use cases, you can implement custom authentication flows:

```tsx
import { BaseSignIn } from '@asgardeo/react'

function CustomSignIn() {
  const handleInitialize = async () => {
    // Custom initialization logic
    return await initializeCustomAuth()
  }

  const handleSubmit = async (payload) => {
    // Custom authentication handling
    return await handleCustomAuth(payload)
  }

  const handleSuccess = (authData) => {
    // Custom success handling
    console.log('Authentication successful:', authData)
    // Redirect or update UI
  }

  const handleError = (error) => {
    // Custom error handling
    console.error('Authentication failed:', error)
    // Show error message
  }

  return (
    <BaseSignIn
      onInitialize={handleInitialize}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      onError={handleError}
      className="custom-signin-form"
    />
  )
}
```

### Protected Routes

Implement route protection with React Router:

```tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAsgardeo } from '@asgardeo/react'

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoading } = useAsgardeo()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// Usage
<Routes>
  <Route path="/login" element={<SignInPage />} />
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
</Routes>
```

### API Integration

Integrate with protected APIs:

```tsx
import { useAsgardeo } from '@asgardeo/react'

function useApi() {
  const { getAccessToken } = useAsgardeo()

  const apiCall = async (url, options = {}) => {
    const token = await getAccessToken()
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }

    return response.json()
  }

  return { apiCall }
}

// Usage in component
function DataComponent() {
  const { apiCall } = useApi()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await apiCall('/api/user-data')
      setData(result)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
```

### Theme Customization

Customize the appearance of components:

```tsx
const customTheme = {
  mode: 'light',
  overrides: {
    colors: {
      primary: {
        main: '#1976d2',
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#dc004e',
        contrastText: '#ffffff'
      }
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    spacing: {
      unit: 8
    }
  }
}

<AsgardeoProvider
  // ... other props
  preferences={{
    theme: customTheme
  }}
>
  <App />
</AsgardeoProvider>
```

### Error Handling

Implement comprehensive error handling:

```tsx
import { useAsgardeo } from '@asgardeo/react'

function ErrorBoundary({ children }) {
  const { error, isLoading } = useAsgardeo()

  if (error) {
    return (
      <div className="error-container">
        <h2>Authentication Error</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  return children
}

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        {/* Your app content */}
      </div>
    </ErrorBoundary>
  )
}
```

## Examples

### Complete Dashboard App

```tsx
import { 
  AsgardeoProvider, 
  SignedIn, 
  SignedOut, 
  useAsgardeo, 
  User,
  SignInButton,
  SignOutButton 
} from '@asgardeo/react'

// Main App Component
function App() {
  return (
    <AsgardeoProvider
      baseUrl={import.meta.env.VITE_ASGARDEO_BASE_URL}
      clientId={import.meta.env.VITE_ASGARDEO_CLIENT_ID}
      afterSignInUrl="/dashboard"
      afterSignOutUrl="/"
      scopes={['openid', 'profile', 'email']}
    >
      <Layout />
    </AsgardeoProvider>
  )
}

// Layout Component
function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SignedIn>
          <Dashboard />
        </SignedIn>
        <SignedOut>
          <LandingPage />
        </SignedOut>
      </main>
    </div>
  )
}

// Header Component
function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">My App</h1>
        
        <SignedIn>
          <div className="flex items-center space-x-4">
            <User>
              {({ user }) => (
                <span>Welcome, {user.givenname}!</span>
              )}
            </User>
            <SignOutButton className="btn btn-outline" />
          </div>
        </SignedIn>
        
        <SignedOut>
          <SignInButton className="btn btn-primary" />
        </SignedOut>
      </div>
    </header>
  )
}

// Dashboard Component
function Dashboard() {
  const { user, getAccessToken } = useAsgardeo()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const token = await getAccessToken()
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const userData = await response.json()
      setData(userData)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Profile Information</h3>
            <p><strong>Name:</strong> {user?.givenname} {user?.familyname}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Username:</strong> {user?.username}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Additional Data</h3>
            {loading ? (
              <p>Loading...</p>
            ) : data ? (
              <pre className="text-sm bg-gray-100 p-2 rounded">
                {JSON.stringify(data, null, 2)}
              </pre>
            ) : (
              <p>No additional data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Landing Page Component
function LandingPage() {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to My App
        </h1>
        <p className="text-xl text-gray-600">
          A secure application powered by Asgardeo
        </p>
      </div>
      
      <div className="space-y-4">
        <SignInButton className="btn btn-primary btn-lg">
          Get Started - Sign In
        </SignInButton>
        <p className="text-sm text-gray-500">
          Don't have an account? Contact your administrator.
        </p>
      </div>
    </div>
  )
}

export default App
```

### Multi-Step Authentication Flow

```tsx
import { BaseSignIn, useFlow } from '@asgardeo/react'

function MultiStepAuth() {
  const { currentStep, messages } = useFlow()

  const handleInitialize = async () => {
    return await initializeAuthFlow()
  }

  const handleSubmit = async (payload) => {
    return await processAuthStep(payload)
  }

  const handleSuccess = (authData) => {
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }

  const handleError = (error) => {
    console.error('Authentication error:', error)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>
        
        {messages.map((message, index) => (
          <div key={index} className={`alert alert-${message.type.toLowerCase()}`}>
            {message.message}
          </div>
        ))}
        
        <BaseSignIn
          onInitialize={handleInitialize}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          onError={handleError}
          className="signin-form"
        />
        
        <div className="auth-footer">
          <p>Step {currentStep?.stepType || 1} of the authentication process</p>
        </div>
      </div>
    </div>
  )
}
```

## Troubleshooting

### Common Issues

#### 1. "useAsgardeo must be used within AsgardeoProvider"

**Problem**: Hook is used outside of provider context.

**Solution**: Ensure your component is wrapped with `AsgardeoProvider`:

```tsx
// ❌ Wrong
function App() {
  const { isSignedIn } = useAsgardeo() // Error!
  return <div>App</div>
}

// ✅ Correct
function App() {
  return (
    <AsgardeoProvider baseUrl="..." clientId="...">
      <MyComponent />
    </AsgardeoProvider>
  )
}

function MyComponent() {
  const { isSignedIn } = useAsgardeo() // Works!
  return <div>Component</div>
}
```

#### 2. Infinite loading state

**Problem**: Authentication state never resolves.

**Solution**: Check configuration and network connectivity:

```tsx
// Add error handling
const { isLoading, error } = useAsgardeo()

if (error) {
  console.error('Auth error:', error)
  // Handle error appropriately
}
```

#### 3. CORS errors

**Problem**: Cross-origin requests blocked.

**Solution**: Configure CORS in your Asgardeo application settings or use a proxy during development.

#### 4. Token expiration

**Problem**: API calls fail due to expired tokens.

**Solution**: Implement automatic token refresh:

```tsx
const { refreshTokens, getAccessToken } = useAsgardeo()

const apiCall = async (url, options) => {
  try {
    const token = await getAccessToken()
    return await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    })
  } catch (error) {
    if (error.status === 401) {
      await refreshTokens()
      const newToken = await getAccessToken()
      return await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${newToken}`,
          ...options.headers
        }
      })
    }
    throw error
  }
}
```

### Debugging Tips

1. **Enable Debug Logs**: Set up console logging for authentication events
2. **Check Network Tab**: Verify API calls and responses
3. **Validate Configuration**: Ensure all required props are provided
4. **Test in Incognito**: Rule out cache/storage issues
5. **Check Asgardeo Console**: Verify application configuration

## API Reference

For complete API documentation including all components, hooks, and customization options, see [API.md](./API.md).

### Key Exports

```typescript
// Providers
export { AsgardeoProvider } from '@asgardeo/react'

// Hooks
export { useAsgardeo, useUser, useTheme, useI18n } from '@asgardeo/react'

// Control Components
export { SignedIn, SignedOut, Loading, Loaded } from '@asgardeo/react'

// Action Components
export { SignInButton, SignOutButton, SignUpButton } from '@asgardeo/react'

// Presentation Components
export { SignIn, SignUp, User, UserProfile, UserDropdown } from '@asgardeo/react'

// Primitive Components
export { Button, TextField, Card, Alert, Spinner } from '@asgardeo/react'
```

### TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type { 
  AsgardeoProviderProps,
  User,
  AuthState,
  SignInOptions,
  ThemeConfig 
} from '@asgardeo/react'
```

---

## Support

- **Documentation**: [Complete API Reference](./API.md)
- **GitHub Issues**: [Report bugs or request features](https://github.com/asgardeo/web-ui-sdks/issues)
- **Community**: [Join the discussion](https://github.com/asgardeo/web-ui-sdks/discussions)

## License

This project is licensed under the Apache License 2.0. See [LICENSE](../../LICENSE) for details.
