import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles'; 
import theme from './theme'; 
import { Box, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, clearError } from './redux/userSlice';
import { ScrollProvider } from './context/ScrollContext';
import CreateUser from './components/CreateUser';
import ProductList from './components/ProductList';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import About from './components/About';
import Checkout from './components/Checkout';
import UserProducts from './components/UserProducts';
import UserAccount from './components/UserAccount';
import EditUser from './components/EditUser';

function App() {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setOpen(true); 
    }
  }, [error]);

  const handleClose = () => {
    setOpen(false); 
    dispatch(clearError()); 
  };

  return (
    <ScrollProvider>
      <ThemeProvider theme={theme}> 
        <Router>
          <Box sx={{ width: '100%', height: '100vh' }}>
            <NavBar />
            <Box sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingTop: '2rem',
              minHeight: 'calc(100vh - 64px)'
            }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/add-product" element={<Checkout />} />
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/about" element={<About />} />
                <Route path="/myProducts" element={<UserProducts />} />
                <Route path="/account" element={<UserAccount />} />
                <Route path="/editUser" element={<EditUser />} />
              </Routes>
            </Box>
          </Box>
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="error">
              {error}
            </Alert>
          </Snackbar>
        </Router>
      </ThemeProvider>
    </ScrollProvider>
  );
}

export default App;
