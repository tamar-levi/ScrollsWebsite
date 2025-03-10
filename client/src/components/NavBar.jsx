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
import logo from '../assets/Logo.png';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useScroll } from '../context/ScrollContext';

export default function NavBar() {
  const theme = useTheme();
  const { aboutRef, contactRef } = useScroll();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  const [openContact, setOpenContact] = useState(false);
  const isLoggedIn = Boolean(user);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const menuItems = [
    { text: 'בית', path: '/' },
    { text: 'מגילות', path: '/products' },
    { text: 'אודות', path: '/about' },
    { text: 'צור קשר', action: () => setOpenContact(true) }
  ];

  const scrollToSection = (ref) => {
    navigate('/');
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
        <Toolbar sx={{ minHeight: '100px' }}>
          <AccountMenu isLoggedIn={isLoggedIn} />
          <Box sx={{ flexGrow: 1 }} />

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
                sx={{ color: 'rgb(90, 59, 65)' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    onClick={() => {
                      handleClose();
                      if (item.action) {
                        item.action();
                      } else {
                        navigate(item.path);
                      }
                    }}
                    sx={buttonStyles}
                  >
                    {item.text}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, sm: 2, md: 3 } }}>
              <Button sx={buttonStyles}>
                בקרוב!! סופרים
              </Button>
              <Button sx={buttonStyles}>
                בקרוב!! מזוזות
              </Button>
              <Button sx={buttonStyles} onClick={() => scrollToSection(aboutRef)}>
                אודות
              </Button>
              <Button sx={buttonStyles} onClick={() => scrollToSection(contactRef)}>
                צור קשר
              </Button>
              <Button sx={buttonStyles} component={Link} to="/products">
                מגילות
              </Button>
              <Button sx={buttonStyles} component={Link} to="/">
                בית
              </Button>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src={logo} alt="Logo" style={{ height: '50px', width: 'auto', paddingRight: '100px', paddingLeft: '20px' }} />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
