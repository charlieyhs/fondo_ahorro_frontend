import { Avatar, Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useTranslation } from "react-i18next";
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import { useState } from "react";
import { useAuth } from '../../hooks/useAuth';
import LoadingBlocker from '../Loaders/LoadingBlocker';

const menuItems = [
    {id: 'home', icon: <HomeIcon/> , path: '/home' },
    {id: 'members', icon: <PeopleIcon/> , path: '/members' }
];

export default function Sidebar(){

    const {user} = useUser();
    const {t} = useTranslation();

    const { logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    if(!user) {return null;}

     const handleLogout = async () => {
        setLoading(true);
        await logout();
        setLoading(false);
        navigate('/login');
    };
   

    return(
        <>
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    position: 'relative',
                    height: '100%',
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        position: 'relative',
                        height: '100%',
                        boxSizing: 'border-box',
                        borderRight: 'none',
                        boxShadow: 'none',
                    }
                }}
            >
                <Box p={2} display="flex" flexDirection="row" alignItems="center">
                    <Avatar sx={{width: 40, height: 40}}>{user.username.charAt(0).toUpperCase()}</Avatar>
                    <div style={{marginLeft: '10px'}}>
                        <Typography fontWeight="bold">{user.username}</Typography>
                        <Typography>{t('eti_name_'+user.rolename.toLowerCase())}</Typography>
                    </div>
                </Box>
                <List>
                    {menuItems.map(({id, icon, path}) => (
                        <ListItem key={t('pag_'+id)} disablePadding>
                            <ListItemButton LinkComponent={Link} to={path}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={t('pag_'+id)}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Box mt="auto" p={2}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout} disabled={loading}>
                            <ListItemIcon><LogoutIcon /></ListItemIcon>
                            <ListItemText primary={t('logout')}/>
                        </ListItemButton>
                    </ListItem>
                </Box>
            </Drawer>

            <LoadingBlocker open={loading}/>
        </>
    );
}