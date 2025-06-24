import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';
import {AsgardeoProvider} from '@asgardeo/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AsgardeoProvider
      baseUrl={import.meta.env.VITE_ASGARDEO_BASE_URL}
      afterSignInUrl={import.meta.env.VITE_ASGARDEO_AFTER_SIGN_IN_URL}
      afterSignOutUrl={import.meta.env.VITE_ASGARDEO_AFTER_SIGN_OUT_URL}
      clientId={import.meta.env.VITE_ASGARDEO_CLIENT_ID}
      scopes={[
        'openid',
        'address',
        'email',
        'profile',
        'user:email',
        'read:user',
        'internal_organization_create',
        'internal_organization_view',
        'internal_organization_update',
        'internal_organization_delete',
      ]}
      preferences={{
        theme: {
          mode: 'light',
          // overrides: {
          //   colors: {
          //     primary: {
          //       main: 'var(--color-blue-600)',
          //     },
          //   },
          // },
        },
      }}
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>,
);
