import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { BrowserRouter  as Router } from 'react-router-dom'
import './utils/translate.js'
import { AuthProvider } from './providers/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
  </Router>
)
