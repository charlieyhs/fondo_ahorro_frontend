import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const PrivateRoute = ({children}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? (children) : (
    <Navigate to="/login" state={{from : location}} replace />
  )
};

PrivateRoute.propTypes = {
    children : PropTypes.node
}

export default PrivateRoute;
