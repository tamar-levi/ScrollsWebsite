import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Typography, Avatar, useMediaQuery, useTheme } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Snackbar, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { deleteUser, deleteUserProducts, logout } from '../redux/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserAccount() {
  const user = useSelector((state) => state.user.currentUser);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);
  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });


  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleDelete = async () => {
    handleDialogClose();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      await axios.delete('http://localhost:5000/usersApi/deleteUser', {
        headers: {
          Authorization: `Bearer ${token}`,
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

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '20px',
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
            marginTop: '120px',
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              margin: '0 auto',
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            {user?.fullName ? user.fullName.charAt(0) : 'א'}
          </Avatar>
          <Typography variant="h6" sx={{ mt: 2, fontFamily: 'Rubik, sans-serif' }}>
            {user?.fullName || 'שם לא זמין'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, fontFamily: 'Rubik, sans-serif' }}>
            {user?.displayName || 'שם תצוגה לא זמין'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {user?.email || 'אימייל לא זמין'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {user?.city || 'כתובת לא זמינה'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {user?.phoneNumber != 0 ? user?.phoneNumber : 'מספר טלפון לא צוין'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, flexDirection: isMobile ? 'column' : 'row' }}>
            <Button
              variant="contained"
              component={Link}
              to="/editUser"
              sx={{ width: isMobile ? '100%' : '48%', mb: isMobile ? 2 : 0 }}
            >
              עריכת פרטים
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDialogOpen}
              sx={{ width: isMobile ? '100%' : '48%' }}
            >
              מחיקת משתמש
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <DialogContentText>
            האם אתה בטוח שברצונך למחוק את המשתמש? המגילות שלך ימחקו גם כן.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">ביטול</Button>
          <Button
            onClick={handleDelete}
            color="error"
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
