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
      signInUrl={import.meta.env.VITE_ASGARDEO_SIGN_IN_URL}
      scopes="openid address email profile internal_userstore_create internal_userstore_view internal_userstore_update internal_userstore_delete internal_org_userstore_create internal_org_userstore_view internal_org_userstore_delete internal_org_userstore_update internal_organization_create internal_organization_view internal_organization_update internal_organization_delete internal_user_mgt_create internal_user_mgt_list internal_user_mgt_view internal_user_mgt_delete internal_user_mgt_update internal_org_user_mgt_update internal_org_user_mgt_delete internal_org_user_mgt_list internal_org_user_mgt_create internal_org_user_mgt_view internal_org_organization_update internal_org_organization_create internal_org_organization_view internal_org_organization_delete"
      preferences={{
        theme: {
          inheritFromBranding: false,
          // overrides: {
          //   colors: {
          //     primary: {
          //       main: '#1976d2', // Custom primary color
          //       contrastText: 'white',
          //     },
          //   },
          // },
          mode: 'light', // This will detect theme based on CSS classes
          // You can also use other modes:
          // mode: 'system', // Follows system preference (prefers-color-scheme)
          // mode: 'light',  // Always light
          // mode: 'dark',   // Always dark

          // For class-based detection, you can customize the class names:
          // detection: {
          //   darkClass: 'dark',  // CSS class for dark theme (default)
          //   lightClass: 'light', // CSS class for light theme (default)
          //   targetElement: document.documentElement, // Element to observe (default: <html>)
          // },

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
