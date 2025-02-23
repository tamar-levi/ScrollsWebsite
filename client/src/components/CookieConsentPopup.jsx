import { useState } from "react";
import Cookies from "js-cookie";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, IconButton, Box } from "@mui/material";
import CookieIcon from '@mui/icons-material/Cookie'; 

const CookieConsentPopup = ({ onConsent }) => {
  const [isConsentGiven, setIsConsentGiven] = useState(Cookies.get("cookieConsent") === "true");

  const handleAccept = () => {
    Cookies.set("cookieConsent", "true", { expires: 365 });
    setIsConsentGiven(true);
    onConsent(true);
  };

  const handleReject = () => {
    Cookies.set("cookieConsent", "false", { expires: 365 });
    setIsConsentGiven(false);
    onConsent(false);
  };

  return (
    <Dialog open={!isConsentGiven} onClose={handleReject} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: { xs: '1.2rem', sm: '1.4rem' }, fontFamily: 'Roboto, sans-serif' }}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <CookieIcon sx={{ fontSize: { xs: 30, sm: 35 }, marginRight: 2 }} />
          הסכמה לשימוש בקבצי קוקיז
        </Box>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, fontFamily: 'Roboto, sans-serif' }}>
          האתר הזה משתמש בקבצי קוקיז לשיפור חוויית המשתמש. עליך לאשר את השימוש בקובצי קוקיז כדי להמשיך
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button 
          onClick={handleReject} 
          color="secondary" 
          variant="outlined" 
          sx={{ marginRight: 2, fontSize: { xs: '0.8rem', sm: '1rem' }, padding: '6px 16px', fontFamily: 'Roboto, sans-serif' }}
        >
          לא מסכים
        </Button>
        <Button 
          onClick={handleAccept} 
          color="primary" 
          variant="contained" 
          sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, padding: '6px 16px', fontFamily: 'Roboto, sans-serif' }}
        >
          אני מסכים
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CookieConsentPopup;
