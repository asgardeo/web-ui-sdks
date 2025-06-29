---
applyTo: '**'
---

# `@asgardeo/react` SDK Documentation

## Quick Start

1. Add `<AsgardeoProvider />` to your app

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AsgardeoProvider } from '@asgardeo/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AsgardeoProvider
      baseUrl: '<your-organization-name>'
      clientId: '<your-app-client-id>'
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>
)
```
