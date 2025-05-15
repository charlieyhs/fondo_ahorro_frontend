import {Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './components/Seguridad/PrivateRoute';
import RoleSelectionPage from './pages/RoleSelectionPage';
import { LanguageProvider } from './providers/LanguageProvider';
import GeneralLayout from './Layout/GeneralLayout';

const App = () => {
  return (
    <LanguageProvider>
      <GeneralLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/select-role" element={<RoleSelectionPage/>} />
          
          {/*Rutas protegidas */ }
          <Route path="/home" element={
            <PrivateRoute>
              <Home/>
            </PrivateRoute>
          }/>
          <Route path="/select-role" element={
            <PrivateRoute>
              <RoleSelectionPage />
            </PrivateRoute>
          }/>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </GeneralLayout>
    </LanguageProvider>
  );
}

export default App;