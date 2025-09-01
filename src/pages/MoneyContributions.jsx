import { useEffect, useState } from "react";
import Sidebar from "../components/menus/Sidebar";
import Message from "../components/Messages/Message";

const MoneyContributions = () => {
    
    const [severityMessage, setSeverityMessage] = useState('warning');
    const [message, setMessage] = useState(null);
    
    

    useEffect(() => {

    }, []);

    return (
        <div className='divPag'>
            <Sidebar />
            <Message severity={severityMessage} open={!!message} onClose={() => setMessage(null)}>
                {message}
            </Message>
        </div>
    );
};

export default MoneyContributions;