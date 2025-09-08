import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { BrowserRouter  as Router } from 'react-router-dom'
import './utils/translate.js'
import { ClientProvider } from './providers/ClientProvider.jsx'
import { createTheme, ThemeProvider } from '@mui/material'
import { GREEN_COLOR, PRINCIPAL_COLOR, SELECTED_COLOR_OPTION } from './css/General.js'

const theme = createTheme({
    palette:{
        success: {
          main: GREEN_COLOR,
        }
    },
    components: {
      MuiRadio: {
        styleOverrides: {
          root: {
            '&.Mui-checked': {
              color: PRINCIPAL_COLOR, // color cuando está seleccionado (puedes usar theme.palette.primary.main)
            },
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            '&.Mui-active': {
              color: PRINCIPAL_COLOR,
            },
            '&.Mui-completed': {
              color: GREEN_COLOR,
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: SELECTED_COLOR_OPTION
            },
            "&.Mui-selected:hover": {
              backgroundColor: PRINCIPAL_COLOR,
              color: "#fff"
            }
          }
        }
      }
    }
});


createRoot(document.getElementById('root')).render(
  <Router>
      <ClientProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </ClientProvider>
  </Router>
)
