import apiClient from "./apiClient";

export const validarLogin = (credentials, setErrorUsername, setErrorPassword) => {
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
        const response = await apiClient.post("/login", credentials);

        if(response.status === 200){
            const {token} = response.data;
            localStorage.setItem("authToken", token);
            return {success: true, token};
        }else {
            return {success: false, message: "Credenciales incorrectas"};
        }

    }catch(error){
        console.log(error);
        return {success: false, message: "Error conectando con el servidor"};
    }
};