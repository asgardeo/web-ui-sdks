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
          mode: 'dark', // or 'light' or 'system'
          overrides: {
            colors: {
              surface: '#2d2d2d',
              text: {
                primary: '#ffffff',
                secondary: '#b3b3b3',
              },
              border: '#404040',
            },
            spacing: {
              unit: 10, // larger spacing
            },
            borderRadius: {
              medium: '12px', // more rounded corners
            },
          },
        },
      }}
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>,
);
