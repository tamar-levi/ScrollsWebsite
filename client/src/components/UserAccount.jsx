import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Typography, Avatar, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { deleteUser, deleteUserProducts } from '../redux/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserAccount() {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDelete = async () => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את המשתמש? כל המוצרים שלך ימחקו גם כן.')) {
      console.log('User canceled deletion');
      return;
    }

    const token = localStorage.getItem('token');
    console.log('Token before delete request--------------------------:', token);

    try {
      await axios.delete('http://localhost:5000/usersApi/deleteUser', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('User deleted successfully');
      dispatch(deleteUserProducts());
      dispatch(deleteUser());
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('שגיאה במחיקת המשתמש, נסה שנית');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh', // To fill the entire screen vertically
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', // Align to the top
        padding: '20px',
      }}
    >
      <Box
        sx={{
          width: isMobile ? '90%' : '400px', // Adjust width for mobile
          textAlign: 'center',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#f9f9f9',
          padding: '20px',
          marginTop: '120px', // Increased margin to move the card further down
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
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {user?.email || 'אימייל לא זמין'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {user?.city || 'כתובת לא זמינה'}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, flexDirection: isMobile ? 'column' : 'row' }}>
          <Button
            variant="contained"
            component={Link}
            to="/editUser"
            sx={{ width: isMobile ? '100%' : '48%', mb: isMobile ? 2 : 0 }} // Full width on mobile
          >
            עריכת פרטים
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            sx={{ width: isMobile ? '100%' : '48%' }} // Full width on mobile
          >
            מחיקת משתמש
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
