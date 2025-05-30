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
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>,
);
