import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AsgardeoProvider } from '@asgardeo/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AsgardeoProvider baseUrl='https://api.asgardeo.io/t/dxlab' clientId='xQaqfpl7y3vuaBuFZugAwQDai0Aa'>
      <App />
    </AsgardeoProvider>
  </StrictMode>,
)
