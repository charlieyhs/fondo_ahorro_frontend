import authClient from "./authClient";

export const validateLogin = (credentials, setErrorUsername, setErrorPassword) => {
    if(!credentials.username){
        setErrorUsername(true);
        return false;
    }else if(!credentials.password){
        setErrorPassword(true);
        return false;
    }

    
    return true;
};

export const loginUser = async(credentials) => {
    try{
        const {data} = await authClient.post("/auth/login", credentials);

        if(data.success) {
            return {
                success : true,
                accessToken : data.data.accessToken || data.data.accessSelectRole,
                roles : data.data.roles || []
            }
        }
        
        return {
            success: false, 
            message: data.message || "Credenciales incorrectas"
        };
        

    }catch(error){
        let message = "Error conectando con el servidor";
        if(error.response){
            message = error.response.data.message;
        }else if(error.request){
            message = "No se recibió respuesta del servidor";
        }
        return {success: false, message: message};
    }
};
