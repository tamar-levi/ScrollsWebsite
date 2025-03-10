import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Typography, Avatar, useMediaQuery, useTheme } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import EditUser from './EditUser';
import { Modal } from '@mui/material';
import { Link } from 'react-router-dom';
import { deleteUser, deleteUserProducts, logout } from '../redux/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';



export default function UserAccount({ open, onClose }) {
  const user = useSelector((state) => state.user.currentUser);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleDelete = async () => {
    handleDialogClose();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      await axios.delete('https://scrolls-website.onrender.com/usersApi/deleteUser', {
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
      <Modal open={open} onClose={onClose} aria-labelledby="user-account-modal">
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
              width: isMobile ? '95%' : '500px',
              textAlign: 'center',
              boxShadow: 3,
              borderRadius: 6,
              backgroundColor: '#f9f9f9',
              padding: '20px',
              marginTop: '120px',
              position: 'relative'
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
                padding: '1px 100px',
                textAlign: 'center',
                width: 'fit-content',
                margin: '0 auto',
                marginBottom: '40px',
                marginTop: '20px',
              }}
            >
              החשבון שלי
            </Typography>
            <PersonOutlineIcon sx={{ fontSize: '80px', color: '#757575' }} />

            <Typography variant="h6" sx={{ mt: 1, fontFamily: 'Heebo, sans-serif', color: '#47515A' }}>
              {user?.fullName || 'שם לא זמין'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontFamily: 'Heebo, sans-serif' }}>
              {user?.displayName || 'שם תצוגה לא זמין'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontFamily: 'Heebo, sans-serif' }}>
              {user?.email || 'אימייל לא זמין'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontFamily: 'Heebo, sans-serif' }}>
              {user?.city || 'כתובת לא זמינה'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontFamily: 'Heebo, sans-serif' }}>
              {user?.phoneNumber != 0 ? user?.phoneNumber : 'מספר טלפון לא צוין'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 3,
                gap: 1.5,
                marginBottom: '20px',
                flexDirection: isMobile ? 'column' : 'row'
              }}
            >
              <Button
                onClick={() => setOpenModal(true)}
                sx={{
                  width: isMobile ? '90%' : '35%',
                  background: '#47515A',
                  borderRadius: '50.05px',
                  color: 'white',
                  height: '26px',
                  fontSize: '14px',
                  fontWeight: 300,
                  fontFamily: 'Heebo, sans-serif',
                  '&:hover': {
                    background: '#3B454E'
                  }
                }}
              >
                עריכת פרטים
              </Button>
              <Button
                onClick={handleDialogOpen}
                sx={{
                  width: isMobile ? '90%' : '35%',
                  background: '#47515A',
                  borderRadius: '50.05px',
                  color: 'white',
                  height: '26px',
                  fontSize: '14px',
                  fontWeight: 300,
                  fontFamily: 'Heebo, sans-serif',
                  '&:hover': {
                    background: '#3B454E'
                  }
                }}
              >
                מחיקת משתמש
              </Button>
            </Box>

            <EditUser open={openModal} onClose={() => setOpenModal(false)} />
          </Box>
        </Box>
      </Modal>

      <Dialog open={openDialog} onClose={handleDialogClose} sx={{
        fontWeight: 300,
        fontFamily: 'Heebo, sans-serif', direction: 'rtl',
      }}>
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
  )
};
