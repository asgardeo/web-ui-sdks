# Components Overview

The Asgardeo React SDK provides a comprehensive set of components to handle authentication, user management, and organization features in your React applications. The components are organized into different categories based on their functionality.

## Root Components

Root components are the entry points for integrating Asgardeo authentication into your React application. They provide the necessary context and configuration for the SDK.

- **`AsgardeoProvider`** - The main provider component that wraps your application, providing authentication context and configuration.

## Action Components

Action components trigger specific authentication-related actions when users interact with them.

### Sign-In Components

- **`SignInButton`** - A customizable button that initiates the sign-in flow
- **`SignUpButton`** - A button for user registration flows
- **`SignOutButton`** - A button that handles user sign-out

These components support both render props and traditional props patterns, giving you flexibility in how you implement them.

## Control Components

Control components manage the conditional rendering of content based on authentication state.

- **`SignedIn`** - Renders children only when the user is authenticated
- **`SignedOut`** - Renders children only when the user is not authenticated
- **`Loading`** - Shows loading state during authentication operations

## Presentation Components

Presentation components display user and organization information with built-in styling and functionality.

### User Components

- **`User`** - Provides render props access to user data
- **`UserProfile`** - Displays comprehensive user profile information
- **`UserDropdown`** - A dropdown menu with user info and actions

### Organization Components

- **`Organization`** - Displays organization information
- **`OrganizationProfile`** - Shows detailed organization profile
- **`OrganizationSwitcher`** - Allows switching between organizations
- **`OrganizationList`** - Lists available organizations
- **`CreateOrganization`** - Form for creating new organizations

### Authentication UI Components

- **`SignIn`** - Complete sign-in form with multiple authentication options
- **`SignUp`** - User registration form

## Next Steps

- [Explore Action Components](./actions/) - Learn about sign-in, sign-out, and sign-up buttons
- [Learn Control Components](./control/) - Understand conditional rendering based on auth state
- [Discover Presentation Components](./presentation/) - Explore user and organization display components
- [Customize with Primitives](./primitives/) - Use low-level UI components for custom implementations
