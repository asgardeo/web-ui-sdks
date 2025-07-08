# AsgardeoProvider

The `AsgardeoProvider` is the root context provider component that configures the Asgardeo React SDK and provides authentication context to your entire React application. It must wrap your application to enable authentication features.

## Overview

The `AsgardeoProvider` initializes the Asgardeo authentication client, manages authentication state, and provides context to child components through React Context. It handles token management, user sessions, organization switching, and branding preferences automatically.

## Props

All props are based on the `AsgardeoReactConfig` interface, which extends the base configuration from `@asgardeo/javascript`.

### Required Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `baseUrl` | `string` | **REQUIRED** | The base URL of your Asgardeo organization. Format: `https://api.asgardeo.io/t/{org_name}` |
| `clientId` | `string` | **REQUIRED** | The client ID obtained from your Asgardeo application registration |
| `afterSignInUrl` | `string` | `window.location.origin` | URL to redirect users after successful sign-in. Must match configured redirect URIs in Asgardeo |
| `afterSignOutUrl` | `string` | `window.location.origin` | URL to redirect users after sign-out. Must match configured post-logout redirect URIs |
| `scopes` | `string \| string[]` | `openid profile internal_login` | OAuth scopes to request during authentication (e.g., `"openid profile email"` or `["openid", "profile", "email"]`) |
| `organizationHandle` | `string` | - | Organization handle for organization-specific features like branding. Auto-derived from `baseUrl` if not provided. Required for custom domains |
| `applicationId` | `string` | - | UUID of the Asgardeo application for application-specific branding and features |
| `signInUrl` | `string` | - | Custom sign-in page URL. If provided, users will be redirected here instead of Asgardeo's default sign-in page |
| `signUpUrl` | `string` | - | Custom sign-up page URL. If provided, users will be redirected here instead of Asgardeo's default sign-up page |
| `clientSecret` | `string` | - | Client secret for confidential clients. Not recommended for browser applications |
| `tokenValidation` | [TokenValidation](#tokenvalidation) | - | Token validation configuration for ID tokens including validation flags and clock tolerance |
| `preferences` | [Preferences](#preferences) | - | Configuration object for theming, internationalization, and UI customization |

<details>

<summary><h4>TokenValidation</h4></summary>

The `tokenValidation` prop allows you to configure how ID tokens are validated.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `idToken` | `IdTokenValidation` | `{}` | Configuration for ID token validation |

#### IdTokenValidation

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `validate` | `boolean` | `true` | Whether to validate the ID token |
| `validateIssuer` | `boolean` | `true` | Whether to validate the issuer |
| `clockTolerance` | `number` | `300` | Allowed clock skew in seconds |

</details>

<details>

<summary><h4>Preferences</h4></summary>

The `preferences` prop allows you to customize the UI components provided by the SDK.

#### Theme Preferences (`preferences.theme`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `inheritFromBranding` | `boolean` | `true` | Whether to inherit theme from Asgardeo organization/application branding |
| `mode` | `'light' \| 'dark' \| 'system'` | `'system'` | Theme mode. `'system'` follows user's OS preference |
| `overrides` | `ThemeConfig` | `{}` | Custom theme overrides for colors, typography, spacing, etc. |

#### Internationalization Preferences (`preferences.i18n`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `language` | `string` | Browser default | Language code for UI text (e.g., `'en-US'`, `'es-ES'`) |
| `fallbackLanguage` | `string` | `'en-US'` | Fallback language when translations aren't available |
| `bundles` | `object` | `{}` | Custom translation bundles to override default text |

</details>

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

function MyApp() {
  return (
    <AsgardeoProvider
      baseUrl="https://api.asgardeo.io/t/your-org"
      clientId="your-client-id"
      afterSignInUrl="https://yourapp.com/dashboard"
      afterSignOutUrl="https://yourapp.com/"
      scopes={["openid", "profile", "email", "groups"]}
      organizationHandle="your-org"
      applicationId="app-uuid"
      preferences={{
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
      }}
    >
      <App />
    </AsgardeoProvider>
  );
}
```

### Environment Variables

You can use environment variables for configuration:

```tsx
<AsgardeoProvider
  baseUrl={process.env.REACT_APP_ASGARDEO_BASE_URL}
  clientId={process.env.REACT_APP_ASGARDEO_CLIENT_ID}
>
  <App />
</AsgardeoProvider>
```
