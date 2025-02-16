import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateUser from './components/CreateUser';
import ProductList from './components/ProductList';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import About from './components/About';
import Checkout from './components/Checkout';
import UserProducts from './components/UserProducts';
import UserAccount from './components/UserAccount';
import EditUser from './components/EditUser';
import ContactUs from './components/ContactUs';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout, fetchUserData } from './redux/userSlice';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserData())
  }, [dispatch]);

  return (
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
            <Route path="/contactUs" element={<ContactUs />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
