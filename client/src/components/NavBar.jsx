import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AccountMenu from './AccountMenu';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function NavBar() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleProductsNavigation = () => {
    if (!isLoggedIn) {
      alert("עליך להתחבר כדי לצפות במוצרים");
    } else {
      navigate("/products");
    }
  };

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const buttonStyles = {
    color: theme.palette.primary.main,
    fontFamily: 'Rubik, sans-serif',
    fontSize: {
      xs: '0.8rem',
      sm: '0.9rem',
      md: '1rem',
    },
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: 'transparent',
      borderBottom: `2px solid ${theme.palette.primary.main}`
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
      <Toolbar>
        <AccountMenu color={theme.palette.primary.main} />
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.4, sm: 3, md: 3 } }}>
          <Button sx={buttonStyles}>
            צור קשר
          </Button>
          <Button sx={buttonStyles} component={Link} to="/about">
            אודות
          </Button>
          <Button sx={buttonStyles} component={Link} to="/products" onMouseEnter={handleMouseEnter} onClick={handleProductsNavigation}
          >
            מוצרים
          </Button>
          <Button sx={buttonStyles} component={Link} to="/">
            בית
          </Button>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
              fontFamily: 'Rubik, sans-serif',
              fontWeight: 500,
              fontSize: {
                xs: '0.8rem',
                sm: '1rem',
                md: '1.25rem',
              },
              textAlign: 'center',
              width: '100%',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.2
            }}
          >
            לוח המגילות
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
