import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Mail, Phone } from 'lucide-react';

const ContactUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box
      sx={{
        minHeight: '100vh', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', 
        padding: 2,
        marginTop: isMobile ? '60px' : '120px', 
      }}
    >
      <Card
        sx={{
          width: isMobile ? '95%' : isTablet ? '85%' : '70%', 
          maxWidth: 1000,
          padding: isMobile ? 3 : 5,
          textAlign: 'center',
          borderRadius: 4,
          boxShadow: 5,
          backgroundColor: 'white',
        }}
      >
        <CardContent>
          <Typography
            variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
            fontWeight="bold"
            gutterBottom
            sx={{ color: '#333', textShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}
          >
            📜 צור קשר
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ mb: 3, fontSize: isMobile ? '0.9rem' : isTablet ? '1rem' : '1.2rem', fontWeight: '500' }}
          >
            לכל מקרה ובעיה, אנחנו פה איתך! ניתן לפנות אלינו במייל או בטלפון
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" gap={1} sx={{ mb: 2, flexDirection: isMobile ? 'column' : 'row' }}>
            <Mail size={isMobile ? 20 : 24} color="#1976d2" />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: isMobile ? '1rem' : '1.2rem' }}>
                ScrollsSite@gmail.com
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" gap={1} sx={{ flexDirection: isMobile ? 'column' : 'row' }}>
            <Phone size={isMobile ? 20 : 24} color="#1976d2" />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: isMobile ? '1rem' : '1.2rem' }}>
            052-7672693
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContactUs;
