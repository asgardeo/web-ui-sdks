# `@asgardeo/react` API Documentation

This document provides complete API documentation for the Asgardeo React SDK, including all components, hooks, and customization options.

## Table of Contents

- [Components](#components)
  - [AsgardeoProvider](#asgardeyprovider)
  - [SignIn](#signin)
  - [SignedIn](#signedin)
  - [SignedOut](#signedout)
  - [SignInButton](#signinbutton)
  - [SignOutButton](#signoutbutton)
  - [User](#user)
  - [UserProfile](#userprofile)
- [Hooks](#hooks)
  - [useAsgardeo](#useasgardeo)
- [Customization](#customization)

## Components

### AsgardeoProvider

The root provider component that configures the Asgardeo SDK and provides authentication context to your React application.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `baseUrl` | `string` | Yes | Your Asgardeo organization URL |
| `clientId` | `string` | Yes | Your application's client ID |
| `afterSignInUrl` | `string` | No | URL to redirect after sign in (defaults to current URL) |
| `afterSignOutUrl` | `string` | No | URL to redirect after sign out (defaults to current URL) |
| `scopes` | `string[] | string` | No | OAuth scopes to request (defaults to `['openid', 'profile']`) |
| `storage` | `'localStorage' \| 'sessionStorage'` | No | Storage mechanism for tokens (defaults to `'localStorage'`) |

#### Example

```diff
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
+ import { AsgardeoProvider } from '@asgardeo/react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
+     <AsgardeoProvider
+       baseUrl="https://api.asgardeo.io/t/your-org"
+       clientId="your-client-id"
+       afterSignInUrl="/dashboard"
+       afterSignOutUrl="/"
+       scopes={['openid', 'profile', 'email']}
+     >
        <App />
+     </AsgardeoProvider>
  </StrictMode>
);
```

**Customization:** See [Customization](#customization) section for theming and styling options. The provider doesn't render any visual elements but can be styled through CSS custom properties.

#### Available CSS Classes
This component doesn't render any HTML elements with CSS classes. Configuration is handled through props and CSS custom properties.

---

### SignIn

A comprehensive sign-in component that renders a complete sign-in interface with customizable styling and behavior.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | No | CSS class name for styling the sign-in container |
| `redirectUrl` | `string` | No | URL to redirect after successful sign-in |
| `onSignInStart` | `() => void` | No | Callback fired when sign-in process starts |
| `onSignInSuccess` | `(user: User) => void` | No | Callback fired when sign-in is successful |
| `onSignInError` | `(error: Error) => void` | No | Callback fired when sign-in fails |
| `buttonText` | `string` | No | Custom text for the sign-in button (defaults to "Sign In") |
| `loadingText` | `string` | No | Text to show while signing in (defaults to "Signing in...") |
| `disabled` | `boolean` | No | Whether the sign-in interface is disabled |

#### Example

```diff
+ import { SignIn } from '@asgardeo/react';

const SignInPage = () => {
  const handleSignInSuccess = (user) => {
    console.log('User signed in:', user.username);
    // Redirect to dashboard or update UI
  };

  const handleSignInError = (error) => {
    console.error('Sign-in failed:', error.message);
    // Show error message to user
  };

  return (
    <div className="signin-container">
      <h1>Welcome Back</h1>
+       <SignIn 
+         className="custom-signin"
+         redirectUrl="/dashboard"
+         buttonText="Login with Asgardeo"
+         onSignInSuccess={handleSignInSuccess}
+         onSignInError={handleSignInError}
+       />
    </div>
  );
};

export default SignInPage;
```

**Customization:** See [Customization](#customization) for comprehensive styling and theming options.

#### Available CSS Classes
- `.asgardeo-signin` - Main sign-in container
- `.asgardeo-signin--small` - Small size variant
- `.asgardeo-signin--large` - Large size variant  
- `.asgardeo-signin--outlined` - Outlined variant
- `.asgardeo-signin--filled` - Filled variant
- `.asgardeo-signin__input` - Input field elements
- `.asgardeo-signin__input--small` - Small input variant
- `.asgardeo-signin__input--large` - Large input variant
- `.asgardeo-signin__button` - Sign-in button element
- `.asgardeo-signin__button--small` - Small button variant
- `.asgardeo-signin__button--large` - Large button variant
- `.asgardeo-signin__button--outlined` - Outlined button variant
- `.asgardeo-signin__button--filled` - Filled button variant
- `.asgardeo-signin__error` - Error message container
- `.asgardeo-signin__messages` - Messages container

---

### SignedIn

A conditional rendering component that only displays its children when the user is authenticated.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | Yes | Content to render when user is signed in |
| `fallback` | `React.ReactNode` | No | Content to render while loading |

#### Example

```diff
+ import { SignedIn } from '@asgardeo/react';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

const App = () => {
  return (
    <div className="app">
+       <SignedIn fallback={
+         <div className="loading-container">
+           <LoadingSpinner />
+           <p>Checking authentication...</p>
+         </div>
+       }>
        <Dashboard />
+       </SignedIn>
    </div>
  );
};

export default App;
```

**Customization:** See [Customization](#customization) for styling the fallback loading state.

#### Available CSS Classes
This component doesn't render any HTML elements with CSS classes. It conditionally renders children or fallback content.

---

### SignedOut

A conditional rendering component that only displays its children when the user is not authenticated.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | Yes | Content to render when user is signed out |

#### Example

```diff
+ import { SignedOut } from '@asgardeo/react';
import LandingPage from './components/LandingPage';
import Hero from './components/Hero';

const App = () => {
  return (
    <div className="app">
+       <SignedOut>
        <Hero />
        <LandingPage />
+       </SignedOut>
    </div>
  );
};

export default App;
```

**Customization:** See [Customization](#customization) for styling options.

#### Available CSS Classes
This component doesn't render any HTML elements with CSS classes. It conditionally renders children when user is signed out.

---

### SignInButton

A pre-built button component that triggers the sign-in flow when clicked.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | No | Custom button content (defaults to "Sign In") |
| `className` | `string` | No | CSS class name for styling |
| `disabled` | `boolean` | No | Whether the button is disabled |
| `onClick` | `() => void` | No | Additional click handler |

#### Example

```diff
+ import { SignInButton } from '@asgardeo/react';

const LoginPage = () => {
  const handleClick = () => {
    console.log('Sign-in button clicked');
  };

  return (
    <div className="login-page">
      <h1>Welcome to Our App</h1>
      <p>Please sign in to continue</p>
      
+       <SignInButton 
+         className="custom-signin-btn"
+         onClick={handleClick}
+       >
+         🔐 Log In to Continue
+       </SignInButton>
    </div>
  );
};

export default LoginPage;
```

**Customization:** See [Customization](#customization) for theming and styling the sign-in button.

#### Available CSS Classes
- `.asgardeo-sign-in-button` - Main sign-in button element

---

### SignOutButton

A pre-built button component that triggers the sign-out flow when clicked.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | No | Custom button content (defaults to "Sign Out") |
| `className` | `string` | No | CSS class name for styling |
| `disabled` | `boolean` | No | Whether the button is disabled |
| `onClick` | `() => void` | No | Additional click handler |

#### Example

```diff
+ import { SignOutButton } from '@asgardeo/react';

const UserMenu = () => {
  const handleSignOut = () => {
    console.log('User signed out');
    // Additional cleanup logic
  };

  return (
    <div className="user-menu">
      <h3>Account Settings</h3>
      
+       <SignOutButton 
+         className="custom-signout-btn"
+         onClick={handleSignOut}
+       >
+         🚪 Logout
+       </SignOutButton>
    </div>
  );
};

export default UserMenu;
```

**Customization:** See [Customization](#customization) for theming and styling the sign-out button.

#### Available CSS Classes
- `.asgardeo-sign-out-button` - Main sign-out button element

---

### User

A render prop component that provides access to the current user's information.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `({ user, isLoading, error }) => React.ReactNode` | Yes | Render function that receives user data |

#### Render Props

| Prop | Type | Description |
|------|------|-------------|
| `user` | `User \| null` | Current user object |
| `isLoading` | `boolean` | Whether user data is being loaded |
| `error` | `Error \| null` | Any error that occurred while fetching user data |

#### User Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `sub` | `string` | User's unique identifier |
| `username` | `string` | Username |
| `email` | `string` | Email address |
| `givenname` | `string` | First name |
| `familyname` | `string` | Last name |
| `photourl` | `string` | Profile picture URL |

#### Example

```diff
+ import { User } from '@asgardeo/react';

const UserProfile = () => {
  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      
+       <User>
+         {({ user, isLoading, error }) => {
          if (isLoading) {
            return (
              <div className="loading">
                <div className="spinner" />
                <p>Loading user information...</p>
              </div>
            );
          }
          
          if (error) {
            return (
              <div className="error">
                <p>Error loading user: {error.message}</p>
                <button onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </div>
            );
          }
          
          if (!user) {
            return <div className="no-user">No user data available</div>;
          }
          
          return (
            <div className="user-card">
              <img 
                src={user.photourl || '/default-avatar.png'} 
                alt={user.username}
                className="avatar"
              />
              <h2>{user.givenname} {user.familyname}</h2>
              <p className="username">@{user.username}</p>
              <p className="email">{user.email}</p>
            </div>
          );
+         }}
+       </User>
    </div>
  );
};

export default UserProfile;
```

**Customization:** See [Customization](#customization) for styling user information displays.

#### Available CSS Classes
This component doesn't render any HTML elements with CSS classes. It uses render props to provide user data to children.

---

### UserProfile

A pre-built component that displays a formatted user profile card.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | No | CSS class name for styling |
| `showEmail` | `boolean` | No | Whether to display email (defaults to `true`) |
| `showAvatar` | `boolean` | No | Whether to display profile picture (defaults to `true`) |
| `avatarSize` | `'sm' \| 'md' \| 'lg'` | No | Size of the avatar (defaults to `'md'`) |

#### Example

```diff
+ import { UserProfile } from '@asgardeo/react';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>My Dashboard</h1>
        
        <div className="user-section">
+           <UserProfile 
+             className="header-profile"
+             showEmail={false}
+             avatarSize="sm"
+           />
        </div>
      </div>
    </header>
  );
};

const ProfileCard = () => {
  return (
    <div className="profile-card-container">
      <h2>Profile Information</h2>
      
+       <UserProfile 
+         className="detailed-profile"
+         showEmail={true}
+         avatarSize="lg"
+       />
    </div>
  );
};

export { Header, ProfileCard };
```

**Customization:** See [Customization](#customization) for comprehensive styling options for the user profile component.

#### Available CSS Classes
- `.asgardeo-user-profile` - Main user profile container element

---

## Hooks

### useAsgardeo

The main hook that provides access to all authentication functionality and state.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current user object |
| `isSignedIn` | `boolean` | Whether user is authenticated |
| `isLoading` | `boolean` | Whether authentication state is being determined |
| `error` | `Error \| null` | Any authentication error |
| `signIn` | `(redirectUrl?: string) => Promise<void>` | Function to initiate sign in |
| `signOut` | `(redirectUrl?: string) => Promise<void>` | Function to sign out |
| `getAccessToken` | `() => Promise<string \| null>` | Get current access token |
| `getIdToken` | `() => Promise<string \| null>` | Get current ID token |
| `refreshTokens` | `() => Promise<void>` | Refresh authentication tokens |

#### Example

```diff
+ import { useAsgardeo } from '@asgardeo/react';
import { useState } from 'react';

const AuthenticatedApp = () => {
+   const { 
+     user, 
+     isSignedIn, 
+     isLoading, 
+     error,
+     signIn, 
+     signOut,
+     getAccessToken 
+   } = useAsgardeo();
  
  const [apiData, setApiData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  const handleApiCall = async () => {
    try {
      setApiLoading(true);
      const token = await getAccessToken();
      
      const response = await fetch('/api/protected-data', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setApiData(data);
    } catch (err) {
      console.error('API call failed:', err);
    } finally {
      setApiLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut('/goodbye');
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Initializing authentication...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-screen">
        <h2>Authentication Error</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      {isSignedIn ? (
        <div className="authenticated-content">
          <header className="app-header">
            <h1>Welcome, {user?.givenname}!</h1>
            <button className="sign-out-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </header>
          
          <main className="main-content">
            <div className="api-section">
              <button 
                className="api-btn" 
                onClick={handleApiCall}
                disabled={apiLoading}
              >
                {apiLoading ? 'Loading...' : 'Fetch Protected Data'}
              </button>
              
              {apiData && (
                <pre className="api-response">
                  {JSON.stringify(apiData, null, 2)}
                </pre>
              )}
            </div>
          </main>
        </div>
      ) : (
        <div className="landing-page">
          <h1>Welcome to Our App</h1>
          <p>Please sign in to access your dashboard</p>
          <button className="sign-in-btn" onClick={() => signIn('/dashboard')}>
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthenticatedApp;
```

---

## Customization

The Asgardeo React SDK provides multiple ways to customize the appearance and behavior of components to match your application's design system.

### CSS Classes and Styling

All components accept a `className` prop that allows you to apply custom CSS styles:

```tsx
<SignInButton className="btn btn-primary">
  Sign In
</SignInButton>

<UserProfile className="user-card shadow-lg" />
```

### Default CSS Classes

Components come with default CSS classes that you can target for styling:

- `.asgardeo-signin-button` - Sign in button
- `.asgardeo-signout-button` - Sign out button  
- `.asgardeo-user-profile` - User profile container
- `.asgardeo-user-avatar` - User avatar image
- `.asgardeo-user-info` - User information container

### CSS Custom Properties (CSS Variables)

The SDK supports CSS custom properties for consistent theming:

```css
:root {
  --asgardeo-primary-color: #007bff;
  --asgardeo-primary-hover: #0056b3;
  --asgardeo-border-radius: 8px;
  --asgardeo-font-family: 'Inter', sans-serif;
  --asgardeo-button-padding: 12px 24px;
  --asgardeo-avatar-size-sm: 32px;
  --asgardeo-avatar-size-md: 48px;
  --asgardeo-avatar-size-lg: 64px;
}
```

### Custom Button Content

Replace default button text with custom content:

```tsx
<SignInButton>
  <span className="icon">🔐</span>
  Login with Asgardeo
</SignInButton>

<SignOutButton>
  <LogoutIcon />
  Sign Out
</SignOutButton>
```

### Bring your own UI Library

For applications using popular UI libraries, you can easily integrate Asgardeo components:

#### Material-UI Integration
```tsx
import { Button } from '@mui/material'
import { useAsgardeo } from '@asgardeo/react'

function CustomSignInButton() {
  const { signIn } = useAsgardeo()
  
  return (
    <Button 
      variant="contained" 
      color="primary"
      onClick={() => signIn()}
    >
      Sign In with Asgardeo
    </Button>
  )
}
```

#### Tailwind CSS Integration
```tsx
<SignInButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Sign In
</SignInButton>
```

### Custom Loading States

Customize loading indicators for better user experience:

```tsx
<SignedIn fallback={
  <div className="flex items-center justify-center">
    <Spinner />
    <span>Authenticating...</span>
  </div>
}>
  <Dashboard />
</SignedIn>
```

### Advanced Customization with Render Props

Use the `User` component for complete control over user data presentation:

```tsx
<User>
  {({ user, isLoading }) => (
    <div className="custom-user-card">
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="user-details">
          <Avatar src={user?.photourl} size="large" />
          <div>
            <h3>{user?.givenname} {user?.familyname}</h3>
            <Badge>{user?.email}</Badge>
          </div>
        </div>
      )}
    </div>
  )}
</User>
```

### Configuration-Based Customization

Customize behavior through the `AsgardeoProvider` configuration:

```tsx
<AsgardeoProvider
  baseUrl="https://api.asgardeo.io/t/your-org"
  clientId="your-client-id"
  // Customize redirect URLs
  afterSignInUrl="/dashboard"
  // Customize sign-out URL
  afterSignOutUrl="/goodbye"
  // Specify OAuth scopes
  scopes={['openid', 'profile', 'email', 'groups']}
  // Customize storage
  storage="sessionStorage"
>
  <App />
</AsgardeoProvider>
```

This comprehensive customization approach ensures that Asgardeo components can seamlessly integrate with any design system or UI framework while maintaining functionality and accessibility standards.
