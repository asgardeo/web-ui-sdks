# Components Overview

The Asgardeo React SDK provides a comprehensive set of components to handle authentication, user management, and organization features in your React applications. The components are organized into different categories based on their functionality.

## Component Categories

### Action Components

Action components trigger specific authentication-related actions when users interact with them.

#### Sign-In Components

- **`SignInButton`** - A customizable button that initiates the sign-in flow
- **`SignUpButton`** - A button for user registration flows
- **`SignOutButton`** - A button that handles user sign-out

These components support both render props and traditional props patterns, giving you flexibility in how you implement them.

```tsx
// Render props pattern
<SignInButton>
  {({signIn, isLoading}) => (
    <button onClick={signIn} disabled={isLoading}>
      {isLoading ? 'Signing in...' : 'Sign In'}
    </button>
  )}
</SignInButton>

// Traditional props pattern
<SignInButton className="custom-button">Sign In</SignInButton>
```

### Control Components

Control components manage the conditional rendering of content based on authentication state.

- **`SignedIn`** - Renders children only when the user is authenticated
- **`SignedOut`** - Renders children only when the user is not authenticated
- **`AsgardeoLoading`** - Shows loading state during authentication operations

```tsx
<SignedOut>
  <div>Please sign in to continue</div>
</SignedOut>

<SignedIn>
  <div>Welcome! You are signed in.</div>
</SignedIn>
```

### Presentation Components

Presentation components display user and organization information with built-in styling and functionality.

#### User Components

- **`User`** - Provides render props access to user data
- **`UserProfile`** - Displays comprehensive user profile information
- **`UserDropdown`** - A dropdown menu with user info and actions

#### Organization Components

- **`Organization`** - Displays organization information
- **`OrganizationProfile`** - Shows detailed organization profile
- **`OrganizationSwitcher`** - Allows switching between organizations
- **`OrganizationList`** - Lists available organizations
- **`CreateOrganization`** - Form for creating new organizations

#### Authentication UI Components

- **`SignIn`** - Complete sign-in form with multiple authentication options
- **`SignUp`** - User registration form

### Sign-In Options

The SDK includes specialized components for different authentication methods:

- **`IdentifierFirst`** - Username/email identification step
- **`UsernamePassword`** - Traditional username/password authentication
- **`EmailOtp`** - Email-based OTP authentication
- **`SmsOtp`** - SMS-based OTP authentication
- **`Totp`** - Time-based OTP authentication

#### Social Login Components

- **`GoogleButton`** - Google OAuth sign-in
- **`GitHubButton`** - GitHub OAuth sign-in
- **`MicrosoftButton`** - Microsoft OAuth sign-in
- **`FacebookButton`** - Facebook OAuth sign-in
- **`LinkedInButton`** - LinkedIn OAuth sign-in
- **`SignInWithEthereumButton`** - Ethereum wallet authentication
- **`SocialButton`** - Generic social provider button
- **`MultiOptionButton`** - Button supporting multiple authentication options

### Primitive Components

Primitive components are low-level UI building blocks that can be used independently:

#### Form Components
- **`Button`** - Styled button component
- **`TextField`** - Text input field
- **`PasswordField`** - Password input with visibility toggle
- **`Select`** - Dropdown select component
- **`Checkbox`** - Checkbox input
- **`DatePicker`** - Date selection component
- **`OtpField`** - OTP code input
- **`MultiInput`** - Multiple value input
- **`KeyValueInput`** - Key-value pair input

#### Layout Components
- **`Card`** - Container card component
- **`FormControl`** - Form field wrapper
- **`Divider`** - Visual separator
- **`Popover`** - Overlay component

#### Display Components
- **`Typography`** - Text styling component
- **`Avatar`** - User avatar display
- **`Logo`** - Logo component
- **`Alert`** - Alert message component
- **`Spinner`** - Loading spinner
- **`InputLabel`** - Form input labels

#### Icon Components
- **`Icons`** - Collection of icon components including `BuildingAlt` and others

### Factory Components

- **`FieldFactory`** - Dynamically creates form fields based on configuration

## Component Architecture

### Base vs. Regular Components

Many components come in two variants:

1. **Base Components** (e.g., `BaseSignInButton`, `BaseUserProfile`) - Framework-agnostic components that handle core logic
2. **Regular Components** (e.g., `SignInButton`, `UserProfile`) - React-specific wrappers that integrate with Asgardeo context

### Render Props Pattern

Many components support the render props pattern, allowing you to customize the rendering while leveraging the component's logic:

```tsx
<User>
  {(user) => (
    <div>
      <h1>Welcome, {user?.given_name}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  )}
</User>
```

### Context Integration

Components automatically integrate with the Asgardeo context providers:
- `AsgardeoProvider` - Main authentication context
- `UserProvider` - User data context
- `OrganizationProvider` - Organization context
- `ThemeProvider` - Theming context
- `BrandingProvider` - Branding customization
- `I18nProvider` - Internationalization context

## Getting Started

To use these components, wrap your application with the `AsgardeoProvider`:

```tsx
import { AsgardeoProvider, SignInButton, SignedIn, SignedOut, UserProfile } from '@asgardeo/react'

function App() {
  return (
    <AsgardeoProvider
      clientId="your-client-id"
      baseUrl="https://api.asgardeo.io/t/your-org"
    >
      <SignedOut>
        <SignInButton>Sign In</SignInButton>
      </SignedOut>
      
      <SignedIn>
        <UserProfile />
      </SignedIn>
    </AsgardeoProvider>
  )
}
```

## Browser Support

All components are designed for client-side React applications (CSR) and require a browser environment. They are not compatible with server-side rendering (SSR) environments.

## Next Steps

- [Explore Action Components](./actions/) - Learn about sign-in, sign-out, and sign-up buttons
- [Learn Control Components](./control/) - Understand conditional rendering based on auth state
- [Discover Presentation Components](./presentation/) - Explore user and organization display components
- [Customize with Primitives](./primitives/) - Use low-level UI components for custom implementations
