import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  useTheme,
  Grid
} from '@mui/material';

import {
  AdminPanelSettings as AdminIcon,
  AccountBalance as TreasurerIcon,
  People as MemberIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const RoleSelector = ({ roles, onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = React.useState(null);
  const theme = useTheme();

  const {t} = useTranslation();

  const roleDetails = {
    admin: {
      icon: <AdminIcon fontSize='large' />,
      color: theme.palette.error.main,
      description: t('eti_desc_role_admin')
    },
    treasurer: {
      icon: <TreasurerIcon fontSize='large' />,
      color: theme.palette.warning.main,
      description: t('eti_desc_role_treasurer')
    },
    member: {
      icon: <MemberIcon fontSize='large' />,
      color: theme.palette.info.main,
      description: t('eti_desc_role_member')
    }
  };

  const handleSelection = () => {
    if (selectedRole) onRoleSelect(selectedRole);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant='h4' align='center' gutterBottom>
        {t('eti_role_selection')}
      </Typography>
      
      <Grid container spacing={3} justifyContent='center' component='section'>
        {roles.map((role) => {
          const details = roleDetails[role.toLowerCase()] || {};
          const isSelected = selectedRole === role;
          return (
            <Grid size={{xs: 12, sm: 6, md:5}} key={role}>
              <Card
                component='article'
                onClick={() => setSelectedRole(role)}
                sx={{
                  cursor: 'pointer',
                  border: isSelected ? 2 : 0,
                  borderColor: details.color,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: details.color,
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    {details.icon}
                  </Avatar>
                  <Typography variant='h6' component='h2'>
                    {t('eti_name_'+role.toLowerCase())}
                  </Typography>
                  
                  <Typography variant='body2' color='text.secondary'>
                    {details.description }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant='contained'
          size='large'
          className='button'
          onClick={handleSelection}
          disabled={!selectedRole}
          aria-label={t('eti_continue_as_' + (selectedRole || ''))}
        >
          {t('eti_continue_as_' + (selectedRole || ''))}
        </Button>
      </Box>
    </Box>
  );
};

RoleSelector.propTypes ={
    roles : PropTypes.arrayOf(
        PropTypes.oneOf(['ADMIN','TREASURER','MEMBER']).isRequired
    ).isRequired,
    onRoleSelect : PropTypes.func.isRequired
}

export default RoleSelector;