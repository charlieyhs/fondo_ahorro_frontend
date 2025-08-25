import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ESFlag from '../../assets/images/spain-flag.svg'
import USFlag from '../../assets/images/usa-flag.svg'
import { Button, Fade, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { ArrowDropUp as ArrowUp, ArrowDropDown as ArrowDown } from "@mui/icons-material";
import '../../css/General.css'
import { LazyLoadImage } from "react-lazy-load-image-component";

const LanguageSelector = () => {
    const colorPurple = "#696ceb";
    const {t, i18n} = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    // Mostrar el componente unicamente despues de que se ejecute el useEffect
    const [showComponent, setShowComponent] = useState(false);

    const setLanguage = useCallback(async (lng, callback) => {
        try {
            await i18n.changeLanguage(lng);
            document.body.dir = i18n.dir(lng);
            localStorage.setItem('selectedLanguage', lng);
            if (typeof callback === 'function') {
                callback();
            }
        } catch (error) {
            console.error('Error when changing the language:', error);
        }
    }, [i18n]);


    useEffect(()=>{
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'es';
        setLanguage(savedLanguage, () => setShowComponent(true));
    },[setLanguage]);


    const languages = useMemo(() => [
        {code : 'es', name: t('eti_spanish'), flag: ESFlag},
        {code : 'en', name: t('eti_english'), flag: USFlag}
    ],[t]);

    const currentLanguage = useMemo(() => 
        languages.find(lng => lng.code === i18n.language)
        ,[i18n.language, languages]
    );

    const handleChangeLanguage = useCallback((lng) => {
        setLanguage(lng, () => setAnchorEl(null));
    },[setLanguage]);

    if(!showComponent) return null;

    return(
        <div className='containerStyles'>
            <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                variant='outlined'
                aria-controls="language-menu"
                aria-haspopup="true"
                aria-expanded={open}
                aria-label={t('eti_change_language')}
                sx={{
                    minWidth: 120,
                    width: 120,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'all 0.3s ease',
                    borderColor: colorPurple,
                    '&:hover': { 
                        backgroundColor: '#f0f0f0',
                        borderColor: colorPurple
                    }
                }}
                startIcon={
                    <LazyLoadImage
                        src={languages.find(lng => lng.code === i18n.language).flag}
                        alt={`${currentLanguage.name}`} 
                        title={`${currentLanguage.name}`}
                        className='flagStyles'/>
                }>
                <span style={{color:colorPurple}}>{i18n.language}</span>
                {open ? <ArrowUp sx={{color:colorPurple}}/> : <ArrowDown sx={{color:colorPurple}}/>}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                slots={{
                    transition: Fade
                }}
                slotProps={{
                    list : {sx:{py: 0, minWidth: 150}}
                }}
                transitionDuration={200}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={() => setAnchorEl(null)}
            >
                {languages.map((lang) => (
                    <MenuItem
                        key={lang.code}
                        onClick={() => handleChangeLanguage(lang.code)}
                        selected={i18n.language === lang.code}
                        sx={{
                            display: 'flex',
                            gap : 1.5,
                            py: 1.5,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:last-child' : {borderBottom: 'none'}
                        }}>
                        <ListItemIcon sx={{minWidth: 30,
                            width: 30,
                            height: 20
                         }}>
                            <LazyLoadImage src={lang.flag} 
                                alt={`${t('eti_flag_'+lang.name)}`}
                                title={`${t('eti_flag_'+lang.name)}`}
                                width={20}
                                height={15}
                                effect="opacity"/>
                        </ListItemIcon>
                        {lang.name}
                    </MenuItem>
                ))}
            </Menu>

        </div>
    );
};

export default React.memo(LanguageSelector);