import { Avatar, Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useTranslation } from "react-i18next";

const drawerWidth = 240;

const menuItems = [
    {text: 'Inicio', icon: '', path: '/home' }
];

export default function Sidebar(){

    const {user} = useUser();
    const {t} = useTranslation();

    if(!user) return null;


    return(
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`&.MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'},
            }}
        >
            <Box p={2} display="flex" flexDirection="column" alignItems="center">
                <Avatar sx={{width: 64, height: 64, mb: 1}}>{user.username.charAt(0).toUpperCase()}</Avatar>
                <Typography fontWeight="bold">{user.username}</Typography>
                <Typography>{t('eti_name_'+user.rolename.toLowerCase())}</Typography>
            </Box>
            <List>
                {menuItems.map(({text, icon, path}) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton LinkComponent={Link} to={path}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}