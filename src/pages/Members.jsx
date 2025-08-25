import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Sidebar from "../components/menus/Sidebar";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import apiClient from "../clients/apiClient";
import Message from "../components/Messages/Message";



const Members = () => {

    const {t} = useTranslation();
    const [members, setMembers] = useState([]);
    const [message, setMessage] = useState();
    const closeMessage = () => setMessage(null);

    useEffect(() => {
        const getMembers = async () => {
            try{
                const res = await apiClient.get('/savingsfund/members');
                if(res.data){
                    setMembers(res.data);
                }
            }catch(e){
                if(e.response){
                    setMessage(e.response.data.message);
                }else{
                    setMessage('Error obtaining members');
                }
            }
        }
        getMembers();
    }, []);

    return (
        <div className='divPag'>
            
            <Message severity='warning' open={!!message} onClose={closeMessage}>
                {message}
            </Message>
            <Sidebar />
            <div style={{display: 'flex', 
                        flexDirection:'column', 
                        width: '100%', 
                        margin: '20px'}}>
                <h1 style={{marginTop: '0px'}}>{t('pag_members')}</h1>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('eti_startdate')}</TableCell>
                                <TableCell>{t('eti_name')}</TableCell>
                                <TableCell>{t('eti_lastname')}</TableCell>
                                <TableCell>{t('eti_age')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                members.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.startdate}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.lastname}</TableCell>
                                        <TableCell>{row.age}</TableCell>
                                    </TableRow>
                                ))
                            }

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default Members;