# AsgardeoProvider

The `AsgardeoProvider` is the root context provider component that configures the Asgardeo React SDK and provides authentication context to your entire React application. It must wrap your application to enable authentication features.

## Overview

The `AsgardeoProvider` initializes the Asgardeo authentication client, manages authentication state, and provides context to child components through React Context. It handles token management, user sessions, organization switching, and branding preferences automatically.

## Props

All props are based on the `AsgardeoReactConfig` interface, which extends the base configuration from `@asgardeo/javascript`.

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `baseUrl` | `string` | The base URL of your Asgardeo organization. Format: `https://api.asgardeo.io/t/{org_name}` |
| `clientId` | `string` | The client ID obtained from your Asgardeo application registration |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `afterSignInUrl` | `string` | `window.location.origin` | URL to redirect users after successful sign-in. Must match configured redirect URIs in Asgardeo |
| `afterSignOutUrl` | `string` | `window.location.origin` | URL to redirect users after sign-out. Must match configured post-logout redirect URIs |
| `scopes` | `string \| string[]` | `["openid"]` | OAuth scopes to request during authentication (e.g., `"openid profile email"` or `["openid", "profile", "email"]`) |
| `organizationHandle` | `string` | Organization handle for organization-specific features like branding. Auto-derived from `baseUrl` if not provided. Required for custom domains |
| `applicationId` | `string` | UUID of the Asgardeo application for application-specific branding and features |
| `signInUrl` | `string` | Custom sign-in page URL. If provided, users will be redirected here instead of Asgardeo's default sign-in page |
| `signUpUrl` | `string` | Custom sign-up page URL. If provided, users will be redirected here instead of Asgardeo's default sign-up page |
| `clientSecret` | `string` | Client secret for confidential clients. Not recommended for browser applications |
| `tokenValidation` | `object` | Token validation configuration for ID tokens including validation flags and clock tolerance |
| Prop | Type | Description |
|------|------|-------------|
| `preferences` | `Preferences` | Configuration object for theming, internationalization, and UI customization |

### Preferences Object

The `preferences` prop allows you to customize the UI components provided by the SDK.

#### Theme Preferences (`preferences.theme`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `inheritFromBranding` | `boolean` | `true` | Whether to inherit theme from Asgardeo organization/application branding |
| `mode` | `'light' \| 'dark' \| 'system'` | `'system'` | Theme mode. `'system'` follows user's OS preference |
| `overrides` | `RecursivePartial<ThemeConfig>` | `{}` | Custom theme overrides for colors, typography, spacing, etc. |

#### Internationalization Preferences (`preferences.i18n`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `language` | `string` | Browser default | Language code for UI text (e.g., `'en-US'`, `'es-ES'`) |
| `fallbackLanguage` | `string` | `'en-US'` | Fallback language when translations aren't available |
| `bundles` | `object` | `{}` | Custom translation bundles to override default text |

## Usage

### Basic Setup

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AsgardeoProvider } from '@asgardeo/react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <AsgardeoProvider
    baseUrl="https://api.asgardeo.io/t/your-org"
    clientId="your-client-id"
  >
    <App />
  </AsgardeoProvider>
);
```

### Advanced Configuration

```tsx
import React from 'react';
import { AsgardeoProvider } from '@asgardeo/react';
import App from './App';

const config = {
  baseUrl: "https://api.asgardeo.io/t/your-org",
  clientId: "your-client-id",
  afterSignInUrl: "https://yourapp.com/dashboard",
  afterSignOutUrl: "https://yourapp.com/",
  scopes: ["openid", "profile", "email", "groups"],
  organizationHandle: "your-org",
  applicationId: "app-uuid",
  preferences: {
    theme: {
      mode: "dark",
      inheritFromBranding: true,
      overrides: {
        primary: "#6366f1",
        secondary: "#8b5cf6"
      }
    },
    i18n: {
      language: "en-US",
      bundles: {
        "en-US": {
          "signIn.title": "Welcome Back",
          "signUp.title": "Join Us"
        }
      }
    }
  }
};

function MyApp() {
  return (
    <AsgardeoProvider {...config}>
      <App />
    </AsgardeoProvider>
  );
}
```

### Environment Variables

You can use environment variables for configuration:

```tsx
const config = {
  baseUrl: process.env.REACT_APP_ASGARDEO_BASE_URL,
  clientId: process.env.REACT_APP_ASGARDEO_CLIENT_ID,
  afterSignInUrl: process.env.REACT_APP_AFTER_SIGN_IN_URL,
  afterSignOutUrl: process.env.REACT_APP_AFTER_SIGN_OUT_URL,
};
```

## Features

### Automatic State Management

The provider automatically manages:

- Authentication state (signed in/out)
- User information and profile
- Loading states during authentication operations
- Token refresh and validation
- Organization context and switching

### Branding Integration

When `preferences.theme.inheritFromBranding` is enabled (default), the provider:

- Fetches branding preferences from Asgardeo
- Applies organization/application-specific themes
- Updates theme dynamically based on branding configuration

### Error Handling

The provider includes built-in error handling for:

- Authentication failures
- Token validation errors
- Network connectivity issues
- Configuration validation

### Organization Support

For multi-organization scenarios:

- Automatically detects organization context
- Supports organization switching
- Manages organization-specific branding and settings

## Context Value

The provider makes the following context available to child components via the `useAsgardeo` hook:

```typescript
{
  // Authentication state
  isSignedIn: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  user: User | null;
  
  // Configuration
  baseUrl: string;
  organizationHandle: string;
  applicationId: string;
  signInUrl: string;
  signUpUrl: string;
  afterSignInUrl: string;
  
  // Authentication methods
  signIn: (options?: SignInOptions) => Promise<User>;
  signInSilently: (options?: SignInOptions) => Promise<User | boolean>;
  signOut: (options?: SignOutOptions) => Promise<string>;
  signUp: (payload?: SignUpPayload) => Promise<void | SignUpResponse>;
  
  // Organization methods
  organization: Organization;
  
  // Utility methods
  fetch: (url: string, options?: RequestConfig) => Promise<Response>;
}
```

## Best Practices

1. **Wrap at the root**: Place the provider as high as possible in your component tree
2. **Environment-based config**: Use environment variables for different deployment environments
3. **Error boundaries**: Implement error boundaries to handle authentication errors gracefully
4. **Loading states**: Use the `isLoading` state to show appropriate loading indicators
5. **Secure redirects**: Ensure redirect URLs are properly configured in Asgardeo console

## Common Issues

### Redirect URI Mismatch

Ensure `afterSignInUrl` matches exactly with the redirect URIs configured in your Asgardeo application.

### CORS Issues

Make sure your domain is allowed in the Asgardeo application's allowed origins.

### Token Validation Errors

Check that your `baseUrl` is correct and accessible, and consider adjusting `tokenValidation.idToken.clockTolerance` if needed.

## TypeScript Support

The provider is fully typed with TypeScript. Import the types for better development experience:

```typescript
import { AsgardeoProvider, AsgardeoProviderProps } from '@asgardeo/react';

const config: AsgardeoProviderProps = {
  baseUrl: "https://api.asgardeo.io/t/your-org",
  clientId: "your-client-id"
};
```

## Related

- [`useAsgardeo`](./USE_ASGARDEO.md) - Hook to access authentication context
- [`SignIn`](./SIGN_IN.md) - Sign-in component
- [`SignOut`](./SIGN_OUT.md) - Sign-out component
- [Theming Guide](../guides/theming.md) - Customizing component appearance
- [Organization Management](../guides/organizations.md) - Working with organizations
