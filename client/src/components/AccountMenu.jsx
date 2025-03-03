import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const firstLetter = user?.fullName ? user.fullName.charAt(0) : 'א';
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setOpenSnackbar(true);
    dispatch(logout());
    navigate('/');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', marginLeft: '50px', justifyContent: 'flex-start' }}>
        <Tooltip title={user?.fullName || 'אורח'}>
          <IconButton onClick={handleClick} >
            <Avatar sx={{ bgcolor: 'transparent', color: '#47515A' }}>
            <PersonOutlineIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: '300px',
              padding: '16px',
              '& .MuiMenuItem-root': {
                direction: 'rtl',
                fontFamily: 'Rubik, sans-serif'
              }
            }
          }}
        >
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Avatar sx={{ width: 60, height: 60, margin: '0 auto', bgcolor: 'rgb(90, 59, 65)' }}>
              {firstLetter}
            </Avatar>
            <Typography variant="h6" sx={{ mt: 1, fontFamily: 'Rubik, sans-serif' }}>
              {user?.fullName || 'אורח'}
            </Typography>
            {user?.email && (
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            )}
          </Box>

          {user && (
            <>
              <MenuItem component={Link} to="/account" onClick={handleClose} dir="rtl">
                <ListItemIcon sx={{ marginLeft: 1 }}>
                  <AccountCircleIcon />
                </ListItemIcon>
                החשבון שלי
              </MenuItem>
              <MenuItem component={Link} to="/myProducts" onClick={handleClose} dir="rtl">
                <ListItemIcon sx={{ marginLeft: 1 }}>
                  <InventoryIcon />
                </ListItemIcon>
                המגילות שלי
              </MenuItem>
              <MenuItem onClick={handleLogout} dir="rtl">
                <ListItemIcon sx={{ marginLeft: 1 }}>
                  <LogoutIcon />
                </ListItemIcon>
                התנתק
              </MenuItem>
            </>
          )}
        </Menu>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          התנתקותך בוצעה בהצלחה
        </Alert>
      </Snackbar>
    </>
  );
}