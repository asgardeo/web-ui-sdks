import ReactDOM from 'react-dom/client';
import App from './App.js';
import {AsgardeoProvider, UIAuthConfig} from '@asgardeo/react';

const envVariables = import.meta.env;

const config: UIAuthConfig = {
  baseUrl: envVariables.VITE_BASE_URL,
  clientId: envVariables.VITE_CLIENT_ID,
  scope: envVariables.VITE_SCOPE?.split(','),
  afterSignInUrl: envVariables.VITE_SIGN_IN_REDIRECT_URL,
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AsgardeoProvider
    config={config}
    branding={{
      preference: {
        theme: {LIGHT: {colors: {primary: {main: '#111111'}}}},
      },
    }}
  >
    <App />
  </AsgardeoProvider>,
);
