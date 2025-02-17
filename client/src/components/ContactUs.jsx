import React from 'react';
import { Modal, Box, Card, CardContent, Typography, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { Mail, Phone, X, MessageCircle } from 'lucide-react';

const ContactUs = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="contact-us-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{
          width: isMobile ? '95%' : isTablet ? '85%' : '70%',
          maxWidth: 500,
          padding: isMobile ? 3 : 4,
          textAlign: 'center',
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: 'white',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <X size={24} />
        </IconButton>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <MessageCircle size={28} color="#1976d2" />
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" sx={{ color: '#333' }}>
              צור קשר
            </Typography>
          </Box>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: 3, fontSize: isMobile ? '0.9rem' : '1rem', fontWeight: '500' }}
          >
            לכל מקרה ובעיה, אנחנו פה איתך! ניתן לפנות אלינו במייל או בטלפון
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" gap={1} sx={{ mb: 2, flexDirection: isMobile ? 'column' : 'row' }}>
            <Mail size={20} color="#1976d2" />
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              ScrollsSite@gmail.com
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" gap={1} sx={{ flexDirection: isMobile ? 'column' : 'row' }}>
            <Phone size={20} color="#1976d2" />
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              052-7672693
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default ContactUs;
