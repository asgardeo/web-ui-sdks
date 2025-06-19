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
      scopes={['openid', 'address', 'email', 'profile', 'user:email', 'read:user']}
      preferences={{
        theme: {
          mode: 'light',
          overrides: {
            colors: {
              primary: {
                main: '#1976d2',
                contrastText: '#ffffff',
              },
            },
          },
        },
      }}
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>,
);
