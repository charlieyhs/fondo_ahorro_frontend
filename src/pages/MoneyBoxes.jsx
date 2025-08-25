import { useEffect, useState } from "react";
import Sidebar from "../components/menus/Sidebar";
import Message from "../components/Messages/Message";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";
import apiClient from "../clients/apiClient";


const MoneyBoxes = () => {
    const {t} = useTranslation();

    const [message, setMessage] = useState();
    const closeMessage = () => setMessage(null);

    const [moneyBoxes, setMoneyBoxes] = useState([]);

    useEffect(() => {
        const getMoneyBoxes = async() => {
            try{
                const res = await apiClient.get('savingsfund/moneyboxes');
                if(res.data){
                    setMoneyBoxes(res.data);
                }
            }catch(e){
                if(e.response){
                    setMessage(e.response.data.message);
                }else{
                    setMessage('Error obtaining money boxes');
                }
            }
        }
        getMoneyBoxes();
    },[])

    return (
        <div className='divPag'>
            <Message severity='warning' open={!!message} onClose={closeMessage}>
                {message}
            </Message>
            <Sidebar/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width:'100%',
                margin:'20px',
            }}>
                <h1 style={{marginTop: '0px'}}>{t('pag_moneyboxes_title')}</h1>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('eti_startdate')}</TableCell>
                                <TableCell>{t('eti_name')}</TableCell>
                                <TableCell>{t('eti_responsible')}</TableCell>
                                <TableCell>{t('eti_isinvestment')}</TableCell>
                                <TableCell>{t('eti_currentrate')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                moneyBoxes.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.startDate}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.responsible}</TableCell>
                                        <TableCell>{row.investment}</TableCell>
                                        <TableCell>{row.currentRate}</TableCell>
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

export default MoneyBoxes;