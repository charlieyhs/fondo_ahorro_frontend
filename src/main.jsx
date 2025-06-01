import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { BrowserRouter  as Router } from 'react-router-dom'
import './utils/translate.js'
import { ClientProvider } from './providers/ClientProvider.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
      <ClientProvider>
        <App />
      </ClientProvider>
  </Router>
)
