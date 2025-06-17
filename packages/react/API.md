# `@asgardeo/react` API Documentation

This document provides complete API documentation for the Asgardeo React SDK, including all components, hooks, and customization options.

## Table of Contents

- [Components](#components)
  - [AsgardeoProvider](#asgardeyprovider)
  - [SignedIn](#signedin)
  - [SignedOut](#signedout)
  - [SignIn](#signin)
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

```tsx
<AsgardeoProvider
  baseUrl="https://api.asgardeo.io/t/your-org"
  clientId="your-client-id"
>
  <App />
</AsgardeoProvider>
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

```tsx
<SignIn />
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

```tsx
<SignedIn fallback={<div>Checking authentication...</div>}>
  <Dashboard />
</SignedIn>
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

```tsx
<SignedOut>
  <LandingPage />
</SignedOut>
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

```tsx
<SignInButton className="custom-signin-btn">
  Log In to Continue
</SignInButton>
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

```tsx
<SignOutButton className="custom-signout-btn">
  Logout
</SignOutButton>
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

```tsx
<User>
  {({ user, isLoading, error }) => {
    if (isLoading) return <div>Loading user...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!user) return <div>No user data</div>
    
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

```tsx
<UserProfile 
  className="custom-profile"
  showEmail={false}
  avatarSize="lg"
/>
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
    getAccessToken 
  } = useAsgardeo()

  const handleApiCall = async () => {
    const token = await getAccessToken()
    // Use token for API calls
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {isSignedIn ? (
        <div>
          <h1>Welcome, {user?.givenname}!</h1>
          <button onClick={() => signOut()}>Sign Out</button>
          <button onClick={handleApiCall}>Call API</button>
        </div>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  )
}
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

### Theme Integration

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
