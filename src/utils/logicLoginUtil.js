import apiClient from "./apiClient";

export const validateLogin = (credentials, setErrorUsername, setErrorPassword) => {
    if(!credentials.login){
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
        const response = await apiClient.post("/auth/login", credentials);

        if(response.status === 200){
            const {token} = response.data;
            localStorage.setItem("authToken", token);
            return {success: true, token};
        }else {
            return {success: false, message: "Credenciales incorrectas"};
        }

    }catch(error){
        let message = "Error conectando con el servidor";
        if(error.response){
            const {data} = error.response;
            message = data ? Object.keys(data).map(field => `${data[field]}`).join(",") : "Error en la solicitud";
        }else if(error.request){
            message = "No se recibió respuesta del servidor";
        }
        return {success: false, message: message};
    }
};