import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import {AsgardeoProvider} from '@asgardeo/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AsgardeoProvider
      baseUrl={import.meta.env.VITE_ASGARDEO_BASE_URL}
      clientId={import.meta.env.VITE_ASGARDEO_CLIENT_ID}
      scopes={['openid', 'address', 'email', 'profile']}
      preferences={{
        theme: {
          mode: 'light',
          overrides: {
            colors: {
              primary: {
                main: '#6200ea',
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
