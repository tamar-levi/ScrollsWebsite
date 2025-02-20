import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser, deleteUserProducts, updateUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Avatar, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

export default function EditUser() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
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


  const handleSave = async () => {
    setLoading(true);
    const userData = {};

    if (fullName !== user.fullName) userData.fullName = fullName;
    if (displayName !== user.displayName) userData.displayName = displayName;
    if (email.toLowerCase() !== user.email.toLowerCase()) userData.email = email;
    if (city !== user.city) userData.city = city;
    if (phone != user.phoneNumber) userData.phone = phone;

    if (Object.keys(userData).length === 0) {
      setSnackbar({ open: true, message: 'לא בוצע שינוי בשדות', severity: 'info' });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put('https://scrolls-website.onrender.com/usersApi/updateUserDetails', userData, {
        withCredentials: true
      });

      if (response.data) {
        dispatch(updateUser(response.data));
        localStorage.setItem('user', JSON.stringify(response.data));
        setSnackbar({ open: true, message: 'הפרטים עודכנו בהצלחה', severity: 'success' });
        setTimeout(() => {
          navigate('/account');
        }, 1500);
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
      await axios.delete('https://scrolls-website.onrender.com/usersApi/deleteUser', {
        withCredentials: true
      });
      dispatch(deleteUserProducts());
      dispatch(deleteUser());
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      console.error('Error deleting user:', err);
      setSnackbar({ open: true, message: 'שגיאה במחיקת המשתמש, נסה שנית', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleGoBack = () => {
    navigate('/account');
  };
  return (
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
          width: isMobile ? '90%' : '400px',
          textAlign: 'center',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#f9f9f9',
          padding: '20px',
        }}
      >
        <Avatar sx={{ width: 60, height: 60, margin: 'auto', bgcolor: 'primary.main' }}>
          {user?.fullName ? user.fullName.charAt(0) : 'א'}
        </Avatar>
        <Typography variant="h6" sx={{ mt: 2 }}>עריכת חשבון</Typography>
        <TextField
          fullWidth
          label="שם מלא"
          value={fullName}
          onChange={(e) => { setFullName(e.target.value); }}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="שם תצוגה"
          value={displayName}
          onChange={(e) => { setDisplayName(e.target.value); }}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="אימייל"
          value={email}
          onChange={(e) => { setEmail(e.target.value); }}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="כתובת"
          value={city}
          onChange={(e) => { setCity(e.target.value); }}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="טלפון"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); }}
          sx={{ mt: 2 }}
        />
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="outlined" onClick={handleGoBack}>חזרה</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'שומר...' : 'שמירה'}
          </Button>
        </Box>

        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          sx={{ mt: 2 }}
        >
          מחיקת משתמש
        </Button>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
