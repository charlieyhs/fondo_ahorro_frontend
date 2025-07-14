import {Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './components/Seguridad/PrivateRoute';
import RoleSelectionPage from './pages/RoleSelectionPage';
import { LanguageProvider } from './providers/LanguageProvider';
import GeneralLayout from './Layout/GeneralLayout';
import { AuthProvider } from './providers/LoginProvider';
import { useAuth } from './hooks/useAuth';
import { UserProvider } from './providers/UserProvider';

const App = () => {

  const { isAuthenticated } = useAuth();


  return (
    <LanguageProvider>
      <GeneralLayout>
        <Routes>
          <Route path="/" element={
              isAuthenticated()
                ? <Navigate to="/home" replace />
                : <Navigate to="/login" replace />
            }
          />
          <Route path="/login" element={
            <AuthProvider>
              <Login />
            </AuthProvider>
          }/>
          
          {/*Rutas con usuario */ }
          <Route path="/home" element={
            <PrivateRoute>
              <UserProvider>
                <Home />
              </UserProvider>
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