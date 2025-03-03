import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AccountMenu from './AccountMenu';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import ContactUs from './ContactUs';
import logo from '../assets/Logo.png';

export default function NavBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  const [openContact, setOpenContact] = useState(false);
  const isLoggedIn = Boolean(user);

  const buttonStyles = {
    color: 'rgb(90, 59, 65)',
    fontSize: {
      xs: '1rem',
      sm: '1.1rem',
      md: '1.2rem',
    },
    whiteSpace: 'nowrap',
    fontFamily: "'Heebo', sans-serif"
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
        <Toolbar sx={{ minHeight: '100px' }}>
          <AccountMenu isLoggedIn={isLoggedIn} />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, sm: 2, md: 3 } }}>
            <Button sx={buttonStyles} onClick={() => setOpenContact(true)}>
              צור קשר
            </Button>
            <Button sx={buttonStyles} component={Link} to="/about">
              אודות
            </Button>
            <Button sx={buttonStyles} component={Link} to="/products">
              מגילות
            </Button>
            <Button sx={buttonStyles} component={Link} to="/">
              בית
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src={logo} alt="Logo" style={{ height: '50px', width: 'auto', paddingRight: '100px', paddingLeft: '20px' }} />
          </Box>
        </Toolbar>
      </AppBar>
      <ContactUs open={openContact} onClose={() => setOpenContact(false)} />
    </>
  );
}
