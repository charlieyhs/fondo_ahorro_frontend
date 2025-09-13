import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './components/Seguridad/PrivateRoute';
import RoleSelectionPage from './pages/RoleSelectionPage';
import { LanguageProvider } from './providers/LanguageProvider';
import GeneralLayout from './Layout/GeneralLayout';
import { AuthProvider } from './providers/LoginProvider';
import { useAuth } from './hooks/useAuth';
import { UserProvider } from './providers/UserProvider';
import Members from './pages/Members';
import MoneyContributions from './pages/MoneyContributions';
import NotFound from './pages/NotFound';
import PropTypes from 'prop-types';
import RateHistory from './pages/RateHistory';
import MoneyBoxes from './pages/MoneyBoxes';
import MoneyTransactionType from './pages/MoneyTransactionType';
import Loan from './pages/Loan';
import Investment from './pages/Investment';

const ProtectedRouteWithUser = ({ children }) => (
  <PrivateRoute>
    <UserProvider>
      {children}
    </UserProvider>
  </PrivateRoute>
);

ProtectedRouteWithUser.propTypes ={
    children : PropTypes.node.isRequired
}

const LoginRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (isAuthenticated()) {
    const from = location.state?.from?.pathname || '/home';
    return <Navigate to={from} replace />;
  }
  
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
};

const App = () => {

  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  return (
    <LanguageProvider>
      <GeneralLayout>
        <Routes>
          <Route path='/' element={
              isAuthenticated()
                ? <Navigate to='/home' replace />
                : <Navigate to='/login' replace state={{ from: location }}/>
            }
          />
          <Route path='/login' element={<LoginRoute />}/>
          
          {/*Rutas con usuario */ }
          <Route path='/home' element={
            <ProtectedRouteWithUser>
                <Home />
            </ProtectedRouteWithUser>
          }/>

          <Route path='/members' element={
            <ProtectedRouteWithUser>
                <Members />
            </ProtectedRouteWithUser>
          }/>

          <Route path='/moneyboxes' element={
            <ProtectedRouteWithUser>
                <MoneyBoxes />
            </ProtectedRouteWithUser>
          }/>
          
          <Route path='/moneytransactiontype' element={
            <ProtectedRouteWithUser>
                <MoneyTransactionType/>
            </ProtectedRouteWithUser>
          }/>

          <Route path='/loan' element={
            <ProtectedRouteWithUser>
                <Loan/>
            </ProtectedRouteWithUser>
          }/>

          <Route path='/moneycontributions' element={
            <ProtectedRouteWithUser>
                <MoneyContributions/>
            </ProtectedRouteWithUser>
          }/>
          
          <Route path='/ratehistory' element={
            <ProtectedRouteWithUser>
                <RateHistory/>
            </ProtectedRouteWithUser>
          }/>

          <Route path='/select-role' element={
            <PrivateRoute>
              <RoleSelectionPage />
            </PrivateRoute>
          }/>

          <Route path='/investment' element={
            <ProtectedRouteWithUser>
              <Investment />
            </ProtectedRouteWithUser>
          }/>

          <Route path='/404' element={<NotFound />} />
          
          <Route path='*' element={
            isAuthenticated()
              ? <Navigate to='/404' replace />
              : <Navigate to='/login' replace />
          } />

        </Routes>
      </GeneralLayout>
    </LanguageProvider>
  );
}

export default App;