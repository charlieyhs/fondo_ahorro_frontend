import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingBlocker from "../components/Loaders/LoadingBlocker";
import RoleSelector from "../components/data/RoleSelector";
import apiClient from "../utils/apiClient";
import Message from "../components/Messages/Message";

const RoleSelectionPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { applySelectedRole } = useAuth();

    const [availableRoles, setAvailableRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensajeError, setMensajeError] = useState(null);
    const loadingRef = useRef(null);

    useEffect(()=> {
        const handleUnload = () => {
            sessionStorage.removeItem('accessSelectRole');
            sessionStorage.removeItem('accessSelectRole_expiry');
            sessionStorage.removeItem('fromLogin');
        }
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, []);

    useEffect(() => {
        // Obtener los roles desde el estado de navegación
        const navigationState = location.state;
        const fromLogin = sessionStorage.getItem('fromLogin');

        if(!navigationState?.roles || !fromLogin){
            sessionStorage.removeItem('accessSelectRole');
            sessionStorage.removeItem('accessSelectRole_expiry');
            navigate('login', { replace:true });
            return;
        }
        sessionStorage.removeItem('fromLogin');
        setAvailableRoles(navigationState.roles);
        setLoading(false);

    }, [location.state, navigate]);

    const cerrarMensaje = () => setMensajeError(null);

    const handleRoleSelect = async (selectedRole) => {
        setLoading(true);
        const accessSelectRole = sessionStorage.getItem('accessSelectRole');
        if(accessSelectRole){
          const accessToken = sessionStorage.getItem('accessSelectRole');
          const expiry = parseInt(sessionStorage.getItem('accessSelectRole_expiry'), 10);
          const isTokenExpired = !accessToken || !expiry || Date.now() > expiry;
          if(isTokenExpired){
            sessionStorage.removeItem('accessSelectRole');
            sessionStorage.removeItem('accessSelectRole_expiry');
            navigate('login', { replace:true });
            return;
          }
        }

        
        try{
            const res = await apiClient.post('/auth/change-active-role', null, {
                params : {newRole : selectedRole}
            });
            const {accessToken, refreshToken} = res.data.data;
            if(!accessToken || !refreshToken){
                throw new Error("No han llegado los datos necesarios.");
            }
            applySelectedRole({accessToken, refreshToken});
    
            const from = location.state?.from?.pathname || '/home';
    
            navigate(from, {replace: true});
        }catch{
            setMensajeError('No se pudo establecer el rol. Intenta nuevamente');
        }finally{
            setLoading(false);
        }
    };

    
    return (
        <div className='role-selection-page' ref={loadingRef}>
            <Message open={!!mensajeError} onClose={cerrarMensaje} severity="error">
                {mensajeError}
            </Message>

            <RoleSelector
                roles={availableRoles}
                onRoleSelect={handleRoleSelect}/>

            <LoadingBlocker open={loading} parentRef={loadingRef}/>
            
        </div>
    );

};

export default RoleSelectionPage;