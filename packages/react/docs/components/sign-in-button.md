# SignInButton

The `SignInButton` component provides a pre-built, customizable button that handles user authentication through the Asgardeo identity provider. It supports both render props and traditional props patterns, making it flexible for various UI implementations.

## Overview

The `SignInButton` component automatically integrates with the Asgardeo authentication context and handles the sign-in flow including loading states, error handling, and redirection. It leverages the `useAsgardeo` hook to access authentication methods and can be customized with preferences for internationalization and theming.

## Basic Usage

### Traditional Props Pattern

```tsx
import React from 'react';
import { SignInButton } from '@asgardeo/react';

function LoginPage() {
  return (
    <div>
      <h1>Welcome to Our App</h1>
      <SignInButton>Sign In</SignInButton>
    </div>
  );
}
```

### With Custom Styling

```tsx
import React from 'react';
import { SignInButton } from '@asgardeo/react';

function CustomLoginPage() {
  return (
    <SignInButton 
      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      style={{ fontSize: '16px', fontWeight: 'bold' }}
    >
      Get Started
    </SignInButton>
  );
}
```

## Advanced Usage

### Render Props Pattern

The render props pattern gives you full control over the button's appearance and behavior while still leveraging the authentication logic:

```tsx
import React from 'react';
import { SignInButton } from '@asgardeo/react';

function AdvancedLoginPage() {
  return (
    <SignInButton>
      {({ signIn, isLoading }) => (
        <button 
          onClick={signIn} 
          disabled={isLoading}
          className="custom-auth-button"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Signing in...
            </>
          ) : (
            <>
              <LoginIcon />
              Sign In with Asgardeo
            </>
          )}
        </button>
      )}
    </SignInButton>
  );
}
```

### Custom Click Handler

```tsx
import React from 'react';
import { SignInButton } from '@asgardeo/react';

function TrackingLoginPage() {
  const handleSignInClick = (event) => {
    // Track analytics event
    analytics.track('sign_in_button_clicked');
    console.log('User initiated sign-in process');
  };

  return (
    <SignInButton onClick={handleSignInClick}>
      Sign In
    </SignInButton>
  );
}
```

### Component-Level Internationalization

```tsx
import React from 'react';
import { SignInButton } from '@asgardeo/react';

function LocalizedLoginPage() {
  return (
    <SignInButton
      preferences={{
        i18n: {
          bundles: {
            'es-ES': {
              translations: {
                'elements.buttons.signIn': 'Iniciar Sesión'
              }
            },
            'fr-FR': {
              translations: {
                'elements.buttons.signIn': 'Se Connecter'
              }
            }
          }
        }
      }}
    >
      {/* Will use localized text from preferences */}
    </SignInButton>
  );
}
```

## Props

The `SignInButton` component accepts all standard HTML button attributes plus the following:

### SignInButtonProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode \| ((props: RenderProps) => ReactNode)` | Localized "Sign In" text | Button content or render function |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | - | Custom click handler called after sign-in initiation |
| `className` | `string` | - | Additional CSS classes to apply to the button |
| `style` | `CSSProperties` | - | Inline styles to apply to the button |
| `preferences` | `Preferences` | - | Component-level configuration for theming and internationalization |
| `disabled` | `boolean` | `false` | Whether the button is disabled (overridden during loading) |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | HTML button type |

### Render Props

When using the render props pattern, the function receives the following props:

| Prop | Type | Description |
|------|------|-------------|
| `signIn` | `() => Promise<void>` | Function to initiate the sign-in process |
| `isLoading` | `boolean` | Whether the sign-in process is currently in progress |

## Preferences

The `preferences` prop allows you to customize the component's behavior and appearance.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `i18n` | `I18nConfig` | - | Internationalization configuration for custom translations |
| `theme` | `ThemeConfig` | - | Theme configuration for styling customization |

### I18nConfig

| Property | Type | Description |
|----------|------|-------------|
| `bundles` | `Record<string, { translations: Record<string, string> }>` | Translation bundles keyed by locale |

For the SignInButton, the relevant translation key is:

- `elements.buttons.signIn` - The default button text


## Behavior

### Authentication Flow

1. **Initial State**: Button displays with default or custom text
2. **Click Event**: User clicks the button, triggering the sign-in process
3. **Loading State**: Button becomes disabled and shows loading indicator
4. **Navigation**: User is redirected to Asgardeo sign-in page or custom sign-in URL
5. **Completion**: After successful authentication, user returns to the application

### Custom Sign-In URL

If a `signInUrl` is configured in the `AsgardeoProvider`, the button will navigate to that URL instead of initiating the OAuth flow directly:

```tsx
// In your AsgardeoProvider configuration
<AsgardeoProvider 
  signInUrl="/custom-login"
  // ... other props
>
  <App />
</AsgardeoProvider>
```

### Error Handling

The component automatically handles sign-in errors and throws an `AsgardeoRuntimeError` with detailed information:

```tsx
// Error details include:
// - Error message
// - Error code: 'SignInButton-handleSignIn-RuntimeError-001'
// - Package: 'react'
// - User-friendly message
```

## Accessibility

The `SignInButton` component includes accessibility features:

- **Keyboard Navigation**: Fully keyboard accessible
- **Screen Readers**: Proper ARIA attributes and semantic HTML
- **Loading States**: Disabled state prevents multiple submissions
- **Focus Management**: Maintains focus states for keyboard users

## Integration with BaseSignInButton

The `SignInButton` is built on top of `BaseSignInButton`, which provides the core functionality. If you need more control or want to build a custom implementation, you can use `BaseSignInButton` directly:

```tsx
import React, { useState } from 'react';
import { BaseSignInButton } from '@asgardeo/react';
import { useAsgardeo } from '@asgardeo/react';

function CustomSignInButton() {
  const { signIn } = useAsgardeo();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseSignInButton 
      signIn={handleSignIn}
      isLoading={isLoading}
    >
      Custom Sign In Implementation
    </BaseSignInButton>
  );
}
```

## Best Practices

### 1. Consistent Styling

Maintain consistent button styling across your application:

```tsx
// Create a styled wrapper
const StyledSignInButton = styled(SignInButton)`
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  
  &:hover {
    background: var(--primary-hover-color);
  }
`;
```

### 2. Loading States

Always provide clear feedback during the sign-in process:

```tsx
<SignInButton>
  {({ isLoading }) => (
    <>
      {isLoading && <LoadingSpinner />}
      {isLoading ? 'Signing in...' : 'Sign In'}
    </>
  )}
</SignInButton>
```

### 3. Error Boundaries

Wrap your authentication components in error boundaries to handle potential errors gracefully:

```tsx
<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <SignInButton>Sign In</SignInButton>
</ErrorBoundary>
```

### 4. Responsive Design

Ensure your sign-in button works well on all device sizes:

```tsx
<SignInButton className="w-full md:w-auto px-4 py-2 text-sm md:text-base">
  Sign In
</SignInButton>
```

## Common Issues

### Button Not Working

- Ensure `AsgardeoProvider` is properly configured and wrapping your component
- Check that all required configuration props are provided
- Verify network connectivity and Asgardeo service availability

### Custom Styling Not Applied

- Check CSS specificity and ensure your styles are not being overridden
- Use browser developer tools to inspect the rendered element
- Consider using CSS-in-JS solutions or CSS modules for better style isolation

### Translation Not Showing

- Verify the translation key `elements.buttons.signIn` exists in your bundles
- Check that the locale is correctly set in your preferences
- Ensure the `preferences` prop is passed correctly

## Related Components

- [`AsgardeoProvider`](./asgardeo-provider.md) - Required context provider for authentication
- [`BaseSignInButton`](#integration-with-basesigninbutton) - Lower-level component for custom implementations
- [`SignOutButton`](./sign-out-button.md) - Companion component for signing out users
