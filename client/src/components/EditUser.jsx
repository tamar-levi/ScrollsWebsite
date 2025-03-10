import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser, deleteUserProducts, updateUser, logout } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Avatar, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // אייקון איקס
import { Modal } from '@mui/material';
import IconButton from '@mui/material/IconButton';


export default function EditUser({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState(user?.city || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [openModal, setOpenModal] = useState(open);


  const handleSave = async () => {
    setLoading(true);
    const userData = {};

    if (fullName !== user.fullName) userData.fullName = fullName;
    if (displayName !== user.displayName) userData.displayName = displayName;
    if (email.toLowerCase() !== user.email.toLowerCase()) userData.email = email;
    if (city !== user.city) userData.city = city;
    if (phone != user.phoneNumber) userData.phoneNumber = phone;

    if (Object.keys(userData).length === 0) {
      setSnackbar({ open: true, message: 'לא בוצע שינוי בשדות', severity: 'info' });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put('https://scrolls-website.onrender.com/usersApi/updateUserDetails', userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data) {
        dispatch(updateUser(response.data));
        localStorage.setItem('user', JSON.stringify(response.data));
        setSnackbar({ open: true, message: 'הפרטים עודכנו בהצלחה', severity: 'success' });
      }
    } catch (err) {
      console.error('Error updating user:', err);
      if (err.response && err.response.data === 'Email already exists') {
        setError('המייל כבר קיים, אנא השתמש במייל אחר');
      } else {
        setError('לא הצלחנו לעדכן את הפרטים, נסה שנית');
      }
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את המשתמש? המגילות שלך ימחקו גם כן.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete('https://scrolls-website.onrender.com/usersApi/deleteUser', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      dispatch(deleteUserProducts());
      dispatch(deleteUser());
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error('Error deleting user:', err);
      setSnackbar({ open: true, message: 'שגיאה במחיקת המשתמש, נסה שנית', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-user-modal">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
          padding: '10px',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '600px',
            height: '500px',  
            left: 'calc(50% - 600px/2 - 0.4px)',
            top: 'calc(50% - 500px/2)',
            backgroundColor: '#FFFFFF',
            borderRadius: '52px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
            }}
            onClick={onClose}
          >
            <CloseIcon sx={{ color: '#000' }} />
          </IconButton>

          <Typography
            sx={{
              background: 'rgba(230, 219, 201, 1)',
              borderRadius: '39px',
              color: 'rgba(0, 0, 0, 1)',
              fontFamily: 'Heebo, sans-serif',
              fontWeight: 'bold',
              padding: {
                xs: '5px 40px',  
                sm: '5px 80px',  
                md: '5px 170px', 
              },
              textAlign: 'center',
              width: 'fit-content',
              margin: '0 auto',
              marginBottom: '50px',
              fontSize: {
                xs: '1rem',  
                sm: '1rem',   
                md: '1rem',
              }
            }}
          >
            עריכת פרטי חשבון
          </Typography>
          <input
            type="text"
            placeholder="שם מלא"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              background: '#5A3B41',
              width: '60%',
              borderRadius: '78.65px',
              border: 'none',
              padding: '5px 20px',
              color: 'white',
              outline: 'none',
              marginBottom: '10px',
              fontWeight: 300,
              fontFamily: 'Heebo, sans-serif',
            }}
          />
          <input
            type="text"
            placeholder="שם תצוגה"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{
              background: '#5A3B41',
              width: '60%',
              borderRadius: '78.65px',
              border: 'none',
              padding: '5px 20px',
              color: 'white',
              outline: 'none',
              marginBottom: '10px',
              fontWeight: 300,
              fontFamily: 'Heebo, sans-serif',
            }}
          />
          <input
            type="email"
            placeholder="מייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: '#5A3B41',
              width: '60%',
              borderRadius: '78.65px',
              border: 'none',
              padding: '5px 20px',
              color: 'white',
              outline: 'none',
              marginBottom: '10px',
              fontWeight: 300,
              fontFamily: 'Heebo, sans-serif',
            }}
          />
          <input
            type="text"
            placeholder="עיר"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              background: '#5A3B41',
              width: '60%',
              borderRadius: '78.65px',
              border: 'none',
              padding: '5px 20px',
              color: 'white',
              outline: 'none',
              marginBottom: '10px',
              fontWeight: 300,
              fontFamily: 'Heebo, sans-serif',
            }}
          />
          <input
            type="text"
            placeholder="מספר טלפון"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              background: '#5A3B41',
              width: '60%',
              borderRadius: '78.65px',
              border: 'none',
              padding: '5px 20px',
              color: 'white',
              outline: 'none',
              marginBottom: '10px',
              fontWeight: 300,
              fontFamily: 'Heebo, sans-serif',
            }}
          />

          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%', marginTop: '50px' }}>
            <Button
              onClick={onClose}
              sx={{
                width: '170px',
                height: '25px',
                background: '#47515A',
                borderRadius: '50.05px',
                color: 'white',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                marginRight: '-50px',
                fontWeight: 300,
                fontFamily: 'Heebo, sans-serif',
              }}
            >
              חזרה
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              sx={{
                width: '170px',
                height: '25px',
                background: '#47515A',
                borderRadius: '50.05px',
                color: 'white',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: 'none',
                outline: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 300,
                fontFamily: 'Heebo, sans-serif',
              }}
            >
              {loading ? 'שומר...' : 'שמירה'}
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              sx={{
                width: '170px',
                height: '25px',
                background: '#47515A',
                borderRadius: '50.05px',
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                border: 'none',
                outline: 'none',
                padding: '0 10px',
                cursor: 'pointer',
                fontWeight: 300,
                fontFamily: 'Heebo, sans-serif',
              }}
            >
              מחיקת משתמש
            </Button>
          </Box>
          <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Modal>
  )
};
