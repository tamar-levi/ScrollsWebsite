import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateUser from './components/CreateUser';
import ProductList from './components/ProductList';
import PaymentForm from './components/PaymentForm';
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
import { logout } from './redux/userSlice';
import PaymentPage from './components/PaymentPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = tokenData.exp * 1000;

          if (Date.now() >= expirationTime) {
            dispatch(logout());
            alert('פג תוקף החיבור, אנא התחבר/י מחדש');
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Token validation error:', error);
          dispatch(logout());
        }
      }
    }, 1000);

    return () => clearInterval(tokenCheckInterval);
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
            <Route path="/payment" element={<PaymentForm />} />
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
