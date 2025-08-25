// pages/NotFound.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  ReportProblem as ErrorIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  // Opcional: Cambiar el título de la página
  useEffect(() => {
    document.title = '404 - Página no encontrada';
  }, []);

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          py: 4
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '6rem', md: '8rem' },
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                404
              </Typography>
              
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                {t('pag_404_notfound')}
              </Typography>
              
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: '400px', mx: { xs: 'auto', md: '0' } }}
              >
                {t('pag_404_desc_notfound')}
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={handleGoHome}
                  className='button'
                >
                  {t('pag_404_gobeginning')}
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleGoBack}
                  className='button'
                >
                  {t('pag_404_goback')}
                </Button>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ErrorIcon
                sx={{
                  fontSize: { xs: '15rem', md: '20rem' },
                  opacity: 0.7
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default NotFound;